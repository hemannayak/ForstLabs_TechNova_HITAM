import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, MapPin, Clock, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { mockAreaStats } from '../data/mockData';

const AnalyticsPage: React.FC = () => {
  const { issues } = useApp();
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  // Prepare data for charts with better colors
  const issuesByType = [
    { name: 'Pothole', count: issues.filter(i => i.type === 'pothole').length, color: '#6366f1' }, // Indigo
    { name: 'Crack', count: issues.filter(i => i.type === 'crack').length, color: '#f59e0b' }, // Amber
    { name: 'Waterlog', count: issues.filter(i => i.type === 'waterlogging').length, color: '#3b82f6' }, // Blue
    { name: 'Other', count: issues.filter(i => i.type === 'other').length, color: '#8b5cf6' } // Purple
  ];

  const issuesBySeverity = [
    { name: 'High', count: issues.filter(i => i.severity === 'high').length, color: '#ef4444' },
    { name: 'Moderate', count: issues.filter(i => i.severity === 'moderate').length, color: '#f59e0b' },
    { name: 'Low', count: issues.filter(i => i.severity === 'low').length, color: '#10b981' }
  ];

  // Mock weekly trend data
  const weeklyTrend = [
    { day: 'Mon', reports: 12, resolved: 8 },
    { day: 'Tue', reports: 19, resolved: 12 },
    { day: 'Wed', reports: 8, resolved: 15 },
    { day: 'Thu', reports: 15, resolved: 10 },
    { day: 'Fri', reports: 22, resolved: 18 },
    { day: 'Sat', reports: 16, resolved: 14 },
    { day: 'Sun', reports: 10, resolved: 12 }
  ];

  // Real-time calculations
  const totalIssues = issues.length;
  const resolvedIssues = issues.filter(i => i.status === 'resolved').length;

  const resolutionRate = totalIssues > 0 ? (resolvedIssues / totalIssues * 100).toFixed(1) : '0';
  const avgSeverity = issues.length > 0
    ? (issues.reduce((sum, issue) => sum + issue.severityScore, 0) / issues.length).toFixed(1)
    : '0';

  // Calculate average resolution time
  const resolvedIssuesWithTime = issues.filter(i => i.status === 'resolved' && i.resolvedAt && i.reportedAt);
  const avgResolutionTime = resolvedIssuesWithTime.length > 0
    ? (resolvedIssuesWithTime.reduce((sum, issue) => {
      const reported = new Date(issue.reportedAt).getTime();
      const resolved = new Date(issue.resolvedAt!).getTime();
      return sum + (resolved - reported) / (1000 * 60 * 60 * 24);
    }, 0) / resolvedIssuesWithTime.length).toFixed(1)
    : '2.4'; // Fallback mock value for demo

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-xl">
          <p className="font-semibold text-gray-900 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-end mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center space-x-3 tracking-tight">
            City Pulse
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Real-time analytics and civic health monitoring.
          </p>
        </div>

        <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
          {['7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setSelectedTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedTimeRange === range
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              Last {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Reports', value: totalIssues, sub: '+12% from last week', icon: Activity, color: 'indigo' },
          { label: 'Resolution Rate', value: `${resolutionRate}%`, sub: '+5.2% improvement', icon: TrendingUp, color: 'green' },
          { label: 'Avg Severity', value: `${avgSeverity}/10`, sub: 'Stable metrics', icon: MapPin, color: 'amber' },
          { label: 'Avg Response', value: `${avgResolutionTime} days`, sub: '-0.5 days faster', icon: Clock, color: 'blue' },
        ].map((metric, idx) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${metric.color}-50 text-${metric.color}-600`}>
                <metric.icon className="w-6 h-6" />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${metric.sub.includes('+') && metric.label !== 'Avg Response' ? 'bg-green-100 text-green-700' :
                  metric.sub.includes('-') && metric.label === 'Avg Response' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-600'
                }`}>
                {metric.sub}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{metric.label}</h3>
            <p className="text-3xl font-bold text-gray-900 tracking-tight">{metric.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Main Trend Chart (Spans 2 cols) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-900">Weekly Report Trends</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>New</span>
              <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>Resolved</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrend}>
                <defs>
                  <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="reports" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorReports)" />
                <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Breakdown Donut */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-2">Issue Types</h3>
          <p className="text-sm text-gray-500 mb-8">Distribution of reported problems</p>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={issuesByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {issuesByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-gray-900">{totalIssues}</span>
              <span className="text-xs text-gray-500 uppercase tracking-widest">Total</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {issuesByType.map((type) => (
              <div key={type.name} className="flex items-center text-sm">
                <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: type.color }}></div>
                <span className="text-gray-600 flex-1">{type.name}</span>
                <span className="font-semibold text-gray-900">{type.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Severity Bars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Severity Distribution</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={issuesBySeverity} layout="vertical" barSize={20}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 13, fontWeight: 500 }} width={80} />
                <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {issuesBySeverity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Detailed Table (Simplified for UI) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Regional Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">Area</th>
                  <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">Issues</th>
                  <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">Resolved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mockAreaStats.slice(0, 5).map((area) => (
                  <tr key={area.area} className="group">
                    <td className="py-4 text-sm font-medium text-gray-900">{area.area}</td>
                    <td className="py-4 text-right text-sm text-gray-600">{area.total}</td>
                    <td className="py-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                        {area.resolvedPercentage.toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;