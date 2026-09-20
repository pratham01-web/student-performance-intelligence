"""Synthetic dataset generator for the Student Performance Intelligence System.

Generates realistic student demographics, longitudinal academic history,
study habits, and deterministic yet noisy performance outcomes.
Adheres strictly to AGENTS.md Section 6 (Data Policy).
"""
import json
import os
from pathlib import Path
import numpy as np
import pandas as pd

RANDOM_SEED = 42
NUM_SAMPLES = 2000

FIRST_NAMES_MALE = [
    "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Reyansh", "Muhammad", "Sai",
    "Arnav", "Ayaan", "Krishna", "Ishaan", "Shaurya", "Atharv", "Advik", "Pranav",
    "Advaith", "Aaryan", "Dhruv", "Kabir", "Rohan", "Siddharth", "Dev", "Anand"
]
FIRST_NAMES_FEMALE = [
    "Saanvi", "Aanya", "Aadhya", "Aaradhya", "Ananya", "Pari", "Anika", "Navya",
    "Angel", "Diya", "Myra", "Sara", "Isha", "Riya", "Avani", "Kavya", "Pooja",
    "Meera", "Tanvi", "Tara", "Khushi", "Sneha", "Anushka", "Priyanka"
]
LAST_NAMES = [
    "Sharma", "Verma", "Patel", "Singh", "Kumar", "Gupta", "Reddy", "Mehta",
    "Joshi", "Bhat", "Rao", "Nair", "Deshmukh", "Chouhan", "Iyer", "Kulkarni",
    "Malhotra", "Kapoor", "Mishra", "Das", "Choudhury", "Bose", "Banerjee"
]
CLASS_LEVELS = ["9th", "10th", "11th", "12th", "Undergraduate"]
SEMESTERS = ["Semester 1", "Semester 2", "Semester 3", "Semester 4"]


def generate_synthetic_data(num_samples: int = NUM_SAMPLES, seed: int = RANDOM_SEED) -> pd.DataFrame:
    """Generate reproducible student dataset with realistic relationships."""
    rng = np.random.default_rng(seed)

    records = []
    for i in range(1, num_samples + 1):
        student_code = f"STU-{i:05d}"
        gender_choice = rng.choice(["Male", "Female", "Other"], p=[0.49, 0.49, 0.02])
        if gender_choice == "Male":
            first_name = rng.choice(FIRST_NAMES_MALE)
        elif gender_choice == "Female":
            first_name = rng.choice(FIRST_NAMES_FEMALE)
        else:
            first_name = rng.choice(FIRST_NAMES_MALE + FIRST_NAMES_FEMALE)
        last_name = rng.choice(LAST_NAMES)
        name = f"{first_name} {last_name}"

        class_level = rng.choice(CLASS_LEVELS, p=[0.18, 0.22, 0.22, 0.20, 0.18])
        if class_level in ["9th", "10th"]:
            age = int(rng.integers(14, 17))
        elif class_level in ["11th", "12th"]:
            age = int(rng.integers(16, 19))
        else:
            age = int(rng.integers(18, 23))

        semester = rng.choice(SEMESTERS)

        # Behavioral & habit features
        study_hours = float(np.round(rng.gamma(shape=3.0, scale=1.2), 1))  # Mean ~3.6 hrs
        study_hours = float(np.clip(study_hours, 0.5, 12.0))

        sleep_hours = float(np.round(rng.normal(loc=7.0, scale=1.1), 1))
        sleep_hours = float(np.clip(sleep_hours, 4.0, 10.0))

        screen_time = float(np.round(rng.gamma(shape=2.5, scale=1.4), 1))  # Mean ~3.5 hrs
        screen_time = float(np.clip(screen_time, 0.5, 11.0))

        study_days = int(np.clip(round(study_hours * 1.2 + rng.integers(1, 3)), 1, 7))

        # Academic features
        # Attendance: beta distribution skewed towards 75-95%
        attendance = float(np.round(rng.beta(a=7, b=2) * 100, 1))
        attendance = float(np.clip(attendance, 40.0, 100.0))

        # Previous marks: influenced by study habits & attendance with noise
        base_ability = (study_hours * 3.5) + (attendance * 0.4) - (screen_time * 1.5)
        prev_noise = rng.normal(0, 7.0)
        previous_marks = float(np.round(25.0 + base_ability + prev_noise, 1))
        previous_marks = float(np.clip(previous_marks, 30.0, 99.0))

        # Final Exam Score (continuous target):
        # High correlation with previous marks (weight 0.45), attendance (0.25), study hours (2.8)
        # Positive effect of healthy sleep (peak at 7.5 hrs), negative effect of high screen time (>5 hrs)
        sleep_bonus = 3.0 - (abs(sleep_hours - 7.5) * 1.8)
        screen_penalty = max(0.0, screen_time - 4.0) * 1.8

        exam_score_raw = (
            (0.42 * previous_marks)
            + (0.28 * attendance)
            + (2.6 * study_hours)
            + sleep_bonus
            - screen_penalty
            + rng.normal(0, 5.5)  # Realistic variance
        )
        exam_score = float(np.round(np.clip(exam_score_raw, 15.0, 100.0), 1))

        # Binary Pass/Fail Target (cutoff >= 50.0)
        passed = 1 if exam_score >= 50.0 else 0

        records.append({
            "student_code": student_code,
            "name": name,
            "age": age,
            "gender": gender_choice,
            "class_level": class_level,
            "semester": semester,
            "study_hours": study_hours,
            "sleep_hours": sleep_hours,
            "screen_time": screen_time,
            "study_days": study_days,
            "attendance": attendance,
            "previous_marks": previous_marks,
            "exam_score": exam_score,
            "passed": passed,
        })

    df = pd.DataFrame(records)
    return df


