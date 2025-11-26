import { useState, useEffect } from 'react'
import axiosInstance from '../utils/axios'
import { jwtDecode } from "jwt-decode"; 
import { Menu } from 'lucide-react';
import { UserSidebar } from '../components/UserSidebar';
import RequestDocumentModal from '../components/RequestDocumentModal';

function UserDashboard() {
  // State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [activePage, setActivePage] = useState('My Requests');
  const [user, setUser] = useState({ username: '', program: '' });
  
  // Data State
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch User Info & Requests on Load
  const fetchUserData = async () => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (token) {
        try {
            const decoded = jwtDecode(token);
            setUser({ 
                username: decoded.username || decoded.user_id,
                program: decoded.program || 'Student' // Assuming token might have program, else default
            });
        } catch (error) {
            console.error("Invalid token", error);
        }
    }
    
    // Fetch Requests
    try {
        setLoading(true);
        const response = await axiosInstance.get('requests/'); // Assuming this endpoint returns user's requests
        setMyRequests(response.data);
    } catch (error) {
        console.error("Error fetching requests:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Filter requests for badges and view
  const pendingRequests = myRequests.filter(req => req.request_status !== 'Released');
  const completedRequests = myRequests.filter(req => req.request_status === 'Released');

  const displayedRequests = activePage === 'My Requests' ? pendingRequests : completedRequests;

  return (
    <div className="fixed inset-0 bg-[#f8f9fc] overflow-y-auto">
      
      {/* SIDEBAR */}
      <UserSidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={user}
        activePage={activePage}
        onPageChange={setActivePage}
        onRequestClick={() => setIsRequestModalOpen(true)}
        stats={{
            pending: pendingRequests.length,
            completed: completedRequests.length
        }}
      />

      {/* REQUEST MODAL */}
      <RequestDocumentModal 
        isOpen={isRequestModalOpen} 
        onClose={() => setIsRequestModalOpen(false)}
        onSuccess={fetchUserData} // Refresh list after successful submission
      />

      {/* MAIN CONTENT */}
      <main className="relative p-6 md:p-10 md:ml-72 transition-all duration-300 min-h-full">
        
        {/* HEADER */}
        <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-600 md:hidden hover:bg-gray-50"
                >
                    <Menu size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-[#1a1f63]">{activePage}</h1>
                    <p className="text-gray-500 text-sm">Manage your document requests.</p>
                </div>
            </div>
        </header>

        {/* CONTENT AREA (List of Requests) */}
        <div className="space-y-4">
            {loading ? (
                <div className="text-center py-10 text-gray-400">Loading requests...</div>
            ) : displayedRequests.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-400 mb-2">No requests found in {activePage}.</p>
                    {activePage === 'My Requests' && (
                        <button 
                            onClick={() => setIsRequestModalOpen(true)}
                            className="text-[#1a1f63] font-bold hover:underline"
                        >
                            Create a new request
                        </button>
                    )}
                </div>
            ) : (
                displayedRequests.map((req) => (
                    <div key={req.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg">{req.request}</h3>
                            <p className="text-sm text-gray-500 mt-1">Requested on: {req.created_at || 'Just now'}</p>
                            {req.claim_date && (
                                <p className="text-xs text-green-600 font-bold mt-2 bg-green-50 px-2 py-1 rounded-md inline-block">
                                    Claim Date: {req.claim_date}
                                </p>
                            )}
                        </div>
                        <span className={`px-4 py-2 rounded-full text-xs font-bold capitalize ${
                            req.request_status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            req.request_status === 'Released' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-600'
                        }`}>
                            {req.request_status}
                        </span>
                    </div>
                ))
            )}
        </div>

      </main>
    </div>
  )
}

export default UserDashboard