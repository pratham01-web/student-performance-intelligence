"""Database engine and session management."""
from collections.abc import Generator
from typing import Any
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

db_uri = settings.sqlalchemy_database_uri

# Configure engine arguments based on dialect
engine_kwargs: dict[str, Any] = {
    "pool_pre_ping": True,
}

if db_uri.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    engine_kwargs["pool_size"] = settings.DB_POOL_SIZE
    engine_kwargs["max_overflow"] = settings.DB_MAX_OVERFLOW
    engine_kwargs["pool_timeout"] = settings.DB_POOL_TIMEOUT

engine = create_engine(db_uri, **engine_kwargs)

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
