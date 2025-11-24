import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Clock, 
  CreditCard, 
  CheckCircle, 
  Trash2 
} from 'lucide-react';
import axiosInstance from '../utils/axios';
import { Sidebar } from '../components/SideBar';
import RequestModal from '../components/RequestModal';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Pending');
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

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

  // 4. Handle Approve / Reject Logic
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      // We send ONLY the status update
      const response = await axiosInstance.patch(`/requests/${id}/`, { 
        request_status: newStatus 
      });
      
      // Update local state immediately
      setRequests(prev => prev.map(r => r.id === id ? response.data : r));
      
      handleCloseModal();
      // Optional: Add an alert or toast notification here "Request Approved!"
    } catch (error) {
      console.error(`Error updating request to ${newStatus}:`, error);
      alert("Failed to update request. Please try again.");
    }
  };

  const deleteRequest = async (id) => {
    try {
      await axiosInstance.delete(`/requests/${id}/`);
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const filteredRequests = requests.filter(req => req.request_status === activeTab);
  const pendingRequests = requests.filter(req => req.request_status === 'Pending');
  const topayRequests = requests.filter(req => req.request_status === 'To Pay');
  const confirmedRequests = requests.filter(req => req.request_status === 'Confirmed');
  const forreleaseRequests = requests.filter(req => req.request_status === 'For Release');




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
                      req.request_status === 'To Pay' ? 'bg-blue-50 text-blue-600 mt-3' :
                      'bg-green-50 text-green-600'
                  }`}>
                    {req.request_status === 'Pending' ? <Clock size={24} /> : 
                    req.request_status === 'To Pay' ? <CreditCard size={24} /> : 
                    <CheckCircle size={24} />}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-left font-bold text-gray-800 text-lg">{ req.request || 'Document Request'}</h3>
                        <p className="text-sm text-gray-400 mt-1">
                          Requested by: <span className="text-gray-600 font-medium">{req.user_name || 'Student'}</span>
                        </p>
                        <p className="text-xs text-left text-gray-300 mt-1">{req.created_at || 'Date unknown'}</p>
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

                        {req.request_status === 'To Pay' && (
                          <button 
                            onClick={() => handleStatusUpdate(req.id, 'Confirmed')}                            
                            className="px-4 py-2 text-xs font-bold text-white bg-[#1a1f63] rounded-lg hover:bg-blue-900 transition-colors"
                          >
                            View Payment
                          </button>
                        )}

                        {req.request_status === 'Confirmation' && (
                          <button 
                            onClick={() => handleStatusUpdate(req.id, 'For Release')}
                            className="px-4 py-2 text-xs font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Ready to Release
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
      </div>
    </div>
  );
};

export default AdminDashboard;
