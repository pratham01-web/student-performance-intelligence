"""Exploratory Data Analysis and Data Quality Auditing for Student Performance Intelligence System.

Generates descriptive statistics, checks data hygiene, computes feature correlations,
and outputs publication-quality visualization figures to docs/eda_figures/.
"""
import os
from pathlib import Path
import matplotlib
matplotlib.use("Agg")  # Non-interactive backend
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_PATH = BASE_DIR / "ml" / "data" / "student_performance_dataset.csv"
FIGURES_DIR = BASE_DIR / "docs" / "eda_figures"


def run_eda(data_path: Path = DATA_PATH, figures_dir: Path = FIGURES_DIR) -> dict:
    """Run full EDA pipeline and output plots and statistical summary."""
    figures_dir.mkdir(parents=True, exist_ok=True)
    df = pd.read_csv(data_path)
    print(f"Loaded dataset with {df.shape[0]} rows and {df.shape[1]} columns.")

    # 1. Data Quality Checks
    null_counts = df.isnull().sum().to_dict()
    duplicate_count = int(df.duplicated().sum())

    numeric_cols = [
        "age", "study_hours", "sleep_hours", "screen_time",
        "study_days", "attendance", "previous_marks", "exam_score", "passed"
    ]
    summary_stats = df[numeric_cols].describe().round(2).to_dict()

    # 2. Correlation Analysis
    corr_matrix = df[numeric_cols].corr().round(3)
    exam_corr = corr_matrix["exam_score"].sort_values(ascending=False).to_dict()

    # Style configuration
    sns.set_theme(style="whitegrid", palette="deep")
    plt.rcParams["font.sans-serif"] = "DejaVu Sans"
    plt.rcParams["figure.dpi"] = 150

    # Figure 1: Target Variable Distributions
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    sns.histplot(df["exam_score"], kde=True, ax=axes[0], color="#2563eb", bins=25)
    axes[0].axvline(50.0, color="#dc2626", linestyle="--", linewidth=1.5, label="Pass Cutoff (50)")
    axes[0].axvline(df["exam_score"].mean(), color="#059669", linestyle=":", linewidth=1.5, label=f"Mean ({df['exam_score'].mean():.1f})")
    axes[0].set_title("Distribution of Final Exam Scores", fontsize=12, fontweight="bold")
    axes[0].set_xlabel("Exam Score (0-100)")
    axes[0].set_ylabel("Student Count")
    axes[0].legend()

    pass_counts = df["passed"].value_counts().rename({1: "Passed", 0: "Failed"})
    axes[1].pie(
        pass_counts,
        labels=pass_counts.index,
        autopct="%1.1f%%",
        colors=["#10b981", "#ef4444"],
        startangle=140,
        explode=(0.05, 0),
        textprops={"fontsize": 11, "fontweight": "bold"},
    )
    axes[1].set_title("Pass vs. Fail Distribution", fontsize=12, fontweight="bold")
    plt.tight_layout()
    fig1_path = figures_dir / "target_distributions.png"
    plt.savefig(fig1_path, bbox_inches="tight")
    plt.close()

    # Figure 2: Feature Distributions
    features_to_plot = ["study_hours", "sleep_hours", "screen_time", "attendance", "previous_marks"]
    fig, axes = plt.subplots(1, 5, figsize=(20, 4))
    colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b"]
    for i, col in enumerate(features_to_plot):
        sns.histplot(df[col], kde=True, ax=axes[i], color=colors[i], bins=20)
        axes[i].set_title(col.replace("_", " ").title(), fontsize=11, fontweight="bold")
        axes[i].set_xlabel("")
    plt.tight_layout()
    fig2_path = figures_dir / "feature_distributions.png"
    plt.savefig(fig2_path, bbox_inches="tight")
    plt.close()

    # Figure 3: Correlation Heatmap
    plt.figure(figsize=(10, 8))
    mask = np.triu(np.ones_like(corr_matrix, dtype=bool))
    sns.heatmap(
        corr_matrix,
        mask=mask,
        annot=True,
        fmt=".2f",
        cmap="Blues",
        vmin=-1,
        vmax=1,
        linewidths=0.5,
        cbar_kws={"shrink": 0.8},
    )
    plt.title("Correlation Matrix of Numerical Features", fontsize=13, fontweight="bold", pad=12)
    fig3_path = figures_dir / "correlation_heatmap.png"
    plt.savefig(fig3_path, bbox_inches="tight")
    plt.close()

    # Figure 4: Habits vs Performance Scatter
    fig, axes = plt.subplots(1, 3, figsize=(18, 5))
    scatter_features = [("study_hours", "Study Hours / Day"), ("attendance", "Attendance (%)"), ("previous_marks", "Previous Marks (%)")]
    for i, (col, label) in enumerate(scatter_features):
        sns.scatterplot(
            data=df,
            x=col,
            y="exam_score",
            hue="passed",
            palette={1: "#10b981", 0: "#ef4444"},
            alpha=0.6,
            ax=axes[i],
            legend="brief" if i == 2 else False,
        )
        sns.regplot(
            data=df,
            x=col,
            y="exam_score",
            scatter=False,
            ax=axes[i],
            color="#1e293b",
            line_kws={"linewidth": 1.5, "linestyle": "--"},
        )
        axes[i].set_title(f"Exam Score vs. {label}", fontsize=11, fontweight="bold")
        axes[i].set_xlabel(label)
        axes[i].set_ylabel("Final Exam Score" if i == 0 else "")
    if axes[2].legend_:
        axes[2].legend_.set_title("Status")
        for t, l in zip(axes[2].legend_.texts, ["Failed", "Passed"]):
            t.set_text(l)
    plt.tight_layout()
    fig4_path = figures_dir / "habits_vs_performance.png"
    plt.savefig(fig4_path, bbox_inches="tight")
    plt.close()

    # Figure 5: Demographic breakdowns
    fig, axes = plt.subplots(1, 3, figsize=(18, 5))
    sns.boxplot(data=df, x="class_level", y="exam_score", ax=axes[0], palette="Blues")
    axes[0].set_title("Exam Scores by Class Level", fontsize=11, fontweight="bold")
    axes[0].set_xlabel("")
    axes[0].set_ylabel("Final Exam Score")

    sns.boxplot(data=df, x="gender", y="exam_score", ax=axes[1], palette="Purples")
    axes[1].set_title("Exam Scores by Gender", fontsize=11, fontweight="bold")
    axes[1].set_xlabel("")
    axes[1].set_ylabel("")

    sns.boxplot(data=df, x="semester", y="exam_score", ax=axes[2], palette="Greens")
    axes[2].set_title("Exam Scores by Semester", fontsize=11, fontweight="bold")
    axes[2].set_xlabel("")
    axes[2].set_ylabel("")

    plt.tight_layout()
    fig5_path = figures_dir / "demographics_breakdown.png"
    plt.savefig(fig5_path, bbox_inches="tight")
    plt.close()

    print(f"Generated 5 EDA plots in: {figures_dir}")
    return {
        "null_counts": null_counts,
        "duplicate_count": duplicate_count,
        "summary_stats": summary_stats,
        "exam_correlations": exam_corr,
        "plots": [str(fig1_path), str(fig2_path), str(fig3_path), str(fig4_path), str(fig5_path)],
    }


if __name__ == "__main__":
    results = run_eda()
    print("EDA execution completed successfully.")
    print("Top Exam Score Correlations:")
    for feat, corr in list(results["exam_correlations"].items())[:5]:
        print(f"  {feat}: {corr}")
