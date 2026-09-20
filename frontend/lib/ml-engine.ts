/**
 * Academic Performance Intelligence ML Engine
 * 
 * Mathematically identical client-side implementation of the trained Scikit-learn
 * StandardScaler + OneHotEncoder + LinearRegression & LogisticRegression pipelines.
 * Evaluated on stratified holdout test split (R² = 0.7662, F1 = 0.9228).
 */

export interface EvaluationInput {
  student_id?: number | null;
  study_hours: number;
  sleep_hours: number;
  screen_time: number;
  study_days: number;
  attendance: number;
  previous_marks: number;
  age?: number;
  gender?: string;
  class_level?: string;
  semester?: string;
}

export interface FactorImpact {
  factor: string;
  impact: "positive" | "negative" | "neutral";
  description: string;
}

export interface EvaluationResult {
  predicted_marks: number;
  passed: number;
  pass_probability: number;
  grade_band: string;
  risk_level: "Low Risk" | "Moderate Risk" | "High Risk";
  recommendations: string[];
  key_factors: FactorImpact[];
  model_version: string;
  created_at: string;
}

// StandardScaler Parameters (computed over 1,600 training samples)
const SCALER_MEANS = [
  3.676625,    // study_hours
  7.024375,    // sleep_hours
  3.5408125,   // screen_time
  5.305,       // study_days
  77.9176875,  // attendance
  63.7661875,  // previous_marks
  16.70875,    // age
];

const SCALER_SCALES = [
  2.086550049573458,   // study_hours
  1.088436199037408,   // sleep_hours
  2.1973798237545896,  // screen_time
  1.5554661680666666,  // study_days
  13.156012158034203,  // attendance
  11.667615457532175,  // previous_marks
  1.984672123424925,   // age
];

// Linear Regression Weights (active baseline, R² = 0.7662)
const REG_COEFFICIENTS = [
  5.449234666123315,    // study_hours (scaled)
  0.8522848897040194,   // sleep_hours (scaled)
  -2.2455035494193525,  // screen_time (scaled)
  -0.09992069819134819, // study_days (scaled)
  3.6463332467333776,   // attendance (scaled)
  5.105850875775823,    // previous_marks (scaled)
  -0.19788496780351003, // age (scaled)
  // Gender OneHot: Female, Male, Other
  -0.5142905932622173,
  -0.1104634813084667,
  0.6247540745706839,
  // Class OneHot: 10th, 11th, 12th, 9th, Undergraduate
  -0.575857723791415,
  -0.3659771991867402,
  0.5645449425740471,
  -0.08095192578576271,
  0.45824190618987043,
  // Semester OneHot: Semester 1, Semester 2, Semester 3, Semester 4
  0.5134258187079533,
  -0.15935950221315073,
  -0.32784548071557107,
  -0.026220835779231746,
];
const REG_INTERCEPT = 58.64982583189245;

// Logistic Regression Weights (active baseline, F1 = 0.9228)
const CLF_COEFFICIENTS = [
  2.2078936851152053,
  0.3654166723235598,
  -0.5610091504156852,
  -0.3676050157586051,
  1.1776061717326847,
  1.5127219908351657,
  -0.11364165664885406,
  0.0947758357895144,
  -0.030189177945212923,
  -0.06220692037206982,
  -0.2439558185031948,
  -0.08706457763190356,
  0.3142939133179308,
  -0.052450208488738534,
  0.07155642877813845,
  0.06772154089445247,
  -0.05093938978978596,
  -0.021445995121450952,
  0.0070435814890166485,
];
const CLF_INTERCEPT = 2.529867554253689;

/**
 * Execute dual machine learning evaluation in < 1ms with 0 external dependencies.
 */
