"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Search,
  UserPlus,
  Users,
} from "lucide-react";
import { api, Student } from "@/lib/api";

export default function StudentsDirectory() {
  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [search, setSearch] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Student Form State
  const [newStudent, setNewStudent] = useState({
    student_code: "",
    name: "",
    age: 16,
    gender: "Male",
    class_level: "10th",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.listStudents(page, pageSize, search || undefined, classLevel || undefined);
      setStudents(res.items);
      setTotal(res.total);
    } catch (err: unknown) {
      console.error("Failed to load students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, classLevel]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchStudents();
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    try {
      await api.createStudent(newStudent);
      setShowAddModal(false);
      setNewStudent({
        student_code: "",
        name: "",
        age: 16,
        gender: "Male",
        class_level: "10th",
      });
      fetchStudents();
    } catch (err: unknown) {
      setFormError((err as Error)?.message || "Failed to create student profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-neutral-900">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            <Users className="h-4 w-4" />
            Institutional Records
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Student Management
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Browse, search, and manage registered student profiles and academic track records.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm hover:bg-neutral-200 transition-all cursor-pointer self-start"
        >
          <Plus className="h-4 w-4" />
          Add Student Profile
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search by student code or full name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 pl-9 pr-4 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:border-neutral-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-neutral-900 border border-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-200 hover:bg-neutral-800 cursor-pointer"
          >
            Search
          </button>
        </form>

        <select
          value={classLevel}
          onChange={(e) => {
            setClassLevel(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-300 focus:border-neutral-500 focus:outline-none cursor-pointer"
        >
          <option value="">All Class Levels</option>
          <option value="9th">9th Standard</option>
          <option value="10th">10th Standard</option>
          <option value="11th">11th Standard</option>
          <option value="12th">12th Standard</option>
          <option value="Undergraduate">Undergraduate</option>
        </select>
      </div>

      {/* Students Table */}
      <div className="mt-6 overflow-hidden rounded-xl border border-neutral-850 bg-black/60 backdrop-blur-md shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-850 bg-neutral-950 text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-3.5">Student Code</th>
                <th className="px-6 py-3.5">Name</th>
                <th className="px-6 py-3.5">Age</th>
                <th className="px-6 py-3.5">Gender</th>
                <th className="px-6 py-3.5">Class Tier</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900 text-neutral-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-neutral-500">
                    Loading student records...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-neutral-500">
                    No student records found matching the query.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="px-6 py-3.5 font-mono font-bold text-neutral-200">
                      {student.student_code}
                    </td>
                    <td className="px-6 py-3.5 font-medium text-white">{student.name}</td>
                    <td className="px-6 py-3.5 text-neutral-400">{student.age} yrs</td>
                    <td className="px-6 py-3.5 text-neutral-400">{student.gender}</td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center rounded-md bg-neutral-900 px-2 py-0.5 text-[11px] font-medium text-neutral-300 border border-neutral-800">
                        {student.class_level}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Link
                        href={`/students/${student.id}`}
                        className="font-medium text-neutral-200 hover:text-white hover:underline"
                      >
                        View Profile &rarr;
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between border-t border-neutral-900 px-6 py-3 bg-neutral-950/80 text-xs text-neutral-400">
          <div>
            Showing <span className="font-semibold text-neutral-200">{students.length}</span> of{" "}
            <span className="font-semibold text-neutral-200">{total}</span> students
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="inline-flex items-center gap-1 rounded-md border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-neutral-300 hover:bg-neutral-800 disabled:opacity-40 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Prev
            </button>
            <span className="font-medium text-neutral-300">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="inline-flex items-center gap-1 rounded-md border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-neutral-300 hover:bg-neutral-800 disabled:opacity-40 cursor-pointer"
            >
              Next
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-black p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-neutral-300" />
                Add Student Profile
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mt-3 rounded-lg border border-rose-800 bg-rose-950/60 p-2.5 text-xs text-rose-300">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateStudent} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-neutral-300 mb-1">Student Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. STU-09999"
                  value={newStudent.student_code}
                  onChange={(e) => setNewStudent({ ...newStudent, student_code: e.target.value })}
                  className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-neutral-200 focus:border-neutral-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Sharma"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-neutral-200 focus:border-neutral-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-300 mb-1">Age</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    required
                    value={newStudent.age}
                    onChange={(e) => setNewStudent({ ...newStudent, age: parseInt(e.target.value) || 16 })}
                    className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-neutral-200 focus:border-neutral-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-300 mb-1">Gender</label>
                  <select
                    value={newStudent.gender}
                    onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
                    className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-neutral-200 focus:border-neutral-500 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-300 mb-1">Class Level</label>
                <select
                  value={newStudent.class_level}
                  onChange={(e) => setNewStudent({ ...newStudent, class_level: e.target.value })}
                  className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-neutral-200 focus:border-neutral-500 focus:outline-none"
                >
                  <option value="9th">9th Standard</option>
                  <option value="10th">10th Standard</option>
                  <option value="11th">11th Standard</option>
                  <option value="12th">12th Standard</option>
                  <option value="Undergraduate">Undergraduate</option>
                </select>
              </div>

              <div className="mt-6 flex justify-end gap-2 pt-2 border-t border-neutral-900">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2 font-semibold text-neutral-300 hover:bg-neutral-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-white px-4 py-2 font-semibold text-black hover:bg-neutral-200 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Creating..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
