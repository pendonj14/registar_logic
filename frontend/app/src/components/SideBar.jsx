import { 
  Menu, 
  Plus, 
  ChevronsUpDown,
  Search,
  Bell,
  Clock,       
  CreditCard,  
  CheckCircle, 
  Send,        
  LogOut,
  Icon       
} from 'lucide-react';
import { NavItem } from './NavItem';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContent';


export const Sidebar = ({ activeTab, onTabChange, pendingCount, topayRequests , confirmedRequests, forreleaseRequests}) => {

    const { handleLogout } = useContext(AuthContext);
    

    const onLogoutClick = async () => {
        try {
        // Optional: call your backend logout endpoint if needed
        // await axiosInstance.post('/api/logout/'); 
        } catch (err) {
        console.error('Backend logout failed', err);
        } finally {
        handleLogout(); // clear local storage & auth state
        }
    };
        
    return (
        <aside className="w-72 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50 font-sans">
        {/* Header / Logo Area */}
        <div className="h-20 flex items-center justify-between px-6">
            <div className="flex items-center gap-0.5 text-2xl font-black tracking-tighter text-[#1a1f63]">
            <span className="text-yellow-400">i</span>REQUEST
            <span className="text-xs ml-1 bg-[#1a1f63] text-white px-1.5 py-0.5 rounded uppercase tracking-widest font-normal opacity-80">Admin</span>
            </div>
            <button className="p-2 rounded-lg text-gray-300 hover:bg-gray-50 hover:text-gray-500 transition-colors">
            <Menu size={20} />
            </button>
        </div>

        {/* Admin Profile Section */}
        <div className="px-6 mb-2">
            <div className="flex items-center justify-between py-3 px-1 -mx-1 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=AdminUser&backgroundColor=e0e7ff" 
                    alt="Admin" 
                    className="w-full h-full object-cover"
                />
                </div>
                <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900 leading-tight">Admin Officer</span>
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Registrar Office</span>
                </div>
            </div>
            <ChevronsUpDown size={16} className="text-[#1a1f63] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            {/* Divider Line */}
            <div className="h-px w-full bg-gray-100 mt-4 mb-6"></div>
        </div>


        {/* Navigation Links */}
        <div className="flex-1 px-4 space-y-1 overflow-y-auto">
            <NavItem 
            icon={Clock} 
            label="Pending" 
            badge={pendingCount} 
            active={activeTab === 'Pending'}
            onClick={() => onTabChange('Pending')}
            />
            <NavItem 
            icon={CreditCard} 
            label="To Pay" 
            badge={topayRequests}
            active={activeTab === 'To Pay'}
            onClick={() => onTabChange('To Pay')}
            />
            <NavItem 
            icon={CheckCircle} 
            label= "Confirmed"
            badge={confirmedRequests}
            active={activeTab === 'Confirmed'}
            onClick={() => onTabChange('Confirmed')}
            />
            <NavItem 
            icon={Send} 
            label= "Released"
            badge={forreleaseRequests} 
            active={activeTab === 'Released'}
            onClick={() => onTabChange('Released')}
            />
        </div>
        
        {/* Logout Button */}
        <div className="p-4 border-t border-gray-100">
            <button onClick={onLogoutClick} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all font-medium group">
            <LogOut size={22} className="group-hover:stroke-red-600" />
            <span>Log Out</span>
            </button>
        </div>
        </aside>
    );
    };