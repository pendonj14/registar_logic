import React, { useMemo, useState, useRef } from 'react';
import { X, BarChart2, PieChart, TrendingUp, FileText, Filter, Calendar, RefreshCcw, ChevronDown, ChevronUp } from 'lucide-react';

const StatsModal = ({ isOpen, onClose, requests }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false); // New state for toggling UI

  // Refs to trigger date picker programmatically
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  // 1. STATS LOGIC (Keep hooks unconditional)
  const stats = useMemo(() => {
    if (!isOpen) return { total: 0, byStatus: {}, sortedTypes: [] };

    let filteredRequests = requests;

    // Filter Logic
    if (startDate) {
      filteredRequests = filteredRequests.filter(req => {
        const reqDate = req.created_at ? req.created_at.substring(0, 10) : '';
        return reqDate >= startDate;
      });
    }

    if (endDate) {
      filteredRequests = filteredRequests.filter(req => {
        const reqDate = req.created_at ? req.created_at.substring(0, 10) : '';
        return reqDate <= endDate;
      });
    }

    // Calculations
    const total = filteredRequests.length;
    
    const byStatus = filteredRequests.reduce((acc, curr) => {
      const status = curr.request_status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const byType = filteredRequests.reduce((acc, curr) => {
      const type = curr.request || 'Unspecified';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const sortedTypes = Object.entries(byType).sort(([, a], [, b]) => b - a);

    return { total, byStatus, sortedTypes };
  }, [requests, startDate, endDate, isOpen]);

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-500';
      case 'To Pay': return 'bg-blue-600';
      case 'Confirmed': return 'bg-green-500';
      case 'Released': return 'bg-pink-500';
      case 'Rejected': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 no-scrollbar">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col transition-all duration-300 no-scrollbar">
        
        {/* Header Section */}
        <div className="flex flex-col border-b border-gray-100 sticky top-0 bg-white z-20">
            <div className="flex items-center justify-between p-6">
                
                {/* Title */}
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg text-[#1a1f63]">
                        <BarChart2 size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Statistical Report</h2>
                        <p className="text-sm text-gray-500">Overview of request volume</p>
                    </div>
                </div>

                {/* Actions: Filter Toggle & Close */}
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                            showFilters || startDate || endDate
                                ? 'bg-indigo-50 text-[#1a1f63]' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <Filter size={16} />
                        <span>Filter</span>
                        {showFilters ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                    </button>
                    
                    <div className="w-px h-6 bg-gray-200 mx-1"></div>

                    <button onClick={onClose} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors text-gray-400">
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* EXPANDABLE FILTER SECTION */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out bg-gray-50/50 ${showFilters ? 'max-h-40 border-t border-gray-100' : 'max-h-0'}`}>
                <div className="px-6 py-4 flex flex-col md:flex-row items-end gap-4">
                    
                    <div className="flex-1 w-full grid grid-cols-2 gap-4">
                        {/* Start Date Input */}
                        <div className="relative group cursor-pointer">
                            <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Start Date</label>
                            <div 
                                className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2.5 shadow-sm hover:border-indigo-400 transition-colors"
                                onClick={() => startDateRef.current?.showPicker()} // Click container to open
                            >
                                <Calendar 
                                    size={18} 
                                    className="text-[#1a1f63] cursor-pointer mr-3"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent double triggering
                                        startDateRef.current?.showPicker();
                                    }}
                                />
                                <input 
                                    ref={startDateRef}
                                    type="date" 
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="bg-transparent border-none outline-none text-sm text-gray-700 w-full cursor-pointer font-medium"
                                />
                            </div>
                        </div>

                        {/* End Date Input */}
                        <div className="relative group cursor-pointer">
                            <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">End Date</label>
                            <div 
                                className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2.5 shadow-sm hover:border-indigo-400 transition-colors"
                                onClick={() => endDateRef.current?.showPicker()}
                            >
                                <Calendar 
                                    size={18} 
                                    className="text-[#1a1f63] cursor-pointer mr-3"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        endDateRef.current?.showPicker();
                                    }}
                                />
                                <input 
                                    ref={endDateRef}
                                    type="date" 
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate}
                                    className="bg-transparent border-none outline-none text-sm text-gray-700 w-full cursor-pointer font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Reset Button */}
                    {(startDate || endDate) && (
                        <button 
                            onClick={handleResetFilters}
                            className="flex items-center gap-2 text-xs font-bold text-red-500 bg-white border border-red-100 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors shadow-sm mb-[1px]"
                        >
                            <RefreshCcw size={14} />
                            Reset
                        </button>
                    )}
                </div>
            </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-8">
            
            {/* ... (Existing Cards and Charts code remains exactly the same) ... */}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
              <div className="flex items-center gap-3 text-[#1a1f63] mb-2">
                <TrendingUp size={20} />
                <span className="font-semibold text-sm uppercase tracking-wider">
                    {startDate || endDate ? 'Filtered Volume' : 'Total Requests'}
                </span>
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
              
              {stats.total === 0 ? (
                  <div className="text-center py-10 text-gray-400 text-sm">No data for selected period</div>
              ) : (
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
              )}
            </div>

            {/* Request Types List */}
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-[#1a1f63] rounded-full"></div>
                Request Types Breakdown
              </h3>
              
              {stats.total === 0 ? (
                  <div className="text-center py-10 text-gray-400 text-sm">No data for selected period</div>
              ) : (
                <div className="max-h-[250px] overflow-y-auto pr-2 space-y-3 no-scrollbar">
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsModal;