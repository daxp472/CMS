import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'police' | 'sho' | 'court_clerk' | 'judge'>('police');
  const [name, setName] = useState('');
  const [badge, setBadge] = useState('');
  const [station, setStation] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { value: 'police', label: 'Police Officer', description: 'Handle FIR intake and case management' },
    { value: 'sho', label: 'Senior Officer (SHO)', description: 'Review and approve cases before court submission' },
    { value: 'court_clerk', label: 'Court Clerk', description: 'Manage incoming cases and generate receipts' },
    { value: 'judge', label: 'Judge', description: 'View-only access to cases and documents' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    login(selectedRole, name, badge || undefined, station || undefined);
    toast.success('Login successful!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Shield className="h-12 w-12 text-blue-400" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Police → Court Digital Platform
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Select your role to access the system
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-900 py-8 px-4 shadow border border-gray-800 sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-300">
                Role
              </label>
              <div className="mt-2 space-y-3">
                {roles.map((role) => (
                  <div key={role.value} className="relative">
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value={role.value}
                        checked={selectedRole === role.value}
                        onChange={(e) => setSelectedRole(e.target.value as any)}
                        className="mt-1 h-4 w-4 text-blue-600 border-gray-600 bg-gray-800 focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-white">{role.label}</div>
                        <div className="text-xs text-gray-400">{role.description}</div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md placeholder-gray-400 bg-gray-800 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {(selectedRole === 'police' || selectedRole === 'sho') && (
              <>
                <div>
                  <label htmlFor="badge" className="block text-sm font-medium text-gray-300">
                    Badge Number (Optional)
                  </label>
                  <div className="mt-1">
                    <input
                      id="badge"
                      name="badge"
                      type="text"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md placeholder-gray-400 bg-gray-800 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Badge number"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="station" className="block text-sm font-medium text-gray-300">
                    Police Station (Optional)
                  </label>
                  <div className="mt-1">
                    <input
                      id="station"
                      name="station"
                      type="text"
                      value={station}
                      onChange={(e) => setStation(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md placeholder-gray-400 bg-gray-800 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Police station name"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900"
              >
                Login to Dashboard
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-gray-700 pt-6">
            <div className="text-xs text-gray-400">
              <p className="font-medium text-gray-300 mb-2">Demo Platform Features:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-500">
                <li>Complete FIR-to-Court workflow tracking</li>
                <li>Document management with OCR placeholder</li>
                <li>Role-based access and approvals</li>
                <li>Digital receipts and audit trails</li>
                <li>Analytics and compliance monitoring</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;