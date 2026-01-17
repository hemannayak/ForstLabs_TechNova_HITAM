import React, { useState } from 'react';
import {
  FileText,
  Filter,
  Eye,
  Edit,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import PublicVotingCard from '../components/PublicVotingCard';
import clsx from 'clsx';

const ReportsPage: React.FC = () => {
  const { issues, currentUser } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const currentUsername = (currentUser as any)?.displayName || currentUser?.email?.split('@')[0] || 'anonymous';
  const userIssues = issues.filter(issue => issue.reportedBy === currentUsername);

  const filteredIssues = userIssues.filter(issue => {
    const statusMatch = filterStatus === 'all' || issue.status === filterStatus;
    const severityMatch = filterSeverity === 'all' || issue.severity === filterSeverity;
    return statusMatch && severityMatch;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending': return { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-100', label: 'In Review' };
      case 'in-progress': return { icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-100', label: 'In Progress' };
      case 'resolved': return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100', label: 'Resolved' };
      default: return { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-100', label: 'Pending' };
    }
  };

  const resolvedPercentage = userIssues.length > 0
    ? (userIssues.filter(issue => issue.status === 'resolved').length / userIssues.length) * 100
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen bg-gray-50/50">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">My Activity</h1>
          <p className="text-lg text-gray-600">Track your contributions to a better city.</p>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Filter className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-indigo-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all cursor-pointer outline-none appearance-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending">In Review</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="relative group">
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-indigo-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all cursor-pointer outline-none appearance-none"
            >
              <option value="all">All Severities</option>
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: 'Total Reports', value: userIssues.length, icon: FileText, color: 'indigo' },
          { label: 'In Review', value: userIssues.filter(i => i.status === 'pending').length, icon: Clock, color: 'amber' },
          { label: 'In Progress', value: userIssues.filter(i => i.status === 'in-progress').length, icon: AlertCircle, color: 'blue' },
          { label: 'Resolved', value: userIssues.filter(i => i.status === 'resolved').length, icon: CheckCircle, color: 'green' },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-full bg-${stat.color}-50 flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Timeline List */}
      <div className="relative">
        {/* Vertical Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200 hidden md:block"></div>

        <AnimatePresence>
          {filteredIssues.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No reports found</h3>
              <p className="text-gray-500">
                {userIssues.length === 0
                  ? "You haven't submitted any reports yet."
                  : "Try adjusting your filters to see more results."
                }
              </p>
            </motion.div>
          ) : (
            filteredIssues.map((issue, index) => {
              const statusConfig = getStatusConfig(issue.status);
              const StatusIcon = statusConfig.icon;

              return (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-0 md:pl-24 pb-12 group last:pb-0"
                >
                  {/* Timeline Dot */}
                  <div className={`absolute left-8 top-6 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 hidden md:block ${statusConfig.bg.replace('bg-', 'bg-')}`}></div>

                  {/* Date Label (Desktop) */}
                  <div className="absolute left-0 top-6 w-16 text-right text-xs font-semibold text-gray-400 hidden md:block">
                    {new Date(issue.reportedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>

                  {/* Card */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                    <div className="flex flex-col sm:flex-row">
                      {/* Image Preview */}
                      <div className="w-full sm:w-48 h-48 sm:h-auto relative">
                        <img
                          src={issue.images.angle1}
                          alt={issue.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <span className={clsx(
                            "px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md",
                            statusConfig.bg, statusConfig.color
                          )}>
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{issue.title}</h3>
                          <div className="flex items-center space-x-1 text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(issue.reportedAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{issue.description || 'No description provided.'}</p>

                        {/* AI Stats Chips */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold">
                            AI Verified {(issue.aiPrediction.confidence * 100).toFixed(0)}%
                          </div>
                          <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium capitalize">
                            {issue.type}
                          </div>
                          <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                            Risk: {issue.aiPrediction.damageRiskScore.toFixed(1)}/10
                          </div>
                        </div>

                        {/* Actions & Voting */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                          <div className="flex items-center gap-4">
                            {issue.publicVoting.enabled ? (
                              <div className="flex items-center space-x-3 text-sm font-medium">
                                <span className="flex items-center text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                                  <ThumbsUp className="w-3 h-3 mr-1" /> {issue.publicVoting.yesVotes}
                                </span>
                                <span className="flex items-center text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                                  <ThumbsDown className="w-3 h-3 mr-1" /> {issue.publicVoting.noVotes}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400 font-medium flex items-center">
                                <Clock className="w-3 h-3 mr-1" /> Awaiting Approval
                              </span>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            {/* Only show edit/delete for non-resolved items typically, keeping simple for now */}
                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReportsPage;