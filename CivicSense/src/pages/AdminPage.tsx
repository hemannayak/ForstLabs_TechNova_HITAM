import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  Bell,
  Search,
  MoreVertical,
  CheckCircle,
  Clock,
  Filter,
  Download,
  Shield,
  Map as MapIcon,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

// Sidebar Component
const AdminSidebar = ({ activeTab, setActiveTab, onLogout }: any) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'issues', label: 'Issue Reports', icon: FileText },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 z-50 border-r border-slate-800">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">Admin<span className="text-indigo-400">Portal</span></span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 space-y-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* User & Logout */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center p-3 mb-2 rounded-lg bg-slate-800/50 border border-slate-700">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">AD</div>
          <div className="ml-3">
            <div className="text-sm font-medium text-white">Admin User</div>
            <div className="text-xs text-slate-400">Super Admin</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 p-2 rounded-lg text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

// Dashboard View Component
const DashboardView = ({ issues }: any) => {
  const stats = [
    { label: 'Total Reports', value: issues.length, icon: FileText, change: '+12%', color: 'indigo' },
    { label: 'Pending Review', value: issues.filter((i: any) => i.status === 'pending').length, icon: Clock, change: '+5%', color: 'amber' },
    { label: 'Resolved Issues', value: issues.filter((i: any) => i.status === 'resolved').length, icon: CheckCircle, change: '+18%', color: 'emerald' },
    { label: 'Active Zones', value: '12', icon: MapIcon, change: 'Stable', color: 'blue' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-50`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
            <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View All</button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="relative mt-1">
                  <div className="w-2 h-2 rounded-full bg-slate-300 ring-4 ring-white"></div>
                  {i !== 2 && <div className="absolute top-2 left-1 w-px h-12 bg-slate-200 -z-10"></div>}
                </div>
                <div>
                  <p className="text-sm text-slate-900 font-medium">New report submitted in <span className="font-bold">Gachibowli</span></p>
                  <p className="text-xs text-slate-500 mt-0.5">2 minutes ago • ID #REQ-2024-00{892 + i}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="flex items-center space-x-3">
                <Activity className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-900">API Gateway</span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-white px-2 py-1 rounded">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="flex items-center space-x-3">
                <Activity className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-900">Database</span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-white px-2 py-1 rounded">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="flex items-center space-x-3">
                <Activity className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-900">AI Model</span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-white px-2 py-1 rounded">Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Issues Table View
const IssuesView = ({ issues, updateStatus }: any) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="text-lg font-bold text-slate-900">Incident Reports</h3>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search reports..."
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
            <Filter className="w-4 h-4" />
          </button>
          <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="px-6 py-4">Issue Details</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Severity</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {issues.map((issue: any) => (
              <tr key={issue.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <img src={issue.images.angle1} alt="" className="w-12 h-12 rounded-lg object-cover border border-slate-200 shadow-sm" />
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{issue.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">ID: #{issue.id.slice(0, 8)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-700">Jubilee Hills</div>
                  <div className="text-xs text-slate-500">Zone 4</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ring-1 ring-inset ${issue.severity === 'high' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                    issue.severity === 'moderate' ? 'bg-amber-50 text-amber-700 ring-amber-600/20' :
                      'bg-green-50 text-green-700 ring-green-600/20'
                    }`}>
                    {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={issue.status}
                    onChange={(e) => updateStatus(issue.id, e.target.value)}
                    className={`text-xs font-bold rounded-lg py-1.5 pl-2 pr-8 border-0 ring-1 ring-inset focus:ring-2 focus:ring-indigo-600 bg-transparent cursor-pointer ${issue.status === 'resolved' ? 'text-emerald-700 ring-emerald-600/20 bg-emerald-50' :
                      issue.status === 'in-progress' ? 'text-blue-700 ring-blue-600/20 bg-blue-50' :
                        'text-amber-700 ring-amber-600/20 bg-amber-50'
                      }`}
                  >
                    <option value="pending">Reviewing</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-indigo-600 p-1">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const AdminPage: React.FC = () => {
  const { issues, updateIssueStatus, currentUser, logout } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin-login');
  };

  if (!currentUser?.isAdmin) {
    // Should be handled by ProtectedRoute but double check
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      {/* Main Content Area */}
      <div className="pl-64">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 px-8 flex items-center justify-between w-full">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            {activeTab === 'dashboard' ? 'Overview' :
              activeTab === 'issues' ? 'Incident Reports' :
                activeTab === 'users' ? 'User Database' : 'System Settings'}
          </h2>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center space-x-3">
              <div className="text-right hidden md:block">
                <div className="text-sm font-bold text-slate-900">Admin User</div>
                <div className="text-xs text-slate-500">Hyderabad Municipal Corp</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm border-2 border-white shadow-sm">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'dashboard' && <DashboardView issues={issues} />}
            {activeTab === 'issues' && <IssuesView issues={issues} updateStatus={updateIssueStatus} />}
            {activeTab === 'users' && (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900">User Management</h3>
                <p className="text-slate-500">This module is under development.</p>
              </div>
            )}
            {activeTab === 'settings' && (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
                <Settings className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900">System Settings</h3>
                <p className="text-slate-500">This module is under development.</p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;