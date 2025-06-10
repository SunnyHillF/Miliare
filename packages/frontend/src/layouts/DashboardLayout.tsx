import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  BarChart3,
  BookOpen,
  Share2,
  LogOut,
  Menu,
  X,
  User,
  Users,
  Bell,
  ChevronDown,
  Settings,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { toast } from '../components/ui/Toaster';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    navigate('/login');
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  const navLinks = [
    { to: '/dashboard', icon: <BarChart3 className="h-5 w-5" />, label: 'Your Business' },
    { to: '/dashboard/learn', icon: <BookOpen className="h-5 w-5" />, label: 'Learn' },
    { to: '/dashboard/refer', icon: <Share2 className="h-5 w-5" />, label: 'Refer' },
  ];

  if (user?.groups?.includes('teamLead') || user?.groups?.includes('admin')) {
    navLinks.push({ to: '/dashboard/team', icon: <Users className="h-5 w-5" />, label: 'Team' });
  }

  if (user?.groups?.includes('partnerAdmin') || user?.groups?.includes('admin')) {
    navLinks.push({ to: '/dashboard/company-admin', icon: <Settings className="h-5 w-5" />, label: 'Admin' });
  }

  if (user?.groups?.includes('admin')) {
    navLinks.push({ to: '/dashboard/admin', icon: <Settings className="h-5 w-5" />, label: 'Site Admin' });
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <span className="text-primary font-bold text-xl">Miliare</span>
              </div>
              
              {/* Desktop navigation */}
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `${
                        isActive
                          ? 'border-primary text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`
                    }
                    end={link.to === '/dashboard'}
                  >
                    <span className="mr-2">{link.icon}</span>
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>
            
            <div className="hidden sm:flex sm:items-center sm:ml-6">
              {/* Notifications */}
              <div className="ml-3 relative">
                <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  <Bell className="h-6 w-6" />
                </button>
              </div>
              
              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div>
                  <Button
                    variant="ghost"
                    onClick={toggleProfileMenu}
                    className="flex items-center max-w-xs text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <span className="mr-2">{user?.firstName} {user?.lastName}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                
                {isProfileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                    <button
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        // Navigate to profile page when implemented
                      }}
                    >
                      <User className="inline-block mr-2 h-4 w-4" />
                      Your Profile
                    </button>
                    <button
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        // Navigate to settings page when implemented
                      }}
                    >
                      <Settings className="inline-block mr-2 h-4 w-4" />
                      Settings
                    </button>
                    <button
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      <LogOut className="inline-block mr-2 h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="sm:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `${
                      isActive
                        ? 'bg-primary bg-opacity-10 border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`
                  }
                  onClick={closeMobileMenu}
                  end={link.to === '/dashboard'}
                >
                  <span className="flex items-center">
                    <span className="mr-2">{link.icon}</span>
                    {link.label}
                  </span>
                </NavLink>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                    {user?.firstName?.charAt(0) || 'U'}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user?.firstName} {user?.lastName}</div>
                  <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <button
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  onClick={() => {
                    closeMobileMenu();
                    // Navigate to profile page when implemented
                  }}
                >
                  Your Profile
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  onClick={() => {
                    closeMobileMenu();
                    // Navigate to settings page when implemented
                  }}
                >
                  Settings
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  onClick={() => {
                    closeMobileMenu();
                    handleLogout();
                  }}
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
      
      {/* Main content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Miliare Referral Network. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
