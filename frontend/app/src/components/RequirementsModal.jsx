import React from 'react';
import { X, AlertCircle } from 'lucide-react';

const RequirementsModal = ({ isOpen, onClose, documentName }) => {
  if (!isOpen) return null;

  const requirementsMap = {
    "Diploma Replacement (P100)": (
      <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 text-sm text-gray-800">
        <h4 className="font-bold text-[#1a1f63] text-base mb-3 border-b border-blue-200 pb-2">
          REQUIREMENTS FOR DIPLOMA REPLACEMENT
        </h4>
        <ol className="list-decimal list-inside space-y-1.5 ml-1">
          <li>Original NSO-Birth Certificate</li>
          <li>Affidavit of loss <span className="text-xs text-gray-500 ml-1 font-normal">(Notarized)</span></li>
        </ol>
        
        <h5 className="font-bold text-[#1a1f63] mt-4 mb-2">If Authorized:</h5>
        <ol className="list-decimal list-inside space-y-1.5 ml-1">
          <li>Authorization letter should be notarized.</li>
          <li>Valid I.D of the Student/Owner/Alumni <span className="text-xs text-gray-500 ml-1 font-normal">(Photocopy)</span></li>
          <li>Valid I.D of the authorized person <span className="text-xs text-gray-500 ml-1 font-normal">(Photocopy)</span></li>
        </ol>
      </div>
    ),

    "Authentication (P5/pg)": (
      <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 text-sm text-gray-800">
        <h4 className="font-bold text-[#1a1f63] text-base mb-3 border-b border-blue-200 pb-2">
          REQUIREMENTS FOR AUTHENTICATION
        </h4>
        <ul className="list-disc list-inside space-y-2 ml-1">
          <li className="list-item flex items-center whitespace-normal">
            <span>Original TOR (Transcript of Records)</span>
            <span className="text-xs text-gray-500 ml-1 font-normal">(w/ 2 photocopies per page)</span>
          </li>

          <li>Remarks: For Employment Purposes Only</li>

          <li className="list-item flex items-center whitespace-normal">
            <span>Original Diploma</span>
            <span className="text-xs text-gray-500 ml-1 font-normal">(w/ 2 photocopies)</span>
          </li>

          <li>1 pc. Long Brown Envelope</li>
        </ul>

        <h5 className="font-bold text-[#1a1f63] mt-4 mb-2">If Authorized:</h5>
        <ul className="list-disc list-inside space-y-1.5 ml-1">
          <li>Authorization letter should be notarized.</li>
          <li>Valid I.D of the Student/Owner/Alumni <span className="text-xs text-gray-500 ml-1 font-normal">(Photocopy)</span></li>
          <li>Valid I.D of the authorized person <span className="text-xs text-gray-500 ml-1 font-normal">(Photocopy)</span></li>
        </ul>
      </div>
    ),

    "CAV Certification (P125)": (
      <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 text-sm text-gray-800">
        <h4 className="font-bold text-[#1a1f63] text-base mb-3 border-b border-blue-200 pb-2">
          REQUIREMENTS FOR C.A.V.
        </h4>
        <ul className="list-disc list-inside space-y-2 ml-1">
          <li className="list-item flex items-center whitespace-normal">
            <span>Original TOR (Transcript of Records)</span>
            <span className="text-xs text-gray-500 ml-1 font-normal">(w/ 2 photocopies per page)</span>
          </li>

          <li>Remarks: For Employment Purposes Only</li>

          <li className="list-item flex items-center whitespace-normal">
            <span>Original Diploma</span>
            <span className="text-xs text-gray-500 ml-1 font-normal">(w/ 2 photocopies)</span>
          </li>

          <li>1 pc. Long Brown Envelope</li>
        </ul>

        <h5 className="font-bold text-[#1a1f63] mt-4 mb-2">If Authorized:</h5>
        <ul className="list-disc list-inside space-y-1.5 ml-1 mb-6">
          <li>Authorization letter should be notarized.</li>
          <li>Valid I.D of the Student/Owner/Alumni <span className="text-xs text-gray-500 ml-1 font-normal">(Photocopy)</span></li>
          <li>Valid I.D of the authorized person <span className="text-xs text-gray-500 ml-1 font-normal">(Photocopy)</span></li>
        </ul>

        <div className="border-t border-blue-200 pt-4">
          <h5 className="font-bold text-[#1a1f63] mb-2">Applicable Agencies:</h5>
          <div className="grid grid-cols-2 gap-2 font-medium text-[#1a1f63] text-xs">
            <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span> DFA</div>
            <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span> CHED</div>
            <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span> DEP-ED</div>
            <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span> PNP</div>
            <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span> POEA</div>
            <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span> BFP</div>
            <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span> BJMP</div>
            <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span> Others</div>
          </div>
        </div>
      </div>
    )
  };

  const renderContent = () => {
    return requirementsMap[documentName] || (
      <div className="text-center text-gray-500 p-4">
        Please visit the registrar's office for requirements regarding <strong>{documentName}</strong>.
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-full sm:max-w-2xl overflow-hidden">

        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-bold text-[#1a1f63]">Document Information</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-yellow-500 flex-shrink-0" />
            <div>
              <p className="font-bold text-yellow-800">Cannot be requested online</p>
              <p className="text-sm text-yellow-700 mt-1">
                <span className="font-semibold">{documentName}</span> requires personal processing at the registrar's office due to specific requirements.
              </p>
            </div>
          </div>

          {renderContent()}
        </div>

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