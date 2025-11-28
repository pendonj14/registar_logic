import React from 'react';
import { X, User, Calendar, Phone, Mail, FileText, ShieldCheck, School, Info, CircleUser } from 'lucide-react';

const RequestModal = ({ 
  isOpen, 
  onClose, 
  request, 
  onApprove, 
  onReject,
  // New props for customization
  approveLabel = "Approve Request",
  rejectLabel = "Reject Request",
  showReject = true
}) => {
  if (!isOpen || !request) return null;

  // Helper to format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Helper component for data rows
  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="mt-2.5 text-indigo-600">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-gray-800 break-words">{value || 'N/A'}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* --- Header --- */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 text-left">
          <div>
            <h2 className="text-xl font-bold text-[#1a1f63]">Review Request</h2>
            <p className="text-sm text-gray-500 text-left">ID: #{request.id}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* --- Body (Scrollable) --- */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 text-left">
          
          {/* Section 1: Request Details */}
          <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
            <h3 className="text-[#1a1f63] font-bold mb-4 flex items-center gap-2">
              <Info size={20}/> Document Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
              <InfoRow icon={FileText} label="Document Requested" value={request.request} />
              <InfoRow icon={FileText} label="Purpose" value={request.request_purpose} />
              <InfoRow icon={Calendar} label="Date Requested" value={request.created_at} />
              <InfoRow icon={ShieldCheck} label="Current Status" value={request.request_status} />
            </div>
          </div>

          {/* Section 2: Student Information */}
          <div>
            <h3 className="text-gray-700 font-bold mb-4 flex items-center gap-2 px-2">
              <CircleUser size={20} /> Student Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 ">
                <InfoRow icon={User} label="Full Name"  value={request.user_name} />
                <InfoRow icon={Mail} label="Email Address" value={request.email} />
                <InfoRow icon={School} label="Program" value={request.college_program} />
                <InfoRow icon={Phone} label="Contact Number" value={request.contact_number} />
                <InfoRow icon={Calendar} label="Birth Date" value={formatDate(request.birth_date)} />
                <InfoRow icon={School} label="Affiliation" value={request.affiliation} />
                <InfoRow icon={School} label="Year Level" value={request.year_level} />
                <InfoRow icon={School} label="Last Attended" value={request.last_attended} />
            </div>
          </div>

          {/* Section 3: Clearance Proof */}
          <div>
            <h3 className="text-gray-700 font-bold mb-4 flex items-center gap-2 px-2">
               <ShieldCheck size={20} /> Clearance Validation
            </h3>
            <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center">
               <p className="mb-3 text-sm font-medium text-gray-600">
                 Status: <span className={request.clearance_status ? "text-green-600" : "text-amber-600"}>
                   {request.clearance_status ? "Cleared" : "Pending / Not Cleared"}
                 </span>
               </p>
               
               {request.eclearance_proof_url ? (
                 <div className="relative group">
                    <img 
                      src={request.eclearance_proof_url} 
                      alt="Clearance Proof" 
                      className="max-h-60 rounded-lg shadow-sm object-contain bg-white"
                    />
                    <a 
                      href={request.eclearance_proof_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg text-white font-bold"
                    >
                      View Full Image
                    </a>
                 </div>
               ) : (
                 <div className="text-gray-400 text-sm italic">No clearance proof uploaded</div>
               )}
            </div>
          </div>
        </div>

        {/* --- Footer (Buttons) --- */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-center gap-4">
          {showReject && (
            <button
              onClick={() => onReject(request)}
              className="px-8 py-3 rounded-xl text-red-600 font-bold hover:bg-red-100 hover:scale-105 transition-all duration-200 shadow-sm border border-red-200"
            >
              {rejectLabel}
            </button>
          )}
          <button
            onClick={() => onApprove(request)}
            className="px-8 py-3 rounded-xl text-white bg-blue-950 font-bold hover:bg-blue-800 hover:scale-105 transition-all duration-200 shadow-lg shadow-indigo-200"
          >
            {approveLabel}
          </button>
        </div>

      </div>
    </div>
  );
};

export default RequestModal;