import { NextRequest, NextResponse } from "next/server";

const DEMO_STUDENTS = [
  { id: 1, student_code: "STU-00001", name: "Aarav Sharma", age: 16, gender: "Male", class_level: "10th", created_at: "2026-09-01T08:00:00Z", updated_at: "2026-09-01T08:00:00Z" },
  { id: 2, student_code: "STU-00002", name: "Diya Patel", age: 17, gender: "Female", class_level: "11th", created_at: "2026-09-01T08:00:00Z", updated_at: "2026-09-01T08:00:00Z" },
  { id: 3, student_code: "STU-00003", name: "Rohan Verma", age: 15, gender: "Male", class_level: "9th", created_at: "2026-09-01T08:00:00Z", updated_at: "2026-09-01T08:00:00Z" },
  { id: 4, student_code: "STU-00004", name: "Ananya Iyer", age: 18, gender: "Female", class_level: "12th", created_at: "2026-09-01T08:00:00Z", updated_at: "2026-09-01T08:00:00Z" },
  { id: 5, student_code: "STU-00005", name: "Kabir Mehta", age: 16, gender: "Male", class_level: "10th", created_at: "2026-09-01T08:00:00Z", updated_at: "2026-09-01T08:00:00Z" },
  { id: 6, student_code: "STU-00006", name: "Sneha Nair", age: 17, gender: "Female", class_level: "11th", created_at: "2026-09-01T08:00:00Z", updated_at: "2026-09-01T08:00:00Z" },
  { id: 7, student_code: "STU-00007", name: "Avani Joshi", age: 15, gender: "Female", class_level: "9th", created_at: "2026-09-01T08:00:00Z", updated_at: "2026-09-01T08:00:00Z" },
  { id: 8, student_code: "STU-00008", name: "Dhruv Malhotra", age: 16, gender: "Male", class_level: "11th", created_at: "2026-09-01T08:00:00Z", updated_at: "2026-09-01T08:00:00Z" },
  { id: 9, student_code: "STU-00009", name: "Pranav Singh", age: 14, gender: "Male", class_level: "9th", created_at: "2026-09-01T08:00:00Z", updated_at: "2026-09-01T08:00:00Z" },
  { id: 10, student_code: "STU-00010", name: "Saanvi Singh", age: 17, gender: "Female", class_level: "11th", created_at: "2026-09-01T08:00:00Z", updated_at: "2026-09-01T08:00:00Z" },
  { id: 11, student_code: "STU-00011", name: "Anushka Kapoor", age: 15, gender: "Female", class_level: "9th", created_at: "2026-09-01T08:00:00Z", updated_at: "2026-09-01T08:00:00Z" },
  { id: 12, student_code: "STU-00012", name: "Kabir Deshmukh", age: 16, gender: "Male", class_level: "11th", created_at: "2026-09-01T08:00:00Z", updated_at: "2026-09-01T08:00:00Z" },
  { id: 13, student_code: "STU-00013", name: "Aarav Bose", age: 14, gender: "Male", class_level: "10th", created_at: "2026-09-01T08:00:00Z", updated_at: "2026-09-01T08:00:00Z" },
  { id: 14, student_code: "STU-00014", name: "Arjun Reddy", age: 16, gender: "Male", class_level: "12th", created_at: "2026-09-01T08:00:00Z", updated_at: "2026-09-01T08:00:00Z" },
  { id: 15, student_code: "STU-00015", name: "Vihaan Nair", age: 16, gender: "Male", class_level: "12th", created_at: "2026-09-01T08:00:00Z", updated_at: "2026-09-01T08:00:00Z" },
  { id: 16, student_code: "STU-00016", name: "Aditya Iyer", age: 16, gender: "Male", class_level: "9th", created_at: "2026-09-01T08:00:00Z", updated_at: "2026-09-01T08:00:00Z" },
  { id: 17, student_code: "STU-00017", name: "Muhammad Gupta", age: 18, gender: "Male", class_level: "12th", created_at: "2026-09-01T08:00:00Z", updated_at: "2026-09-01T08:00:00Z" },
  { id: 18, student_code: "STU-00018", name: "Sai Malhotra", age: 14, gender: "Male", class_level: "9th", created_at: "2026-09-01T08:00:00Z", updated_at: "2026-09-01T08:00:00Z" },
  { id: 19, student_code: "STU-00019", name: "Anushka Bhat", age: 14, gender: "Female", class_level: "9th", created_at: "2026-09-01T08:00:00Z", updated_at: "2026-09-01T08:00:00Z" },
  { id: 20, student_code: "STU-00020", name: "Aadhya Malhotra", age: 16, gender: "Female", class_level: "11th", created_at: "2026-09-01T08:00:00Z", updated_at: "2026-09-01T08:00:00Z" },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("page_size") || "20", 10);
  const search = searchParams.get("search")?.toLowerCase() || "";
  const classLevel = searchParams.get("class_level") || "";

  let filtered = DEMO_STUDENTS;
  if (search) {
    filtered = filtered.filter(
      (s) => s.name.toLowerCase().includes(search) || s.student_code.toLowerCase().includes(search)
    );
  }
  if (classLevel) {
    filtered = filtered.filter((s) => s.class_level === classLevel);
  }

  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return NextResponse.json({
    items,
    total: filtered.length,
    page,
    page_size: pageSize,
  });
}
