"""Student domain service implementing business logic and persistence."""
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, joinedload

from app.models import AcademicRecord, Student, StudyHabit
from app.schemas.academic_record import AcademicRecordCreate
from app.schemas.student import StudentCreate, StudentUpdate
from app.schemas.study_habit import StudyHabitCreate


def create_student(db: Session, student_in: StudentCreate) -> Student:
    """Create a new student record."""
    student = Student(
        student_code=student_in.student_code,
        name=student_in.name,
        age=student_in.age,
        gender=student_in.gender,
        class_level=student_in.class_level,
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


def get_student(db: Session, student_id: int) -> Student | None:
    """Fetch single student with relationships eagerly loaded."""
    stmt = (
        select(Student)
        .options(
            joinedload(Student.academic_records),
            joinedload(Student.study_habits),
        )
        .where(Student.id == student_id)
    )
    return db.scalars(stmt).unique().first()


def get_student_by_code(db: Session, student_code: str) -> Student | None:
    """Fetch student by institutional code."""
    return db.scalars(select(Student).where(Student.student_code == student_code)).first()


def list_students(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    search: str | None = None,
    class_level: str | None = None,
) -> tuple[list[Student], int]:
    """List students with optional search filtering and pagination."""
    query = select(Student)

    if search:
        search_filter = or_(
            Student.name.ilike(f"%{search}%"),
            Student.student_code.ilike(f"%{search}%"),
        )
        query = query.where(search_filter)

    if class_level:
        query = query.where(Student.class_level == class_level)

    # Count query
    count_stmt = select(func.count()).select_from(query.subquery())
    total = db.scalar(count_stmt) or 0

    # Paginated results ordered by creation
    items_stmt = query.order_by(Student.id.desc()).offset(skip).limit(limit)
    items = list(db.scalars(items_stmt).all())

    return items, total


def update_student(db: Session, student_id: int, student_in: StudentUpdate) -> Student | None:
    """Update student attributes."""
    student = db.get(Student, student_id)
    if not student:
        return None

    update_data = student_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(student, field, value)

    db.commit()
    db.refresh(student)
    return student


def delete_student(db: Session, student_id: int) -> bool:
    """Delete a student and cascade to academic records and habits."""
    student = db.get(Student, student_id)
    if not student:
        return False
    db.delete(student)
    db.commit()
    return True


def add_academic_record(db: Session, student_id: int, record_in: AcademicRecordCreate) -> AcademicRecord:
    """Append a semester academic record for a student."""
    record = AcademicRecord(
        student_id=student_id,
        semester=record_in.semester,
        previous_marks=record_in.previous_marks,
        attendance=record_in.attendance,
        exam_score=record_in.exam_score,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def add_study_habit(db: Session, student_id: int, habit_in: StudyHabitCreate) -> StudyHabit:
    """Append a study habit log for a student."""
    habit = StudyHabit(
        student_id=student_id,
        study_hours=habit_in.study_hours,
        sleep_hours=habit_in.sleep_hours,
        screen_time=habit_in.screen_time,
        study_days=habit_in.study_days,
    )
    db.add(habit)
    db.commit()
    db.refresh(habit)
    return habit