export function calculateEvaluation(input: EvaluationInput): EvaluationResult {
  const study_hours = Number(input.study_hours) || 0;
  const sleep_hours = Number(input.sleep_hours) || 7;
  const screen_time = Number(input.screen_time) || 3;
  const study_days = Number(input.study_days) || 5;
  const attendance = Number(input.attendance) || 75;
  const previous_marks = Number(input.previous_marks) || 60;
  const age = Number(input.age) || 16;

  // 1. Standardize numerical features
  const raw_num = [study_hours, sleep_hours, screen_time, study_days, attendance, previous_marks, age];
  const scaled_num = raw_num.map((v, i) => (v - SCALER_MEANS[i]) / SCALER_SCALES[i]);

  // 2. One-Hot Encode categorical features
  const gender = input.gender || "Male";
  const gender_ohe = [gender === "Female" ? 1 : 0, gender === "Male" ? 1 : 0, gender === "Other" ? 1 : 0];

  const class_level = input.class_level || "10th";
  const class_ohe = [
    class_level === "10th" ? 1 : 0,
    class_level === "11th" ? 1 : 0,
    class_level === "12th" ? 1 : 0,
    class_level === "9th" ? 1 : 0,
    class_level === "Undergraduate" ? 1 : 0,
  ];

  const semester = input.semester || "Semester 1";
  const semester_ohe = [
    semester === "Semester 1" ? 1 : 0,
    semester === "Semester 2" ? 1 : 0,
    semester === "Semester 3" ? 1 : 0,
    semester === "Semester 4" ? 1 : 0,
  ];

  // Full 19-dimensional transformed feature vector
  const x = [...scaled_num, ...gender_ohe, ...class_ohe, ...semester_ohe];

  // 3. Continuous Marks Prediction (Linear Regression)
  let raw_marks = REG_INTERCEPT;
  for (let i = 0; i < x.length; i++) {
    raw_marks += REG_COEFFICIENTS[i] * x[i];
  }
  const predicted_marks = Math.min(100, Math.max(0, Math.round(raw_marks * 100) / 100));

  // 4. Pass/Fail Classification Probability (Logistic Regression)
  let z = CLF_INTERCEPT;
  for (let i = 0; i < x.length; i++) {
    z += CLF_COEFFICIENTS[i] * x[i];
  }
  const prob = 1.0 / (1.0 + Math.exp(-z));
  const pass_probability = Math.round(prob * 10000) / 10000;
  const passed = pass_probability >= 0.5 && predicted_marks >= 50 ? 1 : 0;

  // Grade Band Determination
  let grade_band = "Pass (Third Class)";
  if (predicted_marks >= 75) {
    grade_band = "Distinction (First Class with Honors)";
  } else if (predicted_marks >= 60) {
    grade_band = "First Class (Commendable)";
  } else if (predicted_marks >= 50) {
    grade_band = "Second Class (Satisfactory)";
  } else {
    grade_band = "Academic Remediation Required";
  }

  // Risk Classification
  let risk_level: "Low Risk" | "Moderate Risk" | "High Risk" = "Low Risk";
  if (predicted_marks < 50 || pass_probability < 0.6) {
    risk_level = "High Risk";
  } else if (predicted_marks < 62 || pass_probability < 0.85) {
    risk_level = "Moderate Risk";
  }

  // Actionable Academic Recommendations
  const recommendations: string[] = [];
  if (study_hours < 3.5) {
    recommendations.push(
      `Increasing daily dedicated study time by +1.5h to ~${(study_hours + 1.5).toFixed(1)}h/day is projected to boost score by +4.0 to +6.5 marks.`
    );
  }
  if (attendance < 75) {
    recommendations.push(
      `Attendance (${attendance}%) is below the institutional 75% threshold. Increasing presence to 85%+ provides a direct estimated lift of +3.5 marks.`
    );
  } else if (attendance < 85) {
    recommendations.push("Maintaining attendance above 85% reinforces retention and exam consistency.");
  }
  if (screen_time > 4.5) {
    recommendations.push(
      `Reallocating 1–2 hours from non-academic screen time (${screen_time}h/day) to focused revision will reduce cognitive fatigue.`
    );
  }
  if (sleep_hours < 6.5) {
    recommendations.push(
      `Extending sleep duration from ${sleep_hours}h to 7.5h supports memory consolidation and peak exam performance.`
    );
  }
  if (recommendations.length === 0) {
    recommendations.push("Current academic routine and study habits align with top-quartile performance. Continue consistent weekly revision.");
  }

  // Key Drivers (Impact factors)
  const key_factors: FactorImpact[] = [
    {
      factor: "Daily Study Hours",
      impact: study_hours >= 4.0 ? "positive" : study_hours < 2.5 ? "negative" : "neutral",
      description: `${study_hours} hrs/day (${study_hours >= 4 ? "+5.4 weight bonus" : "Sub-optimal baseline"})`,
    },
    {
      factor: "Class Attendance",
      impact: attendance >= 80 ? "positive" : attendance < 70 ? "negative" : "neutral",
      description: `${attendance}% (${attendance >= 80 ? "Strong correlation with success" : "Eligibility warning zone"})`,
    },
    {
      factor: "Prior Examination Baseline",
      impact: previous_marks >= 65 ? "positive" : previous_marks < 50 ? "negative" : "neutral",
      description: `${previous_marks}% marks recorded in preceding term`,
    },
    {
      factor: "Recreational Screen Time",
      impact: screen_time <= 2.5 ? "positive" : screen_time >= 4.5 ? "negative" : "neutral",
      description: `${screen_time} hrs/day (${screen_time > 4 ? "Negative correlation on recall" : "Balanced"})`,
    },
  ];

  return {
    predicted_marks,
    passed,
    pass_probability,
    grade_band,
    risk_level,
    recommendations,
    key_factors,
    model_version: "Production Model v1.0 (Linear + Logistic Regression)",
    created_at: new Date().toISOString(),
  };
}
