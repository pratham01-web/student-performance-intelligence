import os
from collections.abc import Generator
from typing import Any
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import NullPool, StaticPool

from app.core.config import settings

db_uri = settings.sqlalchemy_database_uri

# Configure engine arguments based on environment and dialect
engine_kwargs: dict[str, Any] = {}

if db_uri.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}
    if ":memory:" in db_uri:
        engine_kwargs["poolclass"] = StaticPool
elif os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
    engine_kwargs["poolclass"] = NullPool
    engine_kwargs["connect_args"] = {"connect_timeout": 5}
else:
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_size"] = settings.DB_POOL_SIZE
    engine_kwargs["max_overflow"] = settings.DB_MAX_OVERFLOW
    engine_kwargs["pool_timeout"] = settings.DB_POOL_TIMEOUT

engine = create_engine(db_uri, **engine_kwargs)

# Automatically create schema when running on SQLite fallback
if db_uri.startswith("sqlite") and not ":memory:" in db_uri:
    try:
        from app.database.base import Base
        import app.models  # noqa: F401
        Base.metadata.create_all(bind=engine)
    except Exception:
        pass

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency yielding database session per request.

    Guarantees clean session teardown upon request completion or error.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
