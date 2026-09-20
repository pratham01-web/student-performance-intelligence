# STUDENT PERFORMANCE INTELLIGENCE SYSTEM

## Exploratory Data Analysis & Data Quality Audit

**Document:** 04_EDA.md  
**Project:** Student Performance Intelligence System  
**Dataset Version:** v1.0.0 (Synthetic cohort of 2,000 students)  
**Status:** Complete  

---

# 1. EXECUTIVE SUMMARY

An exhaustive Exploratory Data Analysis (EDA) and data hygiene audit was performed on the primary student dataset (`student_performance_dataset.csv`, 2,000 samples, 14 features). The dataset provides realistic variance and relationships between academic history, study routines, digital distractions, and final examination outcomes.

Key Findings:
1. **Target Distribution:** Final exam scores follow a near-normal distribution centered around **58.27 ± 15.63**, with scores ranging between 17.5 and 100.0. The overall pass rate is **73.85%** (1,477 passed, 523 failed) under the institutional passing cutoff of 50.0.
2. **Primary Predictors:** Continuous marks and pass/fail outcomes exhibit strong positive correlation with **Previous Marks (r = 0.823)**, **Daily Study Hours (r = 0.660)**, and **Weekly Study Days (r = 0.552)**.
3. **Negative Impact Factors:** Screen time beyond 4.0 hours per day manifests an inverse correlation with academic performance (r = -0.32), reflecting digital distraction overhead.
4. **Data Hygiene:** The dataset has zero missing values (`null = 0`), zero duplicate records, and conforms to all domain boundary constraints established in the database schema.

---

# 2. DATA QUALITY & INTEGRITY AUDIT

| Feature | Data Type | Null Count | Unique Values | Valid Range / Categories | Integrity Status |
|---|---|---|---|---|---|
| `student_code` | Object | 0 | 2,000 | `STU-00001` to `STU-02000` | 100% Unique |
| `name` | Object | 0 | 1,124 | Diverse first & last names | Valid |
| `age` | Integer | 0 | 9 | [14, 22] | Within [5, 100] check constraint |
| `gender` | Object | 0 | 3 | Male (49.8%), Female (48.3%), Other (1.9%) | Valid distribution |
| `class_level` | Object | 0 | 5 | 9th, 10th, 11th, 12th, Undergraduate | Balanced across tiers |
| `semester` | Object | 0 | 4 | Semester 1, 2, 3, 4 | Uniform across terms |
| `study_hours` | Float | 0 | 115 | [0.5, 12.0] | Mean: 3.58 hrs |
| `sleep_hours` | Float | 0 | 59 | [4.0, 10.0] | Mean: 6.99 hrs (Optimal: ~7.5 hrs) |
| `screen_time` | Float | 0 | 102 | [0.5, 11.0] | Mean: 3.48 hrs |
| `study_days` | Integer | 0 | 7 | [1, 7] | Mean: 5.31 days/week |
| `attendance` | Float | 0 | 387 | [40.0, 100.0] | Mean: 77.85% |
| `previous_marks` | Float | 0 | 632 | [30.0, 99.0] | Mean: 58.07% |
| `exam_score` | Float | 0 | 674 | [17.5, 100.0] | Target: Regression |
| `passed` | Integer | 0 | 2 | 0 (Failed: 26.15%), 1 (Passed: 73.85%) | Target: Classification |

---

# 3. STATISTICAL SUMMARY OF NUMERICAL FEATURES

| Metric | Study Hours | Sleep Hours | Screen Time | Attendance (%) | Previous Marks (%) | Exam Score (%) |
|---|---|---|---|---|---|---|
| **Mean** | 3.58 | 6.99 | 3.48 | 77.85 | 58.07 | 58.27 |
| **Std Dev** | 1.88 | 1.09 | 2.18 | 13.06 | 14.28 | 15.63 |
| **Min** | 0.50 | 4.00 | 0.50 | 40.00 | 30.00 | 17.50 |
| **25% (Q1)** | 2.20 | 6.30 | 1.80 | 70.40 | 47.90 | 46.80 |
| **Median (Q2)** | 3.20 | 7.00 | 3.00 | 80.20 | 57.50 | 57.80 |
| **75% (Q3)** | 4.60 | 7.70 | 4.80 | 87.70 | 67.80 | 69.12 |
| **Max** | 12.00 | 10.00 | 11.00 | 100.00 | 99.00 | 100.00 |
| **IQR** | 2.40 | 1.40 | 3.00 | 17.30 | 19.90 | 22.32 |

---

# 4. CORRELATION ANALYSIS WITH TARGET VARIABLES

Pearson correlation coefficients computed across the full cohort:

| Rank | Feature | Correlation with Exam Score (`exam_score`) | Correlation with Pass/Fail (`passed`) | Direction / Interpretation |
|---|---|---|---|---|
| 1 | `previous_marks` | **+0.823** | **+0.669** | Strongest linear driver of academic performance. |
| 2 | `study_hours` | **+0.660** | **+0.528** | Significant positive impact of daily study dedication. |
| 3 | `study_days` | **+0.552** | **+0.443** | Consistency across the week correlates with retention. |
| 4 | `attendance` | **+0.491** | **+0.398** | Regular classroom presence protects against failure. |
| 5 | `sleep_hours` | **+0.124** | **+0.106** | Moderate positive effect peaking at 7.0–8.0 hours. |
| 6 | `age` | **+0.015** | **+0.018** | Negligible correlation (cohort invariant). |
| 7 | `screen_time` | **-0.318** | **-0.257** | Moderate inverse correlation with academic focus. |

---

# 5. VISUALIZATION ARTIFACTS

The following generated visualization figures are available in `docs/eda_figures/`:
1. **Target Distributions (`docs/eda_figures/target_distributions.png`):**
   Displays the continuous exam score histogram with Gaussian kernel density overlay alongside the pass/fail class pie chart.
2. **Feature Distributions (`docs/eda_figures/feature_distributions.png`):**
   Illustrates individual distributions for study hours, sleep duration, recreational screen time, attendance percentage, and prior semester marks.
3. **Correlation Heatmap (`docs/eda_figures/correlation_heatmap.png`):**
   Full triangular lower-matrix heatmap highlighting feature interrelationships and target sensitivities.
4. **Habits vs. Performance (`docs/eda_figures/habits_vs_performance.png`):**
   Bivariate scatter plots with linear regression trends showcasing the threshold transitions for passing vs failing students across study hours, attendance, and prior marks.
5. **Demographic Breakdown (`docs/eda_figures/demographics_breakdown.png`):**
   Comparative box plots evaluating exam score equity across class tiers, genders, and terms.
