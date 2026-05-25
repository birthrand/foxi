import os
from pathlib import Path

from dotenv import load_dotenv

REPO_ROOT = Path(__file__).resolve().parents[2]
PARENT_ENV = REPO_ROOT / ".env"
LOCAL_ENV = Path(__file__).resolve().parents[1] / ".env"


def load_env() -> None:
    """Load Stream + OpenAI keys from the repo root .env, then local overrides."""
    if PARENT_ENV.exists():
        load_dotenv(PARENT_ENV)
    if LOCAL_ENV.exists():
        load_dotenv(LOCAL_ENV, override=True)


def require_env(name: str) -> str:
    value = os.getenv(name, "").strip()
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


def validate_env() -> None:
    require_env("STREAM_API_KEY")
    require_env("STREAM_API_SECRET")
    require_env("OPENAI_API_KEY")
