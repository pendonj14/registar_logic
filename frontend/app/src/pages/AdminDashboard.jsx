import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Clock, 
  CreditCard, 
  CheckCircle,  
  MailCheck
} from 'lucide-react';
import axiosInstance from '../utils/axios';
import { Sidebar } from '../components/SideBar';
import RequestModal from '../components/RequestModal';
import PaymentVerificationModal from '../components/PaymentVerificationModal';
import ReleaseModal from '../components/ReleaseModal';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Pending');
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axiosInstance.get('/requests/');
      setRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setLoading(false);
    }
  };

  const handleOpenReview = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  // --- Handlers for PAYMENT Modal ---
  const handleOpenPayment = (request) => {
    setSelectedRequest(request);
    setIsPaymentModalOpen(true);
  };

  const handleClosePayment = () => {
    setIsPaymentModalOpen(false);
    setSelectedRequest(null);
  };

  const handleOpenRelease = (request) => {
    setSelectedRequest(request);
    setIsReleaseModalOpen(true);
  };

  const handleCloseRelease = () => {
    setIsReleaseModalOpen(false);
    setSelectedRequest(null);
  };

  // 4. Handle Approve / Reject Logic
  const handleStatusUpdate = async (id, newStatus, claimDate = null) => {
    try {
      const payload = { request_status: newStatus };
      
      // If claimDate is provided (from the Payment Modal), add it to the payload
      if (claimDate) {
        payload.claim_date = claimDate;
      }

      const response = await axiosInstance.patch(`/requests/${id}/`, payload);
      
      // Update local state
      setRequests(prev => prev.map(r => r.id === id ? response.data : r));
      
      // Close any open modals
      handleCloseModal();
      handleClosePayment();
      
    } catch (error) {
      console.error(`Error updating request to ${newStatus}:`, error);
      alert("Failed to update request. Please try again.");
    }
  };

  const filteredRequests = requests
    .filter(req => req.request_status?.toLowerCase() === activeTab.toLowerCase())
    .sort((a, b) => {
      // ONLY apply priority sorting for the 'To Pay' tab
      if (activeTab === 'To Pay') {
        // Check if payment_proof_url exists and is not null
        const hasProofA = a.payment_proof_url ? 1 : 0;
        const hasProofB = b.payment_proof_url ? 1 : 0;
        
        // We want hasProof to come FIRST, so we sort descending (b - a)
        return hasProofB - hasProofA; 
      }
      // For other tabs, keep default order (usually by ID or created_at)
      return 0; 
    });

  const pendingRequests = requests.filter(req => req.request_status === 'Pending');
  const topayRequests = requests.filter(req => req.request_status === 'To Pay');
  const confirmedRequests = requests.filter(req => req.request_status === 'Confirmed');
  const forreleaseRequests = requests.filter(req => req.request_status === 'Released');




  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a1f63]"></div>
      </div>
    );
  }

  return (
    <div className='-mt-10 bg-amber-300 -mr-70'>
      <div className="flex min-h-screen bg-[#f8f9fc] w-[177vh] pl-10 pr-10">
        {/* Sidebar controls the activeTab state */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} pendingCount={pendingRequests.length} topayRequests={topayRequests.length} confirmedRequests={confirmedRequests.length} forreleaseRequests={forreleaseRequests.length} />

        <main className="flex-1 p-10 ">
          <header className="flex items-center justify-between mb-10">
            <div className="mt-5">
              <h1 className="text-3xl font-bold text-[#1a1f63] text-left">Document Queue</h1>
              <p className="text-gray-500 mt-1 text-left">Review and process student requests.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 text-gray-400">
                <Search size={20} />
              </div>
              <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 text-gray-400 relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-700">Recent {activeTab} Requests</h3>
              <span className="bg-indigo-50 text-[#1a1f63] px-3 py-1 rounded-full text-xs font-bold">
                {filteredRequests.length} Total
              </span>
            </div>

            {filteredRequests.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                No requests found in {activeTab}.
              </div>
            ) : (
              filteredRequests.map((req) => (
                <div key={req.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow pr-10 ">
                  <div className={`p-3 rounded-xl ${
                      req.request_status === 'Pending' ? 'bg-yellow-50 text-yellow-600 mt-3' : 
                      req.request_status === 'Released' ? 'bg-pink-50 text-pink-600 mt-3' :
                      req.request_status === 'To Pay' ? 'bg-blue-50 text-blue-600 mt-3' :
                      'bg-green-50 text-green-600 mt-3 -mb-2'
                  }`}>
                    {req.request_status === 'Pending' ? <Clock size={24} /> : 
                    req.request_status === 'Released' ? <MailCheck size={24} /> :
                    req.request_status === 'To Pay' ? <CreditCard size={24} /> : 
                      <CheckCircle size={24}/>
                    }
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-left font-bold text-gray-800 text-lg">{ req.request || 'Document Request'}</h3>
                        <p className="text-sm text-gray-400 mt-1 text-left">
                          Requested by: <span className="text-gray-600 font-medium">{req.user_name || 'Student'}</span>
                        </p>
                        <p className="text-xs text-left text-gray-300 mt-1 -mb-1">
                              {req.request_status === 'Confirmed' || req.request_status ==='Released'? (
                                  <>
                                      <span className=" text-gray-400">Student ID: <span className="text-gray-600 font-medium">{req.user}</span> <span className=" text-gray-400 ml-6">Claim Date: <span className = 'text-gray-600 font-medium'>{req.claim_date || 'To be scheduled'}</span></span></span>
          
                                      
                                  </>
                              ) : (
                                  <>
                                      <span className="font-semibold text-gray-400">Date Requested: </span>
                                      {req.created_at || 'Date unknown'}
                                  </>
                              )}
                        </p>
                      </div>

                      <div className="flex gap-2 mt-5">
                        {/* 5. Use handleOpenReview for Pending requests */}
                        {req.request_status === 'Pending' && (

                          <button 
                            onClick={() => handleOpenReview(req)}
                            className="px-10 py-2 text-xs font-bold text-white bg-[#1a1f63] rounded-lg hover:bg-blue-900 transition-colors"
                          >
                            Review
                          </button>

                        )}

                        {/* --- TO PAY BUTTON LOGIC --- */}
                        {req.request_status === 'To Pay' && req.payment_proof_url && (
                          <button 
                            onClick={() => handleOpenPayment(req)}
                            className="px-4 py-2 text-xs font-bold text-white bg-[#1a1f63] rounded-lg hover:bg-blue-900 transition-colors"
                          >
                            View Payment
                          </button>
                        )}
                        {/* NOTE: If req.payment_proof_url is null, NO BUTTON is rendered here. */}

                        {/* --- CONFIRMATION BUTTON --- */}
                        {req.request_status === 'Confirmed' && (
                          <button 
                            onClick={() => handleOpenRelease(req)}
                            className="px-4 py-2 text-xs font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Release
                          </button>
                        )}


                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
        {/* 6. Render the Modal here at the bottom */}
        <RequestModal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          request={selectedRequest}
          onApprove={(req) => handleStatusUpdate(req.id, 'To Pay')}
          onReject={(req) => handleStatusUpdate(req.id, 'Rejected')}
        />

        <PaymentVerificationModal 
          isOpen={isPaymentModalOpen}
          onClose={handleClosePayment}
          request={selectedRequest}
          onConfirmPayment={(id, date) => handleStatusUpdate(id, 'Confirmed', date)} // Passes status AND date
        />

        <ReleaseModal
          isOpen={isReleaseModalOpen}
          onClose={handleCloseRelease}
          request={selectedRequest}
          onConfirm={(req) => handleStatusUpdate(req.id, 'Released')}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