def save_dataset_and_metadata(df: pd.DataFrame, output_dir: Path) -> tuple[Path, Path]:
    """Save dataset CSV and metadata JSON in target output directory."""
    output_dir.mkdir(parents=True, exist_ok=True)
    csv_path = output_dir / "student_performance_dataset.csv"
    df.to_csv(csv_path, index=False)

    metadata = {
        "dataset_name": "Student Performance Intelligence Synthetic Dataset",
        "version": "1.0.0",
        "is_synthetic": True,
        "sample_count": len(df),
        "random_seed": RANDOM_SEED,
        "generator_script": "ml/data/generate_dataset.py",
        "generation_methodology": (
            "Statistically grounded multivariate generative simulation incorporating "
            "Gamma, Beta, and Gaussian distributions with empirical academic performance correlations."
        ),
        "features": {
            "student_code": {"type": "string", "description": "Unique student identifier"},
            "name": {"type": "string", "description": "Full student name"},
            "age": {"type": "integer", "range": [int(df['age'].min()), int(df['age'].max())]},
            "gender": {"type": "string", "categories": ["Male", "Female", "Other"]},
            "class_level": {"type": "string", "categories": CLASS_LEVELS},
            "semester": {"type": "string", "categories": SEMESTERS},
            "study_hours": {"type": "float", "description": "Daily study hours", "mean": round(float(df['study_hours'].mean()), 2)},
            "sleep_hours": {"type": "float", "description": "Daily sleep hours", "mean": round(float(df['sleep_hours'].mean()), 2)},
            "screen_time": {"type": "float", "description": "Daily screen time", "mean": round(float(df['screen_time'].mean()), 2)},
            "study_days": {"type": "integer", "range": [1, 7]},
            "attendance": {"type": "float", "description": "Attendance percentage", "mean": round(float(df['attendance'].mean()), 2)},
            "previous_marks": {"type": "float", "description": "Prior semester marks percentage", "mean": round(float(df['previous_marks'].mean()), 2)},
        },
        "targets": {
            "exam_score": {
                "type": "float",
                "task": "regression",
                "description": "Final realized exam score (0.0 - 100.0)",
                "mean": round(float(df['exam_score'].mean()), 2),
                "std": round(float(df['exam_score'].std()), 2),
            },
            "passed": {
                "type": "integer",
                "task": "classification",
                "description": "Binary pass/fail outcome (1 if exam_score >= 50.0 else 0)",
                "pass_rate": round(float(df['passed'].mean()), 4),
            },
        },
    }

    meta_path = output_dir / "dataset_metadata.json"
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    return csv_path, meta_path


if __name__ == "__main__":
    current_dir = Path(__file__).resolve().parent
    df_data = generate_synthetic_data()
    csv_file, meta_file = save_dataset_and_metadata(df_data, current_dir)
    print(f"Generated {len(df_data)} records successfully.")
    print(f"Saved dataset: {csv_file}")
    print(f"Saved metadata: {meta_file}")
    print(f"Pass rate: {df_data['passed'].mean() * 100:.2f}% | Mean Exam Score: {df_data['exam_score'].mean():.2f}")
