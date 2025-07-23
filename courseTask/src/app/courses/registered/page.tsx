"use client";
import { useEffect, useState } from "react";
import coursesData from "@/data/courses.json";
import { getRegisteredCourses, unregisterCourse } from "@/utils/storage";
import Toast from "@/components/Toast";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";

const PAGE_SIZE = 5;

type Course = {
  id: number;
  name: string;
  description: string;
};

export default function RegisteredCoursesPage() {
  const [registered, setRegistered] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const router = useRouter();
  // State for confirmation modal
  const [unregisterCourseId, setUnregisterCourseId] = useState<number | null>(null);
  const [unregisterCourseName, setUnregisterCourseName] = useState<string>("");

  useEffect(() => {
    setRegistered(getRegisteredCourses());
  }, []);

  const handleUnregister = (id: number) => {
    unregisterCourse(id);
    setRegistered(getRegisteredCourses());
    setToast("Course unregistered!");
  };

  // Fetch registration details from localStorage
  const getDetails = (id: number) => {
    if (typeof window === 'undefined') return null;
    const all = JSON.parse(localStorage.getItem('registeredDetails') || '{}');
    return all[id] || null;
  };

  const registeredCourses = (coursesData as Course[]).filter((c) =>
    registered.includes(c.id)
  );
  const totalPages = Math.ceil(registeredCourses.length / PAGE_SIZE);
  const paginated = registeredCourses.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="max-w-full mx-auto p-4 sm:p-8">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.push("/courses")}
            className="mr-4 px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold shadow"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-center flex-1 text-gray-900 dark:text-gray-100">
            My Registered Courses
          </h1>
        </div>
        {paginated.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12 text-lg">
            You have not registered for any courses yet.
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto w-full">
            <table className="min-w-full rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-800 dark:bg-gray-700">
                  <th className="px-4 py-3 text-left text-white font-semibold">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-white font-semibold">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-white font-semibold">
                    Registration Details
                  </th>
                  <th className="px-4 py-3 text-white font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((course, idx) => {
                  const details = getDetails(course.id);
                  return (
                    <tr
                      key={course.id}
                      className={`transition-colors ${
                        idx % 2 === 0
                          ? "bg-gray-50 dark:bg-gray-900"
                          : "bg-white dark:bg-gray-800"
                      } hover:bg-blue-50 dark:hover:bg-gray-700`}
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 text-base">
                        {course.name}
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300 text-sm">
                        {course.description}
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300 text-sm">
                        {details ? (
                          <div className="space-y-1">
                            <div><b>Name:</b> {details.name}</div>
                            <div><b>Email:</b> {details.email}</div>
                            <div><b>Phone:</b> {details.phone}</div>
                            <div><b>Mode:</b> {details.mode}</div>
                            <div><b>Payment:</b> {details.payment}</div>
                          </div>
                        ) : (
                          <span className="italic text-gray-400">No details</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => {
                            setUnregisterCourseId(course.id);
                            setUnregisterCourseName(course.name);
                          }}
                          className="px-4 py-1 rounded-lg font-semibold bg-red-600 hover:bg-red-700 text-white shadow focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
                        >
                          Unregister
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 font-semibold"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-200">
            Page {page} of {totalPages || 1}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 font-semibold"
          >
            Next
          </button>
        </div>
      </div>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
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
    </div>
  );
}