import React, { useEffect } from "react";

type ToastProps = {
  message: string;
  onClose: () => void;
};

export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 bg-blue-600 text-white px-6 py-2 rounded shadow-lg dark:bg-blue-500 animate-fade-in">
      {message}
    </div>
  );
}
