"""Initial schema creation for Student Performance Intelligence System.

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-09-20 16:20:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "001_initial_schema"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create 'students' table
    op.create_table(
        "students",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("student_code", sa.String(length=32), nullable=False),
        sa.Column("name", sa.String(length=128), nullable=False),
        sa.Column("age", sa.Integer(), nullable=False),
        sa.Column("gender", sa.String(length=16), nullable=False),
        sa.Column("class_level", sa.String(length=32), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint("age >= 5 AND age <= 100", name="ck_students_age_range"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("student_code", name="uq_students_student_code"),
    )
    op.create_index(op.f("ix_students_student_code"), "students", ["student_code"], unique=True)

    # 2. Create 'academic_records' table
    op.create_table(
        "academic_records",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("student_id", sa.Integer(), nullable=False),
        sa.Column("semester", sa.String(length=32), nullable=False),
        sa.Column("previous_marks", sa.Float(), nullable=False),
        sa.Column("attendance", sa.Float(), nullable=False),
        sa.Column("exam_score", sa.Float(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint("previous_marks >= 0.0 AND previous_marks <= 100.0", name="ck_academic_records_previous_marks"),
        sa.CheckConstraint("attendance >= 0.0 AND attendance <= 100.0", name="ck_academic_records_attendance"),
        sa.CheckConstraint("exam_score IS NULL OR (exam_score >= 0.0 AND exam_score <= 100.0)", name="ck_academic_records_exam_score"),
        sa.ForeignKeyConstraint(["student_id"], ["students.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_academic_records_student_id"), "academic_records", ["student_id"], unique=False)

    # 3. Create 'study_habits' table
    op.create_table(
        "study_habits",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("student_id", sa.Integer(), nullable=False),
        sa.Column("study_hours", sa.Float(), nullable=False),
        sa.Column("sleep_hours", sa.Float(), nullable=False),
        sa.Column("screen_time", sa.Float(), nullable=True),
        sa.Column("study_days", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint("study_hours >= 0.0 AND study_hours <= 24.0", name="ck_study_habits_study_hours"),
        sa.CheckConstraint("sleep_hours >= 0.0 AND sleep_hours <= 24.0", name="ck_study_habits_sleep_hours"),
        sa.CheckConstraint("screen_time IS NULL OR (screen_time >= 0.0 AND screen_time <= 24.0)", name="ck_study_habits_screen_time"),
        sa.CheckConstraint("study_days IS NULL OR (study_days >= 0 AND study_days <= 7)", name="ck_study_habits_study_days"),
        sa.ForeignKeyConstraint(["student_id"], ["students.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_study_habits_student_id"), "study_habits", ["student_id"], unique=False)

    # 4. Create 'model_versions' table
    op.create_table(
        "model_versions",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("model_name", sa.String(length=100), nullable=False),
        sa.Column("algorithm", sa.String(length=100), nullable=False),
        sa.Column("version", sa.String(length=50), nullable=False),
        sa.Column("dataset_version", sa.String(length=50), nullable=False),
        sa.Column("metrics", sa.JSON(), nullable=False),
        sa.Column("parameters", sa.JSON(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("artifact_path", sa.String(length=255), nullable=True),
        sa.Column("trained_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("model_name", "version", name="uq_model_versions_name_version"),
    )
    op.create_index(op.f("ix_model_versions_model_name"), "model_versions", ["model_name"], unique=False)
    op.create_index(op.f("ix_model_versions_is_active"), "model_versions", ["is_active"], unique=False)

    # 5. Create 'predictions' table
    op.create_table(
        "predictions",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("student_id", sa.Integer(), nullable=True),
        sa.Column("model_version_id", sa.Integer(), nullable=True),
        sa.Column("model_version", sa.String(length=50), nullable=False),
        sa.Column("prediction_type", sa.String(length=32), nullable=False),
        sa.Column("predicted_marks", sa.Float(), nullable=True),
        sa.Column("pass_probability", sa.Float(), nullable=True),
        sa.Column("input_features", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint("predicted_marks IS NULL OR (predicted_marks >= 0.0 AND predicted_marks <= 100.0)", name="ck_predictions_predicted_marks"),
        sa.CheckConstraint("pass_probability IS NULL OR (pass_probability >= 0.0 AND pass_probability <= 1.0)", name="ck_predictions_pass_probability"),
        sa.ForeignKeyConstraint(["student_id"], ["students.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["model_version_id"], ["model_versions.id"], ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_predictions_student_id"), "predictions", ["student_id"], unique=False)
    op.create_index(op.f("ix_predictions_model_version_id"), "predictions", ["model_version_id"], unique=False)
    op.create_index(op.f("ix_predictions_created_at"), "predictions", ["created_at"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_predictions_created_at"), table_name="predictions")
    op.drop_index(op.f("ix_predictions_model_version_id"), table_name="predictions")
    op.drop_index(op.f("ix_predictions_student_id"), table_name="predictions")
    op.drop_table("predictions")

    op.drop_index(op.f("ix_model_versions_is_active"), table_name="model_versions")
    op.drop_index(op.f("ix_model_versions_model_name"), table_name="model_versions")
    op.drop_table("model_versions")

    op.drop_index(op.f("ix_study_habits_student_id"), table_name="study_habits")
    op.drop_table("study_habits")

    op.drop_index(op.f("ix_academic_records_student_id"), table_name="academic_records")
    op.drop_table("academic_records")

    op.drop_index(op.f("ix_students_student_code"), table_name="students")
    op.drop_table("students")
