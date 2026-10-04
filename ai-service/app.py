from typing import Optional, TypedDict
import json
import os
import tempfile
from base64 import b64decode
from datetime import datetime, timezone
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

try:
    from groq import Groq
except ImportError:  # pragma: no cover - safe fallback when dependency is unavailable
    Groq = None

try:
    from langchain_groq import ChatGroq
except ImportError:
    ChatGroq = None

try:
    from github import Github, Auth
except ImportError:
    Github = None
    Auth = None

# Load environment variables from current file folder and CWD
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)
load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
git_hub_token = os.getenv("GIT_HUB_TOKEN")

DEFAULT_GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

def get_groq_api_key():
    # Reload from file if needed
    load_dotenv(dotenv_path=env_path)
    return os.getenv("GROQ_API_KEY")

def get_chat_model():
    global model
    key = get_groq_api_key()
    if model is None and ChatGroq is not None and key:
        try:
            model = ChatGroq(api_key=key, model=DEFAULT_GROQ_MODEL, temperature=0.7)
        except Exception as exc:
            print(f"ChatGroq init failed: {exc}")
            model = None
    return model

def get_github_client():
    if Github is None:
        return None
    load_dotenv(dotenv_path=env_path)
    token = os.getenv("GIT_HUB_TOKEN")
    if token and Auth is not None and token.strip():
        try:
            return Github(auth=Auth.Token(token.strip()), retry=0, timeout=10)
        except Exception as exc:
            print(f"GitHub token auth failed: {exc}")
    return Github(retry=0, timeout=10)

github = get_github_client()
model = None
get_chat_model()


class ChatRequest(BaseModel):
    message: str


class ResumeAnalyzeRequest(BaseModel):
    filename: str
    content_type: str
    content_base64: str


app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Key check
api_key = os.getenv("GROQ_API_KEY")


def generate_response(message: str) -> str:
    current_key = get_groq_api_key()
    if not current_key:
        return "Error: GROQ_API_KEY is not set in ai-service/.env file."

    if Groq is None:
        return "Error: groq package is not installed in the AI service environment."

    try:
        client = Groq(api_key=current_key)
        completion = client.chat.completions.create(
            model=DEFAULT_GROQ_MODEL,
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": message},
            ],
        )
        return completion.choices[0].message.content or "No response generated."
    except Exception as exc:
        print(f"Groq Error: {exc}")
        return f"Error: {exc}"


@app.post("/chat")
async def chat(request: ChatRequest):
    response = generate_response(request.message)
    return {"reply": response}


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "api_key_set": bool(get_groq_api_key()),
        "github_token_set": bool(os.getenv("GIT_HUB_TOKEN")),
    }


def file_exists(repo, path):
    try:
        repo.get_contents(path)
        return True
    except Exception:
        return False


def fetch_profile(state):
    client = get_github_client()
    try:
        user = client.get_user(state["username"])
        state["profile"] = {
            "name": user.name or user.login,
            "username": user.login,
            "avatar_url": user.avatar_url,
            "html_url": user.html_url,
            "followers": user.followers,
            "following": user.following,
            "public_repos": user.public_repos,
            "bio": user.bio or "No bio provided.",
            "company": user.company or "N/A",
            "location": user.location or "N/A",
            "blog": user.blog or "N/A",
        }
        return state
    except Exception as exc:
        err_msg = str(exc)
        if "403" in err_msg or "rate limit" in err_msg.lower():
            raise HTTPException(
                status_code=429,
                detail="GitHub API rate limit reached for anonymous IP. Please add your GIT_HUB_TOKEN in minor_project/ai-service/.env to get 5,000 requests/hour."
            ) from exc
        raise HTTPException(status_code=404, detail=f"GitHub user '{state['username']}' not found.") from exc


def fetch_repositories(state):
    client = get_github_client()
    user = client.get_user(state["username"])
    # Fetch top 4 active public repositories
    state["repositories"] = [repo for _, repo in zip(range(4), user.get_repos(sort="pushed", direction="desc"))]
    return state


