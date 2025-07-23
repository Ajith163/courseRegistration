import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  showConfirm?: boolean;
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = "Confirm",
  showConfirm = false,
}: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 font-sans">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md relative">
        {/* Close (X) button at top right */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white text-2xl font-bold focus:outline-none"
        >
          &times;
        </button>
        {title && (
          <div className="rounded-t-lg -mt-6 -mx-6 mb-4 p-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 text-gray-800 text-center font-bold text-xl font-serif tracking-wide italic shadow-sm">
            {title}
          </div>
        )}
        <div className="mb-4">{children}</div>
        <div className="flex justify-end gap-2 mt-4">
          {/* Only show confirm button if needed */}
          {showConfirm && onConfirm && (
            <button
              onClick={onConfirm}
              className="px-4 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 