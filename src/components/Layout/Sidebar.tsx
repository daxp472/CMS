import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FileText, 
  FolderOpen, 
  Upload, 
  Send, 
  CheckCircle, 
  Users, 
  BarChart3, 
  Shield,
  ClipboardList,
  Bell,
  Search,
  Clock,
  Gavel,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const getNavItems = () => {
    switch (user?.role) {
      case 'police':
        return [
          { to: '/dashboard', icon: FolderOpen, label: 'Dashboard' },
          { to: '/fir-intake', icon: FileText, label: 'FIR Intake' },
          { to: '/cases', icon: ClipboardList, label: 'My Cases' },
          { to: '/documents', icon: Upload, label: 'Documents' },
          { to: '/evidence', icon: Shield, label: 'Evidence' },
        ];
      case 'sho':
        return [
          { to: '/dashboard', icon: FolderOpen, label: 'Dashboard' },
          { to: '/cases', icon: ClipboardList, label: 'All Cases' },
          { to: '/documents', icon: FileText, label: 'Documents' },
          { to: '/approve', icon: CheckCircle, label: 'Approvals' },
          { to: '/assign', icon: Users, label: 'Assign Cases' },
          { to: '/analytics', icon: BarChart3, label: 'Analytics' },
        ];
      case 'court_clerk':
        return [
          { to: '/dashboard', icon: FolderOpen, label: 'Dashboard' },
          { to: '/cases', icon: ClipboardList, label: 'Incoming Cases' },
          { to: '/receipts', icon: CheckCircle, label: 'Receipts' },
          { to: '/generate', icon: FileText, label: 'Generate Receipt' },
          { to: '/analytics', icon: BarChart3, label: 'Analytics' },
        ];
      case 'judge':
        return [
          { to: '/dashboard', icon: FolderOpen, label: 'Dashboard' },
          { to: '/cases', icon: ClipboardList, label: 'Cases' },
          { to: '/documents', icon: FileText, label: 'Documents' },
          { to: '/timeline', icon: Clock, label: 'Timeline' },
          { to: '/judgments', icon: Gavel, label: 'Judgments' },
        ];
      default:
        return [];
    }
  };

  const commonItems = [
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
    { to: '/audit', icon: Shield, label: 'Audit Trail' },
  ];

  const navItems = getNavItems();

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-gray-900 border-r border-gray-800">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <Shield className="h-8 w-8 text-blue-400" />
          <span className="ml-2 text-white font-bold text-lg">PoliceFlow</span>
        </div>
        
        <div className="mt-8 flex-1 flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <item.icon className="mr-3 flex-shrink-0 h-5 w-5" />
                {item.label}
              </NavLink>
            ))}
            
            <div className="mt-8 pt-4 border-t border-gray-700">
              {commonItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="mr-3 flex-shrink-0 h-5 w-5" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;