def analyze_repositories(state):
    reports = []
    for repo in state["repositories"]:
        last_commit_date = None
        days_since_last_commit = None
        if repo.pushed_at:
            last_commit_date = repo.pushed_at
            days_since_last_commit = (datetime.now(timezone.utc) - repo.pushed_at).days

        if days_since_last_commit is None:
            activity = "Unknown"
        elif days_since_last_commit <= 30:
            activity = "Active"
        elif days_since_last_commit <= 90:
            activity = "Inactive"
        else:
            activity = "Dormant"

        # Check license and basic flags directly from repo properties without extra network calls
        license_name = repo.license.name if repo.license else None

        reports.append({
            "name": repo.name,
            "description": repo.description or "No description provided.",
            "url": repo.html_url,
            "language": repo.language or "Unknown",
            "languages": [repo.language] if repo.language else ["Unknown"],
            "stars": repo.stargazers_count,
            "forks": repo.forks_count,
            "watchers": repo.watchers_count,
            "issues": repo.open_issues_count,
            "size_kb": repo.size,
            "default_branch": repo.default_branch,
            "last_commit_date": last_commit_date.isoformat() if last_commit_date else None,
            "days_since_last_commit": days_since_last_commit,
            "activity": activity,
            "readme": bool(repo.size > 0),
            "testing": bool(repo.size > 50),
            "cicd": False,
            "license": license_name,
        })

    state["repo_analysis"] = reports
    return state


def fetch_readme(state):
    readmes = []
    for repo in state["repositories"]:
        try:
            readme = repo.get_readme()
            content = b64decode(readme.content).decode("utf-8", errors="ignore")
        except Exception:
            content = "No README found."
        readmes.append({"name": repo.name, "content": content})
    state["readme_data"] = readmes
    return state


def fetch_commits(state):
    commit_reports = []
    for repo in state["repositories"]:
        try:
            commits = repo.get_commits()
            latest = commits[0]
            latest_message = latest.commit.message
            latest_date = latest.commit.author.date
            messages = [c.commit.message for _, c in zip(range(3), commits)]
            total_commits = len(messages)
        except Exception:
            total_commits = 0
            latest_message = "Unknown"
            latest_date = None
            messages = []
        commit_reports.append({
            "name": repo.name,
            "total_commits": total_commits,
            "latest_commit": latest_message,
            "latest_date": latest_date.isoformat() if latest_date else None,
            "messages": messages,
        })
    state["commit_data"] = commit_reports
    return state


def fetch_issues(state):
    issue_reports = []
    for repo in state["repositories"]:
        open_count = repo.open_issues_count or 0
        issue_reports.append({
            "name": repo.name,
            "total_issues": open_count,
            "open_issues": open_count,
            "closed_issues": 0,
            "recent_issues": [],
        })
    state["issue_data"] = issue_reports
    return state


def fetch_prs(state):
    pr_reports = []
    for repo in state["repositories"]:
        pr_reports.append({
            "name": repo.name,
            "open_prs": 0,
            "closed_prs": 0,
            "recent_prs": [],
        })
    state["pr_data"] = pr_reports
    return state


def ai_repository_review(state):
    chat_model = get_chat_model()
    if chat_model is None:
        raise HTTPException(status_code=500, detail="AI reviewer is not available because ChatGroq is not configured. Please set GROQ_API_KEY in minor_project/ai-service/.env and save the file.")

    reports = []
    # Fast review on top 1-2 key repositories
    for repo, readme, commit in zip(
        state["repo_analysis"][:2],
        state["readme_data"][:2],
        state["commit_data"][:2],
    ):
        prompt = f"""
You are a Senior Software Architect and GitHub Code Reviewer.
Review this repository concisely like an experienced software engineer.

Repository Name: {repo['name']}
Description: {repo['description']}
Primary Language: {repo['language']}
Stars: {repo['stars']} | Forks: {repo['forks']} | Open Issues: {repo['issues']}
Activity Status: {repo['activity']}
Days Since Last Commit: {repo['days_since_last_commit']}
Latest Commit: {commit['latest_commit']}

README Snippet:
{readme['content'][:1500]}

Provide the report in EXACTLY this format:

# Repository Review

## Overall Summary
(2-3 lines)

## Strengths
- Bullet points

## Weaknesses
- Bullet points

## Documentation
Score: X/10
Reason:

## Commit Quality
Score: X/10
Reason:

## Code Maintainability
Excellent / Good / Average / Poor
Reason:

## Production Readiness
Excellent / Good / Average / Poor
Reason:

## Suggestions
- Bullet points

## Final Repository Score
X/10

Do not use markdown tables.
"""
        try:
            response = chat_model.invoke(prompt)
            reports.append({"name": repo["name"], "ai_review": response.content})
        except Exception as exc:
            print(f"AI review error for {repo['name']}: {exc}")
            reports.append({"name": repo["name"], "ai_review": f"Review unavailable: {exc}"})
    state["repository_reports"] = reports
    return state


