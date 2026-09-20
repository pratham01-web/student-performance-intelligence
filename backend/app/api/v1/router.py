"""API v1 master router aggregating domain routers."""
from fastapi import APIRouter

from app.api.v1.analytics import router as analytics_router
from app.api.v1.models import router as models_router
from app.api.v1.predictions import router as predictions_router
from app.api.v1.students import router as students_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(students_router)
api_router.include_router(predictions_router)
api_router.include_router(analytics_router)
api_router.include_router(models_router)
