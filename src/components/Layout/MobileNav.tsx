import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FileText, 
  FolderOpen, 
  Upload, 
  Send, 
  CheckCircle,
  BarChart3,
  ClipboardList,
  Bell
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const MobileNav: React.FC = () => {
  const { user } = useAuth();

  const getNavItems = () => {
    switch (user?.role) {
      case 'police':
        return [
          { to: '/dashboard', icon: FolderOpen, label: 'Dashboard' },
          { to: '/fir-intake', icon: FileText, label: 'FIR' },
          { to: '/cases', icon: ClipboardList, label: 'Cases' },
          { to: '/submit', icon: Send, label: 'Submit' },
          { to: '/notifications', icon: Bell, label: 'Alerts' },
        ];
      case 'sho':
        return [
          { to: '/dashboard', icon: FolderOpen, label: 'Dashboard' },
          { to: '/cases', icon: ClipboardList, label: 'Cases' },
          { to: '/approve', icon: CheckCircle, label: 'Approve' },
          { to: '/analytics', icon: BarChart3, label: 'Analytics' },
          { to: '/notifications', icon: Bell, label: 'Alerts' },
        ];
      case 'court_clerk':
        return [
          { to: '/dashboard', icon: FolderOpen, label: 'Dashboard' },
          { to: '/intake', icon: FileText, label: 'Intake' },
          { to: '/cases', icon: ClipboardList, label: 'Cases' },
          { to: '/receipts', icon: CheckCircle, label: 'Receipts' },
          { to: '/notifications', icon: Bell, label: 'Alerts' },
        ];
      case 'judge':
        return [
          { to: '/dashboard', icon: FolderOpen, label: 'Dashboard' },
          { to: '/cases', icon: ClipboardList, label: 'Cases' },
          { to: '/documents', icon: FileText, label: 'Docs' },
          { to: '/timeline', icon: CheckCircle, label: 'Timeline' },
          { to: '/notifications', icon: Bell, label: 'Alerts' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50">
      <nav className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-lg min-w-0 flex-1 ${
                isActive
                  ? 'text-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`
            }
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default MobileNav;