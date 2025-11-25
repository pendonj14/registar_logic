// src/components/ReleaseModal.jsx
import React from 'react';
import { X, CheckCircle } from 'lucide-react';

const ReleaseModal = ({ isOpen, onClose, onConfirm, request }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl transform transition-all scale-100">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <CheckCircle className="text-green-600" size={24} />
            Confirm Release
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="mb-8">
          <p className="text-gray-600 mb-2 text-left">
            Are you sure you want to mark this document as <strong>Released</strong>?
          </p>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-left">
            <p className="text-sm text-gray-500">Document:</p>
            <p className="font-semibold text-gray-800">{request?.request || 'Document'}</p>
            <p className="text-sm text-gray-500 mt-2">Student:</p>
            <p className="font-semibold text-gray-800">{request?.user_name || 'Student'} ( {request?.user} )</p>
            <p className="text-sm text-gray-500 mt-2">Email:</p>
            <p className="font-semibold text-gray-800">{request?.email || 'Not Specified'}</p>
            <p className="text-sm text-gray-500 mt-2">Phone Number:</p>
            <p className="font-semibold text-gray-800">{request?.contact_number || 'Not Specified'}</p>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            This action cannot be undone. The student will be notified that they have received the document.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => onConfirm(request)}
            className="px-5 py-2.5 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-lg shadow-green-200 transition-colors"
          >
            Confirm & Release
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReleaseModal;