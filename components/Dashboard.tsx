
import React from 'react';
import { Users, Database, ShieldCheck, Zap, TrendingUp, TrendingDown, HardDrive, Search } from 'lucide-react';
import { User, Document } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface DashboardProps {
  user: User;
  documents: Document[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, documents }) => {
  const deptDocs = documents.filter(d => d.department === user.department);
  
  // Queries Activity Mock Data
  const queryData = [
    { name: 'Mon', queries: 40 },
    { name: 'Tue', queries: 30 },
    { name: 'Wed', queries: 65 },
    { name: 'Thu', queries: 45 },
    { name: 'Fri', queries: 90 },
    { name: 'Sat', queries: 20 },
    { name: 'Sun', queries: 15 },
  ];

  // Storage Distribution Mock Data
  const storageData = [
    { name: 'Radiology', value: 400, color: '#0088cc' },
    { name: 'Oncology', value: 300, color: '#8b5cf6' },
    { name: 'Pathology', value: 200, color: '#ec4899' },
    { name: 'Admin', value: 100, color: '#94a3b8' },
  ];

  const stats = [
    { 
      label: 'Indexed Files', 
      value: deptDocs.length, 
      trend: '+2 today', 
      trendUp: true, 
      icon: Database, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      description: 'Files in your department node'
    },
    { 
      label: 'Authorized Users', 
      value: 12, 
      trend: '3 active now', 
      trendUp: true, 
      icon: Users, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50',
      description: 'Departmental staff access'
    },
    { 
      label: 'AI Inferences', 
      value: 1248, 
      trend: '+12%', 
      trendUp: true, 
      icon: Zap, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50',
      description: 'Total tokens processed'
    },
    { 
      label: 'Node Integrity', 
      value: '99.9%', 
      trend: 'Optimal', 
      trendUp: true, 
      icon: ShieldCheck, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      description: 'Encryption & isolation status'
    },
  ];

  const recentActivities = [
    { id: 1, type: 'access', msg: `Dr. Smith accessed ${user.department} records`, time: '4 mins ago', status: 'authorized' },
    { id: 2, type: 'sync', msg: 'Vector database re-indexing complete', time: '12 mins ago', status: 'system' },
    { id: 3, type: 'upload', msg: 'New MRI protocol uploaded by Admin', time: '45 mins ago', status: 'data' },
    { id: 4, type: 'security', msg: 'Private node firewall heartbeat', time: '1 hour ago', status: 'secure' },
    { id: 5, type: 'query', msg: 'Complex RAG inference generated', time: '2 hours ago', status: 'ai' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto h-full">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Dashboard</h2>
          <p className="text-slate-500 font-medium mt-1">
            Welcome back, <span className="text-[#0088cc] font-bold">{user.name}</span>. Your {user.department} node is healthy.
          </p>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
                <stat.icon size={22} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${stat.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {stat.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-tight mb-1">{stat.label}</p>
              <h4 className="text-3xl font-extrabold text-slate-900">{stat.value}</h4>
              <p className="text-[11px] text-slate-400 mt-2 font-medium">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Departmental AI Traffic</h3>
              <p className="text-sm text-slate-400">Queries resolved via RAG pipeline</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={queryData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc', radius: 10}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px'}}
                  itemStyle={{fontWeight: 700, color: '#0088cc'}}
                />
                <Bar dataKey="queries" radius={[8, 8, 8, 8]} barSize={32}>
                  {queryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 4 ? '#0088cc' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Info */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Storage Usage</h3>
          <p className="text-sm text-slate-400 mb-8">Isolated tenant distribution</p>
          
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={storageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {storageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3 mt-4">
            {storageData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: item.color}} />
                  <span className="font-bold text-slate-600">{item.name}</span>
                </div>
                <span className="text-slate-400 font-medium">{item.value} GB</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row - Security Logs Full Width */}
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-blue-500" size={20} />
              <h3 className="font-bold text-slate-800">Access & Security Logs</h3>
            </div>
            <button className="text-xs font-bold text-blue-600 hover:underline">Export Logs</button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentActivities.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    log.status === 'authorized' ? 'bg-emerald-50 text-emerald-500' : 
                    log.status === 'secure' ? 'bg-blue-50 text-blue-500' :
                    log.status === 'ai' ? 'bg-amber-50 text-amber-500' : 'bg-slate-50 text-slate-400'
                  }`}>
                    {log.type === 'access' && <Users size={18} />}
                    {log.type === 'sync' && <Database size={18} />}
                    {log.type === 'upload' && <HardDrive size={18} />}
                    {log.type === 'security' && <ShieldCheck size={18} />}
                    {log.type === 'query' && <Search size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{log.msg}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{log.time}</p>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    log.status === 'authorized' ? 'bg-emerald-100 text-emerald-700' :
                    log.status === 'secure' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
