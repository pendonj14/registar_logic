import React from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, isDeleteAll = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform scale-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Red Background for danger context */}
        <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center justify-between">
          <div className="flex items-center gap-3 text-red-700">
            <div className="p-2 bg-white rounded-full shadow-sm">
                <AlertTriangle size={20} className="fill-red-100 stroke-red-600" />
            </div>
            <h3 className="font-bold text-lg">Delete Confirmation</h3>
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
            {title || "Are you sure?"}
          </h4>
          <p className="text-gray-500 text-sm leading-relaxed">
            {message || "This action cannot be undone. This record will be permanently removed from your history."}
          </p>

          {isDeleteAll && (
            <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-600 font-medium text-left flex gap-2">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>Warning: You are about to wipe your entire history of rejected and completed requests.</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors text-sm shadow-sm"
          >
            Cancel
          </button>
          <button 
            onClick={() => { onConfirm(); onClose(); }}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200 text-sm flex items-center justify-center gap-2"
          >
            <Trash2 size={16} />
            {isDeleteAll ? "Delete All" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;