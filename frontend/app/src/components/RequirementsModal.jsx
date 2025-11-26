import React from 'react';
import { X, AlertCircle } from 'lucide-react';

const RequirementsModal = ({ isOpen, onClose, documentName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-bold text-[#1a1f63]">Document Information</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Warning Alert */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-yellow-500 flex-shrink-0" />
            <div>
              <p className="font-bold text-yellow-800">Cannot be requested online</p>
              <p className="text-sm text-yellow-700 mt-1">
                <span className="font-semibold">{documentName}</span> requires personal processing at the registrar's office due to specific requirements.
              </p>
            </div>
          </div>
          
          {/* Requirements from Image */}
          <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 text-sm text-gray-800">
            <h4 className="font-bold text-[#1a1f63] text-base mb-3 border-b border-blue-200 pb-2">
              REQUIREMENTS FOR DIPLOMA REPLACEMENT
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 ml-1">
              <li>Original NSO-Birth Certificate</li>
              <li>Affidavit of loss (Notarized)</li>
            </ol>
            
            <h5 className="font-bold text-[#1a1f63] mt-4 mb-2">If Authorized:</h5>
            <ol className="list-decimal list-inside space-y-1.5 ml-1">
              <li>Authorization letter should be notarized.</li>
              <li>Valid I.D of the Student/Owner/Alumni (Photocopy)</li>
              <li>Valid I.D of the authorized person (Photocopy)</li>
            </ol>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#1a1f63] text-white rounded-lg hover:bg-indigo-900 transition font-medium shadow-sm"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequirementsModal;