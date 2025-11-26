import React, { useContext } from 'react';
import { 
  FolderOpen, 
  CheckSquare, 
  Settings, 
  Plus,
  ChevronsUpDown,
  X,
  LogOut
} from 'lucide-react';
import { AuthContext } from '../contexts/AuthContent';

export const UserSidebar = ({ 
  isOpen, 
  onClose,
  user,
  stats = { pending: 0, completed: 0 }, 
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
        
        {/* 1. LOGO HEADER (Added back) */}
        <div className="h-20 flex items-center justify-between px-6">
          <div className="flex items-center gap-0.5 text-2xl font-black tracking-tighter text-[#1a1f63] ml-3">
            <span className="text-yellow-400">i</span>REQUEST
            <span className="text-xs ml-1 bg-yellow-400 text-[#1a1f63] px-1.5 py-0.5 rounded uppercase tracking-widest font-bold">Student</span>
          </div>
          
          {/* Mobile Close Button */}
          <button 
            onClick={onClose} 
            className="md:hidden text-gray-500 hover:text-red-500"
          >
            <X size={24} />
          </button>
        </div>

        {/* 2. PROFILE SECTION */}
       <div className="px-6 mb-2">
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 overflow-hidden flex items-center justify-center">
                        {/* Use student_id for the avatar seed so it stays consistent */}
                        <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.student_id || 'User'}`}
                            alt="Profile" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        {/* DISPLAY FULL NAME */}
                        <span className="text-sm font-bold text-gray-900 leading-tight truncate w-32" title={user?.full_name}>
                            {user?.full_name || 'Loading...'}
                        </span>
                        
                        {/* DISPLAY PROGRAM */}
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide truncate w-32">
                            {user?.program || 'Student'}
                        </span>
                    </div>
                </div>
                <ChevronsUpDown size={16} className="text-gray-400" />
            </div>
            
            <div className="h-px w-full bg-gray-100 mt-4 mb-2"></div>
        </div>

        {/* 3. ACTION BUTTON */}
        <div className="px-6 mb-2">
            <button 
                onClick={() => { onRequestClick(); onClose(); }}
                className="w-full flex items-center justify-center gap-2 bg-[#1a1f63] text-white font-bold py-3.5 rounded-xl hover:bg-indigo-900 transition-all shadow-md shadow-indigo-200 active:scale-[0.98]"
            >
                <Plus size={20} />
                <span>Request Document</span>
            </button>
        </div>

        {/* 4. NAVIGATION LINKS */}
        <div className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
            
            {/* My Requests */}
            <button 
                onClick={() => { onPageChange('My Requests'); onClose(); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors group ${
                    activePage === 'My Requests' ? 'bg-blue-50 text-[#1a1f63]' : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
                <div className="flex items-center gap-3">
                    <FolderOpen size={20} className={activePage === 'My Requests' ? 'stroke-[#1a1f63]' : 'stroke-gray-500'} />
                    <span className="font-semibold text-sm">My Requests</span>
                </div>
                {stats.pending > 0 && (
                    <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                        {stats.pending}
                    </span>
                )}
            </button>

            {/* Completed */}
            <button 
                onClick={() => { onPageChange('Completed'); onClose(); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors group ${
                    activePage === 'Completed' ? 'bg-blue-50 text-[#1a1f63]' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
            >
                <div className="flex items-center gap-3">
                    <CheckSquare size={20} className={activePage === 'Completed' ? 'stroke-[#1a1f63]' : 'stroke-gray-400'} />
                    <span className="font-semibold text-sm">Completed</span>
                </div>
                {stats.completed > 0 && (
                    <span className="bg-gray-100 text-gray-400 text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                        {stats.completed}
                    </span>
                )}
            </button>

            {/* OTHERS SECTION */}
            <div className="pt-6 pb-2 px-4">
                <p className="text-xs font-bold text-gray-900">Others</p>
            </div>

            {/* Settings */}
            <button 
                onClick={() => { onPageChange('Settings'); onClose(); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                    activePage === 'Settings' ? 'bg-blue-50 text-[#1a1f63]' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
            >
                <div className="flex items-center gap-3">
                    <Settings size={20} className={activePage === 'Settings' ? 'stroke-[#1a1f63]' : 'stroke-gray-400'} />
                    <span className="font-semibold text-sm">Settings</span>
                </div>
            </button>

        </div>
        
        {/* 5. LOGOUT BUTTON */}
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