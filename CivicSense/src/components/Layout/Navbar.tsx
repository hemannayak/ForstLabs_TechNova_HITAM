import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Camera,
  Map,
  FileText,
  Trophy,
  BarChart3,
  Shield,
  LogOut,
  User,
  Edit3,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showEditUsername, setShowEditUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const location = useLocation();
  const { currentUser, isAuthenticated, logout, isBackendConnected } = useApp();
  const { logout: authLogout, updateUsername } = useAuth();

  const navigation = [
    { name: 'Live Map', href: '/map', icon: Map },
    { name: 'My Reports', href: '/reports', icon: FileText },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'About', href: '/about', icon: Users },
  ];

  // Add Profile link for authenticated users
  if (isAuthenticated && currentUser) {
    // We handle Profile in the right menu now, skipping here to avoid duplication in center
  }

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    authLogout();
    logout();
    setShowUserMenu(false);
  };

  const handleEditUsername = async () => {
    if (newUsername.trim().length >= 3) {
      try {
        await updateUsername(newUsername.trim());
        setShowEditUsername(false);
        setNewUsername('');
        setShowUserMenu(false);
      } catch (error) {
        console.error('Failed to update username:', error);
      }
    }
  };

  // Filter navigation based on auth state
  const filteredNavigation = isAuthenticated
    ? navigation
    : navigation.filter(item => ['About', 'Leaderboard', 'Live Map'].includes(item.name));

  // Scroll effect for navbar
  const [scrolled, setScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/90 backdrop-blur-md shadow-md py-2'
        : 'bg-white py-3 border-b border-indigo-50'
        }`}
    >
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center relative">

          {/* LEFT: Logo Section */}
          <div className="flex items-center flex-none w-[200px]">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-100 rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
                <img
                  src="/logo.png"
                  alt="CivicSense"
                  className="w-10 h-10 relative z-10 rounded-xl object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-2xl font-extrabold text-indigo-900 tracking-tight ml-2 group-hover:text-indigo-600 transition-colors">
                Civic<span className="text-indigo-600">Sense</span>
              </span>
            </Link>
          </div>

          {/* CENTER: Navigation & Report Button */}
          <div className="hidden lg:flex items-center justify-center space-x-8 flex-1 px-8">
            <div className="flex items-center space-x-8 bg-slate-50/50 px-6 py-2 rounded-full border border-slate-100">
              {filteredNavigation.map((item) => {
                const isActiveLink = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`relative group flex items-center space-x-2 text-sm font-bold transition-colors duration-200 whitespace-nowrap ${isActiveLink ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                    {isActiveLink && (
                      <span className="absolute -bottom-2.5 left-0 w-full h-0.5 bg-indigo-600 rounded-full"></span>
                    )}
                  </Link>
                );
              })}

              <div className="w-px h-5 bg-slate-200 mx-2"></div>

              {/* Report Button Integrated in Center */}
              <Link
                to="/report"
                className="flex items-center space-x-2 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-1.5 rounded-full transition-colors whitespace-nowrap"
              >
                <Camera className="w-4 h-4 flex-none" />
                <span>Report Issue</span>
              </Link>
            </div>
          </div>

          {/* RIGHT: Admin & Profile */}
          <div className="hidden lg:flex items-center justify-end space-x-3 flex-none w-[240px]">
            {/* Admin Link/Button */}
            <Link
              to={currentUser?.isAdmin ? "/admin" : "/admin-login"}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-bold transition-all ${isActive('/admin') || isActive('/admin-login')
                ? 'text-slate-900 bg-slate-100'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </Link>

            {/* Profile/Login */}
            {isAuthenticated && currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 pl-1 pr-1 py-1 rounded-full border border-slate-200 hover:border-indigo-300 transition-all duration-200 group bg-white"
                >
                  <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-sm group-hover:scale-105 transition-transform">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden xl:block text-left px-2 max-w-[100px]">
                    <p className="text-xs font-bold text-slate-800 truncate">{currentUser.username}</p>
                    <p className="text-[10px] text-slate-500 leading-none truncate">User</p>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl py-2 z-50 overflow-hidden ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Account</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{currentUser.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-6 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setShowEditUsername(true);
                        setNewUsername(currentUser.username);
                      }}
                      className="flex w-full items-center px-6 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                    >
                      <Edit3 className="w-4 h-4 mr-3" />
                      Edit Username
                    </button>
                    <div className="h-px bg-slate-100 my-2 mx-6"></div>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-6 py-3 text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-slate-900 text-white px-5 py-2 rounded-full font-bold text-sm shadow-md hover:bg-slate-800 hover:shadow-lg transition-all"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute w-full bg-white border-b border-indigo-100 shadow-2xl animate-in slide-in-from-top-2 z-40">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-4 px-4 py-4 rounded-2xl transition-all ${isActive(item.href)
                    ? 'bg-indigo-50 text-indigo-600 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Mobile Report Button */}
            <Link
              to="/report"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-4 px-4 py-4 rounded-2xl bg-indigo-50 text-indigo-700 font-bold border border-indigo-100"
            >
              <Camera className="w-5 h-5" />
              <span>Report Issue</span>
            </Link>

            {isAuthenticated && currentUser ? (
              <div className="border-t border-slate-100 pt-4 mt-4">
                <div className="flex items-center px-4 py-3 space-x-3 mb-2">
                  <div className="w-10 h-10 bg-indigo-900 text-white rounded-full flex items-center justify-center font-bold shadow-md">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{currentUser.username}</div>
                    <div className="text-slate-500 text-xs">{currentUser.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="flex w-full items-center space-x-4 px-4 py-4 rounded-2xl text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="pt-4 mt-2 grid grid-cols-2 gap-4">
                <Link
                  to="/admin-login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-full px-4 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Admin
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-full bg-indigo-600 text-white px-4 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-600/20"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Username Modal */}
      {showEditUsername && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl scale-100 animate-in fade-in zoom-in-95">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Edit3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Edit Username</h3>
            </div>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium text-lg"
              placeholder="Enter new username"
              autoFocus
            />
            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => {
                  setShowEditUsername(false);
                  setNewUsername('');
                }}
                className="px-6 py-3 text-slate-500 hover:text-slate-800 font-bold hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditUsername}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all active:scale-95"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;