def identify_strongest_repo(repo_analysis):
    if not repo_analysis:
        return None
    def score_repo(r):
        score = (r.get("stars") or 0) * 10 + (r.get("forks") or 0) * 5
        if r.get("activity") == "Active":
            score += 15
        elif r.get("activity") == "Inactive":
            score += 5
        if r.get("readme"):
            score += 10
        if r.get("testing"):
            score += 10
        if r.get("cicd"):
            score += 5
        return score
    return max(repo_analysis, key=score_repo)


def calculate_github_score(profile: dict, repo_analysis: list, commit_data: list) -> dict:
    """Calculate a meaningful GitHub developer score (0-100) from real data."""
    score = 0
    breakdown = {}

    # 1. Profile completeness (max 10 pts)
    profile_pts = 0
    if profile.get("bio") and profile["bio"] != "No bio provided.":
        profile_pts += 3
    if profile.get("location") and profile["location"] != "N/A":
        profile_pts += 2
    if profile.get("blog") and profile["blog"] != "N/A":
        profile_pts += 2
    if profile.get("company") and profile["company"] != "N/A":
        profile_pts += 1
    if (profile.get("avatar_url") or ""):
        profile_pts += 2
    profile_pts = min(profile_pts, 10)
    breakdown["Profile Completeness"] = profile_pts
    score += profile_pts

    # 2. Community presence (max 15 pts)
    followers = profile.get("followers") or 0
    community_pts = min(followers // 5, 10)  # 1pt per 5 followers up to 10
    pub_repos = profile.get("public_repos") or 0
    community_pts += min(pub_repos // 3, 5)   # 1pt per 3 repos up to 5
    community_pts = min(community_pts, 15)
    breakdown["Community Presence"] = community_pts
    score += community_pts

    # 3. Repository quality (max 35 pts)
    if repo_analysis:
        active_count = sum(1 for r in repo_analysis if r.get("activity") == "Active")
        readme_count = sum(1 for r in repo_analysis if r.get("readme"))
        test_count = sum(1 for r in repo_analysis if r.get("testing"))
        total_stars = sum(r.get("stars") or 0 for r in repo_analysis)
        total_forks = sum(r.get("forks") or 0 for r in repo_analysis)
        n = len(repo_analysis)

        repo_pts = 0
        repo_pts += min(active_count * 5, 15)           # up to 15 for active repos
        repo_pts += min(readme_count * 3, 9)            # up to 9 for READMEs
        repo_pts += min(test_count * 2, 6)              # up to 6 for tests
        repo_pts += min(total_stars * 2, 10)            # up to 10 for stars
        repo_pts += min(total_forks * 1, 5)             # up to 5 for forks
        repo_pts = min(repo_pts, 35)
        breakdown["Repository Quality"] = repo_pts
        score += repo_pts
    else:
        breakdown["Repository Quality"] = 0

    # 4. Commit activity (max 25 pts)
    commit_pts = 0
    if commit_data:
        for c in commit_data:
            msgs = c.get("messages") or []
            # Good commit messages (not "update", "fix", etc.) show professionalism
            good_msgs = sum(1 for m in msgs if len(m.split()) >= 3)
            commit_pts += good_msgs * 3
        commit_pts = min(commit_pts, 25)
    breakdown["Commit Activity"] = commit_pts
    score += commit_pts

    # 5. Language diversity (max 15 pts)
    langs = set()
    for r in repo_analysis:
        if r.get("language") and r["language"] != "Unknown":
            langs.add(r["language"])
    lang_pts = min(len(langs) * 4, 15)
    breakdown["Language Diversity"] = lang_pts
    score += lang_pts

    final_score = min(max(score, 0), 100)

    # Grade
    if final_score >= 80:
        grade = "A"
        grade_label = "Exceptional"
    elif final_score >= 65:
        grade = "B"
        grade_label = "Strong"
    elif final_score >= 50:
        grade = "C"
        grade_label = "Average"
    elif final_score >= 35:
        grade = "D"
        grade_label = "Developing"
    else:
        grade = "F"
        grade_label = "Needs Work"

    return {
        "score": final_score,
        "grade": grade,
        "grade_label": grade_label,
        "breakdown": breakdown,
    }


def run_github_analysis(username: str):
    client = get_github_client()
    if client is None:
        raise HTTPException(status_code=500, detail="GitHub analyzer is not configured. PyGithub is not installed.")
    state = {
        "username": username,
        "profile": {},
        "repositories": [],
        "repo_analysis": [],
        "readme_data": [],
        "commit_data": [],
        "issue_data": [],
        "pr_data": [],
        "repository_reports": [],
    }
    try:
        state = fetch_profile(state)
        state = fetch_repositories(state)
        state = analyze_repositories(state)
        state = fetch_readme(state)
        state = fetch_commits(state)
        state = fetch_issues(state)
        state = fetch_prs(state)
        state = ai_repository_review(state)
    except HTTPException:
        raise
    except Exception as exc:
        err_msg = str(exc)
        if "403" in err_msg or "rate limit" in err_msg.lower():
            raise HTTPException(
                status_code=429,
                detail="GitHub API rate limit exceeded for anonymous requests. Please add a free GIT_HUB_TOKEN in minor_project/ai-service/.env for 5,000 requests/hour."
            ) from exc
        raise HTTPException(status_code=500, detail=f"GitHub analysis error: {err_msg}") from exc

    strongest = identify_strongest_repo(state["repo_analysis"])
    github_score = calculate_github_score(state["profile"], state["repo_analysis"], state["commit_data"])
    return {
        "profile": state["profile"],
        "github_score": github_score,
        "strongest_repo": strongest,
        "repo_analysis": state["repo_analysis"],
        "readme_data": state["readme_data"],
        "commit_data": state["commit_data"],
        "issue_data": state["issue_data"],
        "pr_data": state["pr_data"],
        "repository_reports": state["repository_reports"],
    }


@app.get("/github-analyzer")
def github_analyzer(username: Optional[str] = None):
    if not username:
        raise HTTPException(status_code=400, detail="Please provide a GitHub username.")
    return run_github_analysis(username)


@app.get("/resume_analyzer")
def resume_analyzer_get(pdf_path: Optional[str] = None):
    target_path = pdf_path or os.getenv("PDF_PATH")
    if not target_path:
        raise HTTPException(status_code=400, detail="Please provide a pdf_path.")
    return analyze_resume_file(target_path)


@app.post("/resume_analyzer")
async def resume_analyzer_post(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Please upload a PDF file.")

    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        content = await file.read()
        tmp.write(content)
        temp_path = tmp.name

    try:
        return analyze_resume_file(temp_path)
    finally:
        try:
            os.remove(temp_path)
        except OSError:
            pass


def analyze_resume_file(pdf_path: str):
    current_key = get_groq_api_key()
    if not current_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY is not set in minor_project/ai-service/.env file.")

    try:
        import pymupdf as fitz
    except ImportError:
        try:
            import fitz
        except ImportError as exc:
            raise HTTPException(status_code=500, detail=f"Missing PDF dependency: {exc}") from exc

    path = Path(pdf_path)
    if not path.exists():
        raise HTTPException(status_code=400, detail=f"PDF file not found: {pdf_path}")
    if path.suffix.lower() != ".pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    docs = fitz.open(str(path))
    text = ""
    for page in docs:
        text += page.get_text()
    docs.close()

    prompt = f"""
You are an ATS Resume Reviewer.
Analyze the resume below.
DO NOT use markdown.
DO NOT use ```json.
DO NOT explain anything.
Return ONLY valid JSON in this format:

{{
  "score": 80,
  "skills": [],
  "missing_keywords": [],
  "strengths": [],
  "weaknesses": [],
  "grammar_issues": [],
  "recommendations": []
}}

Resume:
{text}
"""

    if Groq is None:
        raise HTTPException(status_code=500, detail="groq package is not installed in the AI service environment.")

    try:
        client = Groq(api_key=current_key)
        response = client.chat.completions.create(
            model=DEFAULT_GROQ_MODEL,
            temperature=0.2,
            messages=[
                {"role": "system", "content": "You are an ATS Resume Reviewer. Return only valid JSON."},
                {"role": "user", "content": prompt},
            ],
        )
        raw_content = response.choices[0].message.content if response.choices else ""
        content = (raw_content or "").strip()
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()

        try:
            result = json.loads(content)
        except (TypeError, json.JSONDecodeError):
            result = {"error": raw_content}
        return {"review": result}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)