"""Top-level entrypoint for backend deployment on Vercel, Uvicorn, and ASGI servers."""
import sys
from pathlib import Path

# Ensure backend root directory is on Python search path
BACKEND_ROOT = Path(__file__).resolve().parent
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.main import app

# Export app symbol for ASGI / Vercel Python serverless runtime
__all__ = ["app"]
