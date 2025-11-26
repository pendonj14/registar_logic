import React, { useState, useRef } from 'react';
import { X, CheckCircle, Calendar, Clock, AlertCircle } from 'lucide-react';

const PaymentVerificationModal = ({ isOpen, onClose, request, onConfirmPayment }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [isConfirming, setIsConfirming] = useState(false); // 1. New State for confirmation step
  const dateRef = useRef(null);

  if (!isOpen || !request) return null;

  // 2. Handle the initial click (opens confirmation)
  const handleInitialClick = () => {
    if (!selectedDate) return;
    setIsConfirming(true);
  };

  // 3. Handle the final confirmation (sends data)
  const handleFinalConfirm = () => {
    // Automatically append 3:00 PM (15:00) to the selected date
    const finalDateTime = `${selectedDate}T15:00:00`;
    onConfirmPayment(request.id, finalDateTime);
    setIsConfirming(false); // Reset state
  };

  const handleCancelConfirmation = () => {
    setIsConfirming(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      
      {/* --- NESTED CONFIRMATION MODAL --- */}
      {isConfirming && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 border border-gray-100 transform scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center mb-4 text-yellow-600">
                <AlertCircle size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Confirm Payment?</h3>
              <p className="text-sm text-gray-500 mb-4">
                You are setting the claim date to:
              </p>
              <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 mb-6 w-full">
                <span className="font-mono font-bold text-[#1a1f63] text-base">
                  {selectedDate} <span className="text-gray-400 text-xs">at 3:00 PM</span>
                </span>
              </div>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={handleCancelConfirmation}
                  className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-sm transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={handleFinalConfirm}
                  className="flex-1 px-4 py-2 text-white bg-[#1a1f63] hover:bg-blue-900 rounded-lg font-bold text-sm transition-colors shadow-md"
                >
                  Yes, Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN MODAL CONTENT --- */}
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col animate-in fade-in zoom-in duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#1a1f63] flex items-center gap-2">
            <CheckCircle size={20} /> Verify Payment
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          
          {/* Payment Proof Image */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Payment Proof</label>
            <div className="bg-gray-100 rounded-lg p-2 border border-gray-200 flex justify-center relative group">
              {request.payment_proof_url ? (
                <a href={request.payment_proof_url} target="_blank" rel="noreferrer" className="block w-full text-center">
                    <img 
                    src={request.payment_proof_url} 
                    alt="Payment Proof" 
                    className="max-h-64 object-contain mx-auto rounded shadow-sm hover:opacity-90 transition-opacity cursor-zoom-in" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                            Click to Expand
                        </span>
                    </div>
                </a>
              ) : (
                <span className="text-gray-400 text-sm p-4">No image loaded</span>
              )}
            </div>
          </div>

          {/* Set Claim Date Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                <span>Set Claim Date</span>
                <span className="text-[#1a1f63] flex items-center gap-1 normal-case bg-blue-50 px-2 py-0.5 rounded text-[10px]">
                    <Clock size={12} /> Time defaults to 3:00 PM
                </span>
            </label>
            
            <div className="relative">
                <input
                    ref={dateRef}
                    type="date"
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1f63] outline-none text-gray-700 font-medium cursor-pointer"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
                <button
                    type="button"
                    onClick={() => {
                    if (dateRef.current?.showPicker) {
                        dateRef.current.showPicker();
                    } else {
                        dateRef.current.focus();
                    }
                    }}
                    className="absolute left-3 top-3.5 text-gray-400"
                >
                    <Calendar size={18} />
                </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Click the calendar icon to pick a date.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-bold text-sm transition-colors"
          >
            Cancel
          </button>
          <button 
            // 4. Update click handler to trigger confirmation instead of direct submit
            onClick={handleInitialClick}
            disabled={!selectedDate} 
            className={`px-6 py-2 text-white rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                !selectedDate 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-[#1a1f63] hover:bg-blue-900 shadow-lg shadow-indigo-200'
            }`}
          >
            <CheckCircle size={16} />
            Verify Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentVerificationModal;