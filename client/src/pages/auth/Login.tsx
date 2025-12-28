import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { UserRole } from '../../types/api.types';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigateToRoleDashboard(user.role);
    }
  }, [isAuthenticated, user]);

  const navigateToRoleDashboard = (role: UserRole) => {
    switch (role) {
      case UserRole.POLICE:
        navigate('/police/dashboard');
        break;
      case UserRole.SHO:
        navigate('/sho/dashboard');
        break;
      case UserRole.COURT_CLERK:
        navigate('/court/dashboard');
        break;
      case UserRole.JUDGE:
        navigate('/judge/dashboard');
        break;
      default:
        navigate('/login');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      // Navigation handled in useEffect when user state updates
    } catch (error) {
      // Error handling is done in AuthContext with toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-700">
            ⚖️ NyayaSankalan
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Police-Court Case Management System
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-xl sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          {/* Test Credentials */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500 font-medium">
                  Test Accounts
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="font-semibold text-blue-700">👮 Police Officer</p>
                <p className="text-gray-600 mt-1">officer1@police.gov</p>
                <p className="text-gray-500">password123</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="font-semibold text-green-700">🏢 SHO</p>
                <p className="text-gray-600 mt-1">sho.central@police.gov</p>
                <p className="text-gray-500">password123</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="font-semibold text-purple-700">📋 Court Clerk</p>
                <p className="text-gray-600 mt-1">clerk@court.gov</p>
                <p className="text-gray-500">password123</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="font-semibold text-orange-700">⚖️ Judge</p>
                <p className="text-gray-600 mt-1">judge@court.gov</p>
                <p className="text-gray-500">password123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
