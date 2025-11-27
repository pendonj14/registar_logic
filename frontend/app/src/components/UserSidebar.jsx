import React, { useContext } from 'react';
import { 
  Clock, 
  CreditCard, 
  CheckCircle, 
  XCircle,
  Plus,
  ChevronsUpDown,
  X,
  LogOut,
  HandCoins,
  Hand
} from 'lucide-react';
import { AuthContext } from '../contexts/AuthContent';

// 1. Updated SidebarItem to match the circular design
const SidebarItem = ({ 
  icon: Icon, 
  label, 
  count, 
  active, 
  onClick
}) => {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
        active 
          ? 'bg-blue-50 text-[#1a1f63]' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon 
          size={20} 
          className={`transition-colors ${
            active ? 'stroke-[#1a1f63]' : 'stroke-gray-500 group-hover:stroke-gray-700'
          }`} 
        />
        <span className="font-semibold text-sm">{label}</span>
      </div>
      
      {/* CIRCULAR BADGE DESIGN */}
      {count > 0 && (
        <span className={`
          flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-all
          ${active 
            ? 'bg-[#1a1f63] text-white shadow-md shadow-indigo-200' // Active: Dark Blue (Like #4 in image)
            : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'   // Inactive: Gray (Like #3 & #5 in image)
          }
        `}>
          {count}
        </span>
      )}
    </button>
  );
};

export const UserSidebar = ({ 
  isOpen, 
  onClose,
  user,
  stats = { pending: 0, toPay: 0, completed: 0, rejected: 0 }, 
  activePage,
  onPageChange,
  onRequestClick
}) => {

  const authContext = useContext(AuthContext);
  const handleLogout = authContext ? authContext.handleLogout : () => console.warn("AuthContext not found");

  return (
    <>
      {/* MOBILE BACKDROP */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* SIDEBAR CONTAINER */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-72 bg-white border-r border-gray-200 flex flex-col font-sans
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 
      `}>
        
        {/* LOGO HEADER */}
        <div className="h-20 flex items-center justify-between px-6">
          <div className="flex items-center gap-0.5 text-2xl font-black tracking-tighter text-[#1a1f63] ml-3">
            <span className="text-yellow-400">i</span>REQUEST
            <span className="text-xs ml-1 bg-yellow-400 text-[#1a1f63] px-1.5 py-0.5 rounded uppercase tracking-widest font-bold">Student</span>
          </div>
          
          <button onClick={onClose} className="md:hidden text-gray-500 hover:text-red-500">
            <X size={24} />
          </button>
        </div>

        {/* PROFILE SECTION */}
        <div className="px-6 mb-2">
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100 group">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 overflow-hidden flex items-center justify-center">
                        <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'User'}`}
                            alt="Profile" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 leading-tight truncate w-32">
                            {user?.full_name || 'Student Name'}
                        </span>
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                            {user?.program || 'Student Account'}
                        </span>
                    </div>
                </div>
                <ChevronsUpDown size={16} className="text-gray-400 group-hover:text-gray-600" />
            </div>
            <div className="h-px w-full bg-gray-100 mt-4 mb-2"></div>
        </div>

        {/* ACTION BUTTON */}
        <div className="px-6 mb-2">
            <button 
                onClick={() => { onRequestClick(); onClose(); }}
                className="w-full flex items-center justify-center gap-2 bg-[#1a1f63] text-white font-bold py-3.5 rounded-xl hover:bg-indigo-900 transition-all shadow-md shadow-indigo-200 active:scale-[0.98]"
            >
                <Plus size={20} />
                <span>Request Document</span>
            </button>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="flex-1 px-4 py-2 space-y-1 overflow-y-auto no-scrollbar">
            
            <div className="px-4 pt-4 pb-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Request Status</p>
            </div>

            {/* Removed badgeColor prop since we now use the active state for coloring */}
            <SidebarItem 
              icon={Clock}
              label="Pending"
              count={stats.pending}
              active={activePage === 'Pending'}
              onClick={() => { onPageChange('Pending'); onClose(); }}
            />

            <SidebarItem 
              icon={CreditCard}
              label="To Pay"
              count={stats.toPay}
              active={activePage === 'To Pay'}
              onClick={() => { onPageChange('To Pay'); onClose(); }}
            />

            <SidebarItem 
              icon={HandCoins}
              label="To Claim"
              count={stats.completed}
              active={activePage === 'Completed'}
              onClick={() => { onPageChange('Completed'); onClose(); }}
            />

            <SidebarItem 
              icon={CheckCircle}
              label="Completed"
              count={stats.rejected}
              active={activePage === 'Rejected'}
              onClick={() => { onPageChange('Rejected'); onClose(); }}
            />

        </div>
        
        {/* LOGOUT BUTTON */}
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all font-medium group"
          >
            <LogOut size={20} className="group-hover:stroke-red-600" />
            <span className="text-sm font-bold">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};