import React from 'react';
import { X, AlertCircle } from 'lucide-react';

const ErrorModal = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform scale-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Red Background for error context */}
        <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center justify-between">
          <div className="flex items-center gap-3 text-red-700">
            <div className="p-2 bg-white rounded-full shadow-sm">
                <AlertCircle size={20} className="fill-red-100 stroke-red-600" />
            </div>
            <h3 className="font-bold text-lg">Error</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-red-300 hover:text-red-500 transition-colors p-1 hover:bg-red-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <h4 className="text-gray-900 font-bold text-lg mb-2">
            {title || "Something went wrong"}
          </h4>
          <p className="text-gray-500 text-sm leading-relaxed">
            {message || "An unexpected error occurred. Please try again."}
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 flex justify-center">
          <button 
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200 text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;