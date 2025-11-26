import React, { useMemo } from 'react';
import { X, BarChart2, PieChart, TrendingUp, FileText } from 'lucide-react';

const StatsModal = ({ isOpen, onClose, requests }) => {
  if (!isOpen) return null;

  // Calculate Statistics using useMemo for performance
  const stats = useMemo(() => {
    const total = requests.length;
    
    // Group by Status
    const byStatus = requests.reduce((acc, curr) => {
      const status = curr.request_status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Group by Request Type (e.g., "Transcript", "Diploma")
    const byType = requests.reduce((acc, curr) => {
      const type = curr.request || 'Unspecified';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // Sort types by volume (descending)
    const sortedTypes = Object.entries(byType)
      .sort(([, a], [, b]) => b - a);

    return { total, byStatus, sortedTypes };
  }, [requests]);

  // Helper for status colors
  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-500';
      case 'To Pay': return 'bg-blue-600';
      case 'Confirmed': return 'bg-green-500';
      case 'Released': return 'bg-pink-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg text-[#1a1f63]">
              <BarChart2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Statistical Report</h2>
              <p className="text-sm text-gray-500">Overview of request volume and types</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
              <div className="flex items-center gap-3 text-[#1a1f63] mb-2">
                <TrendingUp size={20} />
                <span className="font-semibold text-sm uppercase tracking-wider">Total Requests</span>
              </div>
              <span className="text-4xl font-black text-[#1a1f63]">{stats.total}</span>
            </div>
            
            <div className="bg-green-50 p-5 rounded-xl border border-green-100">
               <div className="flex items-center gap-3 text-green-700 mb-2">
                <FileText size={20} />
                <span className="font-semibold text-sm uppercase tracking-wider">Most Common</span>
              </div>
              <span className="text-xl font-bold text-green-800 truncate block">
                {stats.sortedTypes[0]?.[0] || 'N/A'}
              </span>
              <span className="text-sm text-green-600">
                {stats.sortedTypes[0]?.[1] || 0} requests
              </span>
            </div>

            <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
               <div className="flex items-center gap-3 text-orange-700 mb-2">
                <PieChart size={20} />
                <span className="font-semibold text-sm uppercase tracking-wider">Pending Action</span>
              </div>
              <span className="text-4xl font-black text-orange-700">
                {(stats.byStatus['Pending'] || 0) + (stats.byStatus['To Pay'] || 0)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Status Distribution Chart */}
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-[#1a1f63] rounded-full"></div>
                Status Distribution
              </h3>
              <div className="space-y-4">
                {['Pending', 'To Pay', 'Confirmed', 'Released', 'Rejected'].map((status) => {
                  const count = stats.byStatus[status] || 0;
                  const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                  
                  return (
                    <div key={status}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-600">{status}</span>
                        <span className="text-gray-900 font-bold">{count}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className={`h-2.5 rounded-full ${getStatusColor(status)} transition-all duration-500`} 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Request Types List */}
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-[#1a1f63] rounded-full"></div>
                Request Types Breakdown
              </h3>
              <div className="max-h-[250px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {stats.sortedTypes.map(([type, count], index) => (
                  <div key={type} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded bg-gray-100 text-xs font-bold text-gray-500">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-700">{type}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#1a1f63] opacity-80" 
                          style={{ width: `${(count / stats.total) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 w-6 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StatsModal;