import { 
  Search, 
  Bell, 
  Clock, 
  CreditCard, 
  CheckCircle, 
  Trash2, 
  Menu, 
  Plus, 
  ChevronsUpDown, 
  Send, 
  LogOut,
} from 'lucide-react'

export const NavItem = ({ icon: Icon, label, badge, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`
      w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
      ${active 
        ? 'text-[#1a1f63] bg-blue-50 font-bold' 
        : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600 font-medium'
      }
    `}
  >
    <div className="flex items-center gap-3">
      <Icon size={22} strokeWidth={active ? 2.5 : 2} />
      <span>{label}</span>
    </div>

    {badge > 0 && (
      <span
        className={`
          flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 text-xs rounded-full
          ${active ? 'bg-[#1a1f63] text-white' : 'bg-gray-200 text-gray-600'}
        `}
      >
        {badge}
      </span>
    )}
  </button>
);
