import React from 'react';
import { Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'police': return 'Police Officer';
      case 'sho': return 'Senior Officer';
      case 'court_clerk': return 'Court Clerk';
      case 'judge': return 'Judge';
      default: return role;
    }
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 lg:pl-64">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={onMenuToggle}
            className="lg:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-white text-xl font-semibold ml-4 lg:ml-0">
            {getRoleDisplayName(user?.role || '')} Dashboard
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-gray-300">
            <User className="h-5 w-5 mr-2" />
            <div className="text-sm">
              <div className="font-medium">{user?.name}</div>
              <div className="text-gray-400">{user?.station}</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;