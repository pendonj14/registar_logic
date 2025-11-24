import React, { useState } from 'react';

// Helper: Fixes image URL issues
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `http://127.0.0.1:8000${path}`;
};

// Helper: Date Formatter
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

// Light Mode Status Colors
const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  processing: 'bg-blue-100 text-blue-800 border border-blue-200',
  completed: 'bg-green-100 text-green-800 border border-green-200',
  rejected: 'bg-red-100 text-red-800 border border-red-200',
  default: 'bg-gray-100 text-gray-800 border border-gray-200'
};

const RequestCard = ({ request, onUpdateStatus, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const statusKey = request.request_status?.toLowerCase() || 'default';
  const statusClass = STATUS_STYLES[statusKey] || STATUS_STYLES.default;

  // Stop click propagation for buttons
  const handleActionClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden mb-4"
    >
      {/* --- Header (Always Visible) --- */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-6 cursor-pointer flex justify-between items-start group bg-white"
      >
        <div className="space-y-1">
           {/* Name */}
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {request.user_name}
          </h3>
          {/* Request Document */}
          <p className="text-base text-gray-600 font-medium">
            {request.request}
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
            {/* Status Badge */}
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${statusClass}`}>
                {request.request_status}
            </span>
            {/* Arrow Icon */}
            <svg 
                className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
      </div>

      {/* --- Expanded Body --- */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-100 animate-fadeIn bg-gray-50/30">
          
          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Purpose</span>
                <p className="text-gray-700 mt-1 leading-relaxed">{request.request_purpose}</p>
            </div>
            <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Affiliation</span>
                <p className="text-gray-700 mt-1">
                    {request.affiliation} • {request.year_level}
                </p>
            </div>
            <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Date Requested</span>
                <p className="text-gray-700 mt-1">{formatDate(request.created_at)}</p>
            </div>
             <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Clearance Status</span>
                <div className="mt-1">
                    {request.clearance_status 
                        ? <span className="inline-flex items-center text-green-700 text-sm font-medium bg-green-50 px-2 py-1 rounded border border-green-100">✓ Cleared</span>
                        : <span className="inline-flex items-center text-red-700 text-sm font-medium bg-red-50 px-2 py-1 rounded border border-red-100">✕ Not Cleared</span>
                    }
                </div>
            </div>
          </div>

          {/* Image Section */}
          {request.eclearance_proof && (
            <div className="mt-6 bg-white p-3 rounded-lg border border-gray-200 inline-block shadow-sm">
                <p className="text-xs text-gray-500 mb-2 font-semibold">Clearance Proof Attachment:</p>
                <a 
                    href={getImageUrl(request.eclearance_proof)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={handleActionClick}
                >
                    <img 
                        src={getImageUrl(request.eclearance_proof)} 
                        alt="Clearance Proof" 
                        className="h-32 w-auto object-cover rounded border border-gray-100 hover:opacity-90 transition-opacity"
                    />
                </a>
            </div>
          )}

          {/* --- Footer Actions --- */}
          <div className="mt-8 pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
             {/* Status Dropdown */}
             <div className="relative" onClick={handleActionClick}>
                <select 
                    value={request.request_status} 
                    onChange={(e) => onUpdateStatus(request.id, e.target.value)}
                    className="bg-white text-gray-700 text-sm rounded-lg border border-gray-300 block w-40 p-2.5 focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none cursor-pointer hover:border-gray-400"
                >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                </select>
             </div>

             {/* Delete Button */}
             <button 
                onClick={(e) => { handleActionClick(e); onDelete(request.id); }}
                className="bg-white text-red-600 border border-red-200 hover:bg-red-50 font-medium py-2 px-4 rounded-lg text-sm transition-all duration-200 shadow-sm"
             >
               Delete
             </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default RequestCard;