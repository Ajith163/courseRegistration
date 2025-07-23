import React, { useState } from "react";

type RegistrationFormProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    email: string;
    joiningDate: string;
    studyMode: string;
    paymentMode: string;
  }) => void;
  initialData?: {
    name: string;
    email: string;
    joiningDate?: string;
    studyMode?: string;
    paymentMode?: string;
  };
};

const studyModes = ["Online", "Offline"];
const paymentModes = ["Credit Card", "UPI", "Netbanking"];

export default function RegistrationForm({
  open,
  onClose,
  onSubmit,
  initialData,
}: RegistrationFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [joiningDate, setJoiningDate] = useState(initialData?.joiningDate || "");
  const [studyMode, setStudyMode] = useState(initialData?.studyMode || "");
  const [paymentMode, setPaymentMode] = useState(initialData?.paymentMode || "");
  const [error, setError] = useState("");

  if (!open) return null;

  const validate = () => {
    if (!name.trim() || !email.trim() || !joiningDate || !studyMode || !paymentMode) {
      setError("All fields are required.");
      return false;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Invalid email address.");
      return false;
    }
    setError("");
    return true;
  };

  const isFormValid = () => {
    return (
      name.trim() &&
      email.trim() &&
      /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) &&
      joiningDate &&
      studyMode &&
      paymentMode
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ name, email, joiningDate, studyMode, paymentMode });
      setName("");
      setEmail("");
      setJoiningDate("");
      setStudyMode("");
      setPaymentMode("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h2 className="text-lg font-bold mb-4 text-center">
          Register for Course
        </h2>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Joining Date</label>
          <input
            type="date"
            value={joiningDate}
            onChange={(e) => setJoiningDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Mode of Study</label>
          <select
            value={studyMode}
            onChange={(e) => setStudyMode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="">Select mode</option>
            {studyModes.map((mode) => (
              <option key={mode} value={mode}>{mode}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Mode of Payment</label>
          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="">Select payment</option>
            {paymentModes.map((mode) => (
              <option key={mode} value={mode}>{mode}</option>
            ))}
          </select>
        </div>
        {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
            disabled={!isFormValid()}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
