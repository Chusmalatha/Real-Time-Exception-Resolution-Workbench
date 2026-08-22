import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListTodo, CheckCircle, Bot, ActivitySquare, Settings, X } from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/exceptions', label: 'Transactions', icon: ListTodo },
    { path: '/audit-log', label: 'Audit Log', icon: ActivitySquare },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/80 z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col min-h-screen transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800 shrink-0">
          <h1 className="text-lg font-bold truncate">Exception Workbench</h1>
          <button 
            className="md:hidden text-gray-400 hover:text-white p-1"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            let isActive = location.pathname === item.path;
            
            if (item.path === '/exceptions' && location.pathname.startsWith('/exceptions')) {
              isActive = true;
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive 
                    ? 'bg-gray-800 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
