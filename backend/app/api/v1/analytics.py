"""Analytics and Cohort Reporting API endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.analytics import AnalyticsOverviewResponse, AnalyticsTrendsResponse
from app.services import analytics_service

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/overview", response_model=AnalyticsOverviewResponse)
def get_analytics_overview(db: Session = Depends(get_db)) -> AnalyticsOverviewResponse:
    """Retrieve top-level KPI metrics across students, performance, and predictions."""
    return analytics_service.get_overview_analytics(db)


@router.get("/trends", response_model=AnalyticsTrendsResponse)
def get_analytics_trends(db: Session = Depends(get_db)) -> AnalyticsTrendsResponse:
    """Retrieve semester-level academic trends and attendance/habit performance distributions."""
    return analytics_service.get_trends_analytics(db)
