import React, { useState, useEffect } from "react";
import Link from "next/link";
import Toast from "./Toast";
import Modal from "./Modal";
import {
  getRegisteredCourses,
  registerCourse,
  unregisterCourse,
} from "../utils/storage";
import { FaUser, FaEnvelope, FaPhone, FaChalkboardTeacher, FaMoneyBill } from "react-icons/fa";

type Course = {
  id: number;
  name: string;
  description: string;
};

type CourseTableProps = {
  search: string;
  courses: Course[];
};

type ExtendedCourse = Course & {
  duration?: string;
  fee?: string;
  tutor?: string;
};

const PAGE_SIZE = 5;

export default function CourseTable({ search, courses }: CourseTableProps) {
  const [page, setPage] = useState(1);
  const [registered, setRegistered] = useState<number[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<ExtendedCourse | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [unregisterCourseId, setUnregisterCourseId] = useState<number | null>(null);
  const [unregisterCourseName, setUnregisterCourseName] = useState<string>("");
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationCourse, setRegistrationCourse] = useState<ExtendedCourse | null>(null);
  const [registrationForm, setRegistrationForm] = useState({
    name: "",
    email: "",
    phone: "",
    mode: "",
    payment: "",
  });
  const [registrationError, setRegistrationError] = useState<string>("");

  const isValidPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    return digits.length === 10;
  };

  const isFormValid = () => {
    return (
      registrationForm.name.trim() &&
      registrationForm.email.trim() &&
      isValidPhone(registrationForm.phone) &&
      registrationForm.mode &&
      registrationForm.payment &&
      registrationCourse &&
      !registered.includes(registrationCourse.id)
    );
  };

  useEffect(() => {
    setRegistered(getRegisteredCourses());
  }, []);

  const handleRegister = (id: number) => {
    registerCourse(id);
    setRegistered(getRegisteredCourses());
    setToast("Registered!");
  };

  const handleUnregister = (id: number) => {
    unregisterCourse(id);
    setRegistered(getRegisteredCourses());
    setToast("Unregistered!");
  };

  const filtered = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Store registration details per course
  const handleRegisterWithDetails = (courseId: number, details: typeof registrationForm) => {
    // Save to localStorage (extend getRegisteredCourses logic if needed)
    const all = JSON.parse(localStorage.getItem("registeredDetails") || "{}") as Record<string, any>;
    all[courseId] = details;
    localStorage.setItem("registeredDetails", JSON.stringify(all));
    registerCourse(courseId);
    setRegistered(getRegisteredCourses());
    setToast("Registered!");
  };

  return (
    <div className="overflow-x-auto bg-transparent">
      <table className="min-w-full rounded-lg shadow border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <thead>
          <tr className="bg-gray-800 dark:bg-gray-800">
            <th className="px-4 py-2 text-left text-white">Name</th>
            <th className="px-4 py-2 text-left text-white">Description</th>
            <th className="px-4 py-2 text-left text-white">Tutor</th>
            <th className="px-4 py-2 text-white">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="text-center py-8 text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-900"
              >
                No courses found.
              </td>
            </tr>
          ) : (
            paginated.map((course, idx) => {
              const isReg = registered.includes(course.id);
              return (
                <tr
                  key={course.id}
                  className={`border-b border-gray-200 dark:border-gray-700 ${
                    idx % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-800"
                      : "bg-white dark:bg-gray-900"
                  } hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors`}
                >
                  <td className="px-4 py-2 font-medium text-gray-900 dark:text-gray-100 min-w-[140px]">
                    {course.name}
                  </td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100 min-w-[140px]">
                    {course.description}
                  </td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100 min-w-[140px] text-left truncate" title={('tutor' in course) ? (course as ExtendedCourse).tutor : '-'}>
                    {('tutor' in course) ? (course as ExtendedCourse).tutor : '-'}
                  </td>
                  <td className="px-4 py-2 text-center flex gap-2 justify-center min-w-[140px]">
                    <button
                      onClick={() => {
                        setSelectedCourse(course as ExtendedCourse);
                        setShowDetails(true);
                      }}
                      className="px-3 py-1 rounded-lg font-semibold bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                    >
                      Details
                    </button>
                    {isReg ? (
                      <button
                        onClick={() => {
                          window.location.href = "/courses/registered";
                        }}
                        className="px-4 py-1 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white shadow focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors"
                      >
                        View
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setRegistrationCourse(course as ExtendedCourse);
                          setShowRegistration(true);
                          setRegistrationForm({ name: "", email: "", phone: "", mode: "", payment: "" });
                          setRegistrationError("");
                        }}
                        className="px-4 py-1 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                      >
                        Register
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700 dark:text-gray-200">
          Page {page} of {totalPages || 1}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || totalPages === 0}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      {/* Details Modal */}
      <Modal
        open={showDetails}
        onClose={() => {
          setShowDetails(false);
          setSelectedCourse(null);
        }}
        title={selectedCourse?.name}
      >
        <div className="space-y-2">
          <div><b>Description:</b> {selectedCourse?.description}</div>
          <div><b>Duration:</b> {selectedCourse?.duration || "-"}</div>
          <div><b>Fee:</b> {selectedCourse?.fee || "-"}</div>
          <div><b>Tutor:</b> {selectedCourse?.tutor || "-"}</div>
        </div>
      </Modal>
      {/* Unregister Confirmation Modal */}
      <Modal
        open={unregisterCourseId !== null}
        onClose={() => setUnregisterCourseId(null)}
        title="Unregister Course?"
        onConfirm={() => {
          if (unregisterCourseId !== null) {
            handleUnregister(unregisterCourseId);
          }
          setUnregisterCourseId(null);
        }}
        showConfirm={true}
        confirmText="Yes, Unregister"
      >
        <div>Are you sure you want to unregister from <b>{unregisterCourseName}</b>?</div>
      </Modal>
      {/* Registration Modal */}
      <Modal
        open={showRegistration}
        onClose={() => {
          setShowRegistration(false);
          setRegistrationError("");
        }}
        title={`Register for ${registrationCourse?.name || "Course"}`}
      >
        <form
          className="space-y-4 animate-fade-in"
          onSubmit={e => {
            e.preventDefault();
            if (!isValidPhone(registrationForm.phone)) {
              setRegistrationError("Phone number must be 10 digits.");
              return;
            }
            if (!registrationForm.mode || !registrationForm.payment) {
              setRegistrationError("Please select Mode of Study and Mode of Payment.");
              return;
            }
            if (registrationCourse) {
              handleRegisterWithDetails(registrationCourse.id, registrationForm);
              setShowRegistration(false);
              setRegistrationCourse(null);
              setRegistrationError("");
            }
          }}
        >
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2 border-none rounded-xl bg-white/60 dark:bg-gray-800/60 shadow-inner focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-100 placeholder-gray-400"
              value={registrationForm.name}
              onChange={e => setRegistrationForm(f => ({ ...f, name: e.target.value }))}
              required
              placeholder="Your Name"
            />
          </div>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              className="w-full pl-10 pr-3 py-2 border-none rounded-xl bg-white/60 dark:bg-gray-800/60 shadow-inner focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-100 placeholder-gray-400"
              value={registrationForm.email}
              onChange={e => setRegistrationForm(f => ({ ...f, email: e.target.value }))}
              required
              placeholder="Email Address"
            />
          </div>
          <div className="relative">
            <FaPhone className="absolute left-3 top-3 text-gray-400" />
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-full pl-10 pr-3 py-2 border-none rounded-xl bg-white/60 dark:bg-gray-800/60 shadow-inner focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-100 placeholder-gray-400"
              value={registrationForm.phone}
              onChange={e => {
                // Only allow digits in the input
                const value = e.target.value.replace(/[^0-9]/g, "");
                setRegistrationForm(f => ({ ...f, phone: value }));
                if (registrationError) setRegistrationError("");
              }}
              required
              placeholder="Phone Number"
              maxLength={10}
            />
          </div>
          <div className="relative">
            <FaChalkboardTeacher className="absolute left-3 top-3 text-gray-400" />
            <select
              className="w-full pl-10 pr-3 py-2 border-none rounded-xl bg-white/60 dark:bg-gray-800/60 shadow-inner focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-100"
              value={registrationForm.mode}
              onChange={e => setRegistrationForm(f => ({ ...f, mode: e.target.value }))}
              required
            >
              <option value="">Select mode</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
          <div className="relative">
            <FaMoneyBill className="absolute left-3 top-3 text-gray-400" />
            <select
              className="w-full pl-10 pr-3 py-2 border-none rounded-xl bg-white/60 dark:bg-gray-800/60 shadow-inner focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-100"
              value={registrationForm.payment}
              onChange={e => setRegistrationForm(f => ({ ...f, payment: e.target.value }))}
              required
            >
              <option value="">Select payment</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
          {registrationError && (
            <div className="text-red-600 text-sm text-center">{registrationError}</div>
          )}
          {registrationCourse && registered.includes(registrationCourse.id) && (
            <div className="text-red-600 text-sm text-center">You are already registered for this course.</div>
          )}
          <button
            type="submit"
            className="px-5 py-2 rounded-xl font-semibold bg-blue-600/80 hover:bg-blue-700/90 text-white shadow-lg w-full disabled:opacity-50"
            disabled={!isFormValid()}
          >
            Confirm
          </button>
        </form>
      </Modal>
    </div>
  );
}