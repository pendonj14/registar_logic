import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Clock, 
  CreditCard, 
  CheckCircle,  
  MailCheck,
  RefreshCw,
  X,
  Menu,
  Trash2 
} from 'lucide-react';
import axiosInstance from '../utils/axios';
import { Sidebar } from '../components/SideBar';
import RequestModal from '../components/RequestModal';
import PaymentVerificationModal from '../components/PaymentVerificationModal';
import useAutoFetchRequests from '../hooks/useAutoFetchRequests';
import StatsModal from '../components/StatsModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'; 
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  
  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    itemId: null,
    isDeleteAll: false
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { requests, loading, setRequests, refresh } = useAutoFetchRequests(1000);

  // --- MODAL HANDLERS ---
  const handleOpenReview = (request) => { 
    setSelectedRequest(request); 
    setIsModalOpen(true); 
  };
  
  const handleCloseModal = () => { 
    setIsModalOpen(false); 
    setSelectedRequest(null); 
  };

  const handleOpenPayment = (request) => { 
    setSelectedRequest(request); 
    setIsPaymentModalOpen(true); 
  };
  
  const handleClosePayment = () => { 
    setIsPaymentModalOpen(false); 
    setSelectedRequest(null); 
  };

  // Reusing RequestModal for Release action
  const handleOpenRelease = (request) => { 
    setSelectedRequest(request); 
    setIsModalOpen(true); 
  };

  const handleStatusUpdate = async (id, newStatus, claimDate = null) => {
    try {
      const payload = { request_status: newStatus };
      if (claimDate) payload.claim_date = claimDate;
      const response = await axiosInstance.patch(`/requests/${id}/`, payload);
      setRequests(prev => prev.map(r => r.id === id ? response.data : r));
      handleCloseModal();
      handleClosePayment();
      toast.success(`Request marked as ${newStatus}`);
    } catch (error) {
      console.error(`Error updating request:`, error);
      toast.error("Failed to update request.");
    }
  };

  // --- DELETE LOGIC ---
  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, itemId: id, isDeleteAll: false });
  };

  const handleDeleteAllClick = () => {
    setDeleteModal({ isOpen: true, itemId: null, isDeleteAll: true });
  };

  const executeDelete = async () => {
    try {
        if (deleteModal.isDeleteAll) {
            // Filter IDs that are currently in the 'Released' view
            const idsToDelete = requests
                .filter(req => req.request_status === 'Released')
                .map(req => req.id);
            
            if (idsToDelete.length === 0) {
                toast.error("No released requests to delete.");
                return;
            }

            await Promise.all(idsToDelete.map(id => axiosInstance.delete(`/requests/${id}/`)));
            toast.success("All released history cleared.");
        } else {
            await axiosInstance.delete(`/requests/${deleteModal.itemId}/`);
            toast.success("Record deleted.");
        }
        refresh(); // Refresh list immediately
    } catch (error) {
        console.error("Delete failed", error);
        toast.error("Failed to delete. Please try again.");
    }
  };

  const filteredRequests = requests
    .filter(req => req.request_status?.toLowerCase() === activeTab.toLowerCase())
    .filter(req => {
        if (!searchQuery) return true;
        const lowerQuery = searchQuery.toLowerCase();
        return (
            req.request?.toLowerCase().includes(lowerQuery) ||
            req.user_name?.toLowerCase().includes(lowerQuery) ||
            String(req.user).toLowerCase().includes(lowerQuery)
        );
    })
    .sort((a, b) => {
      if (activeTab === 'To Pay') {
        return (b.payment_proof_url ? 1 : 0) - (a.payment_proof_url ? 1 : 0); 
      }
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
    <div className="min-h-screen bg-[#f8f9fc]">
      
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        pendingCount={pendingRequests.length} 
        topayRequests={topayRequests.length} 
        confirmedRequests={confirmedRequests.length} 
        forreleaseRequests={forreleaseRequests.length}
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        onOpenStats={() => setIsStatsModalOpen(true)}
      />

      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={executeDelete}
        isDeleteAll={deleteModal.isDeleteAll}
        title={deleteModal.isDeleteAll ? "Clear Released History?" : "Delete Record?"}
        message={deleteModal.isDeleteAll 
            ? "You are about to permanently delete all released requests. This action cannot be undone." 
            : "Are you sure you want to delete this record? This action cannot be undone."
        }
      />

      <main className="flex-1 p-6 md:p-10 md:ml-72 transition-all duration-300">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className=" text-2xl md:text-3xl lg:text-3xl font-bold text-[#1a1f63] text-left">Document Queue</h1>
              <p className="text-gray-500 mt-1  text-sm md:text-base">Review and process student requests.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4 self-end md:self-auto">
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-600 md:hidden "
            >
                <Menu size={24} />
            </button>
            <div 
              className={`flex items-center bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300 ease-in-out ${
                  isSearchExpanded ? 'w-full md:w-64 px-3 py-2' : 'w-10 h-10 justify-center cursor-pointer'
              }`}
              onClick={() => { if (!isSearchExpanded) setIsSearchExpanded(true); }}
            >
              <Search size={20} className={`text-gray-400 ${isSearchExpanded ? 'mr-2' : ''}`} />
              {isSearchExpanded && (
                  <>
                      <input 
                          autoFocus
                          type="text" 
                          placeholder="Search..." 
                          className="bg-transparent border-none outline-none text-sm text-gray-700 w-full placeholder-gray-400"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onBlur={() => { if (!searchQuery) setIsSearchExpanded(false); }}
                      />
                      {searchQuery && (
                          <button onClick={(e) => { e.stopPropagation(); setSearchQuery(''); setIsSearchExpanded(false); }}>
                              <X size={14} className="text-gray-400 hover:text-red-500" />
                          </button>
                      )}
                  </>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-700 text-sm md:text-base">Recent {activeTab} Requests</h3>
            <div className="flex items-center gap-2">
                
                {/* DELETE ALL BUTTON (Only in Released Tab) */}
                {activeTab === 'Released' && filteredRequests.length > 0 && (
                    <button 
                        onClick={handleDeleteAllClick}
                        className="p-2 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        title="Delete All Released"
                    >
                        <Trash2 size={18} />
                    </button>
                )}

                <button 
                    onClick={() => refresh()} 
                    className="p-2 rounded-lg border hover:text-[#1a1f63] transition-colors text-black"
                    title="Refresh Data"
                >
                    <RefreshCw size={18} />
                </button>
                <span className="bg-indigo-50 text-[#1a1f63] px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                    {filteredRequests.length} Total
                </span>
            </div>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              {searchQuery ? `No results found for "${searchQuery}"` : `No requests found in ${activeTab}.`}
            </div>
          ) : (
            filteredRequests.map((req) => (
              <div key={req.id} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-start gap-4 hover:shadow-md transition-shadow group">
                <div className={`p-3 rounded-xl self-start ${
                    req.request_status === 'Pending' ? 'bg-yellow-50 text-yellow-600 mt-3' : 
                    req.request_status === 'Released' ? 'bg-pink-50 text-pink-600 mt-3' :
                    req.request_status === 'To Pay' ? 'bg-blue-50 text-blue-600 mt-3' :
                    'bg-green-50 text-green-600 mt-3'
                }`}>
                  {req.request_status === 'Pending' ? <Clock size={24} /> : 
                  req.request_status === 'Released' ? <MailCheck size={24} /> :
                  req.request_status === 'To Pay' ? <CreditCard size={24} /> : 
                    <CheckCircle size={24}/>
                  }
                </div>

                <div className="flex-1 w-full">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="w-full">
                      <h3 className="text-left font-bold text-gray-800 text-lg">{ req.request || 'Document Request'}</h3>
                      <p className="text-sm text-gray-400 mt-1 text-left">
                        Requested by: <span className="text-gray-600 font-medium">{req.user_name || 'Student'}</span>
                      </p>
                      <div className="text-xs text-left text-gray-300 mt-2">
                            {req.request_status === 'Confirmed' || req.request_status ==='Released'? (
                                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                                    <span className="text-gray-400">Student ID: <span className="text-gray-600 font-medium">{req.user}</span></span>
                                    <span className="text-gray-400">Claim Date: <span className='text-gray-600 font-medium'>{req.claim_date || 'To be scheduled'}</span></span>
                                </div>
                            ) : (
                                <div>
                                    <span className="font-semibold text-gray-400">Date Requested: </span>
                                    {req.created_at || 'Date unknown'}
                                </div>
                            )}
                      </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-5 md:mr-7 sm:mr-7 items-center">
                      {req.request_status === 'Pending' && (
                        <button onClick={() => handleOpenReview(req)} className="flex-1 md:flex-none px-6 py-2 text-xs font-bold text-white bg-yellow-500 rounded-lg hover:bg-yellow-400 transition-colors">
                          Review
                        </button>
                      )}

                      {req.request_status === 'To Pay' && req.payment_proof_url && (
                        <button onClick={() => handleOpenPayment(req)} className="flex-1 md:flex-none px-4 py-2 text-xs font-bold text-white bg-[#1a1f63] rounded-lg hover:bg-blue-900 transition-colors">
                          View Payment
                        </button>
                      )}

                      {req.request_status === 'Confirmed' && (
                        <button onClick={() => handleOpenRelease(req)} className="flex-1 md:flex-none px-4 py-2 text-xs font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                          Review and Release
                        </button>
                      )}

                      {/* INDIVIDUAL DELETE BUTTON (Only in Released Tab) */}
                      {req.request_status === 'Released' && (
                        <button 
                            onClick={() => handleDeleteClick(req.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Record"
                        >
                            <Trash2 size={18} />
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
      
      {/* Modals */}
      <RequestModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        request={selectedRequest} 
        onApprove={(req) => {
            if (req.request_status === 'Pending') {
                handleStatusUpdate(req.id, 'To Pay');
            } else if (req.request_status === 'Confirmed') {
                handleStatusUpdate(req.id, 'Released');
            }
        }} 
        onReject={(req) => handleStatusUpdate(req.id, 'Rejected')} 
        approveLabel={selectedRequest?.request_status === 'Confirmed' ? "Release Document" : "Approve Request"}
        showReject={selectedRequest?.request_status === 'Pending'}
      />

      <PaymentVerificationModal isOpen={isPaymentModalOpen} onClose={handleClosePayment} request={selectedRequest} onConfirmPayment={(id, date) => handleStatusUpdate(id, 'Confirmed', date)} />
      
      <StatsModal 
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        requests={requests}
      />
    </div>
  );
};

export default AdminDashboard;