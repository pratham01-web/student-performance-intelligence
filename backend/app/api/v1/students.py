"""Students API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.academic_record import AcademicRecordCreate, AcademicRecordResponse
from app.schemas.student import (
    StudentCreate,
    StudentDetailResponse,
    StudentListResponse,
    StudentResponse,
    StudentUpdate,
)
from app.schemas.study_habit import StudyHabitCreate, StudyHabitResponse
from app.services import student_service

router = APIRouter(prefix="/students", tags=["Students"])


@router.post("", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
def create_student(
    student_in: StudentCreate,
    db: Session = Depends(get_db),
) -> StudentResponse:
    """Register a new student."""
    existing = student_service.get_student_by_code(db, student_in.student_code)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Student with code '{student_in.student_code}' already exists.",
        )
    return student_service.create_student(db, student_in)


@router.get("", response_model=StudentListResponse)
def list_students(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str | None = Query(None, description="Search by name or code"),
    class_level: str | None = Query(None, description="Filter by class level"),
    db: Session = Depends(get_db),
) -> StudentListResponse:
    """List students with pagination and search filtering."""
    skip = (page - 1) * page_size
    try:
        items, total = student_service.list_students(
            db=db,
            skip=skip,
            limit=page_size,
            search=search,
            class_level=class_level,
        )
    except Exception:
        items, total = [], 0

    return StudentListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{student_id}", response_model=StudentDetailResponse)
def get_student(
    student_id: int,
    db: Session = Depends(get_db),
) -> StudentDetailResponse:
    """Retrieve full student profile with academic history and habits."""
    student = student_service.get_student(db, student_id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with id {student_id} not found.",
        )
    return student


@router.put("/{student_id}", response_model=StudentResponse)
def update_student(
    student_id: int,
    student_in: StudentUpdate,
    db: Session = Depends(get_db),
) -> StudentResponse:
    """Update student profile details."""
    updated = student_service.update_student(db, student_id, student_in)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with id {student_id} not found.",
        )
    return updated


@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(
    student_id: int,
    db: Session = Depends(get_db),
) -> None:
    """Delete a student and cascade to all child records."""
    success = student_service.delete_student(db, student_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with id {student_id} not found.",
        )


@router.post("/{student_id}/academic-records", response_model=AcademicRecordResponse, status_code=status.HTTP_201_CREATED)
def add_academic_record(
    student_id: int,
    record_in: AcademicRecordCreate,
    db: Session = Depends(get_db),
) -> AcademicRecordResponse:
    """Append a semester academic record for a student."""
    student = student_service.get_student(db, student_id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with id {student_id} not found.",
        )
    return student_service.add_academic_record(db, student_id, record_in)


@router.post("/{student_id}/study-habits", response_model=StudyHabitResponse, status_code=status.HTTP_201_CREATED)
def add_study_habit(
    student_id: int,
    habit_in: StudyHabitCreate,
    db: Session = Depends(get_db),
) -> StudyHabitResponse:
    """Append a study habit record for a student."""
    student = student_service.get_student(db, student_id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with id {student_id} not found.",
        )
    return student_service.add_study_habit(db, student_id, habit_in)
