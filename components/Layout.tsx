
import React from 'react';
import { Shield, LayoutDashboard, FileText, MessageSquare, LogOut, Activity } from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  activeTab: 'chat' | 'docs' | 'dashboard';
  setActiveTab: (tab: 'chat' | 'docs' | 'dashboard') => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, activeTab, setActiveTab, children }) => {
  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="bg-[#0088cc] p-1.5 rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900 leading-tight">ClinIQ Vault</h1>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">Secure Healthcare Node</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-6">
          <div className="mb-8">
            <p className="px-4 text-[10px] font-bold text-blue-500/60 uppercase tracking-widest mb-3">Department</p>
            <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100/50">
              <Activity className="w-5 h-5" />
              <span className="font-bold">{user.department}</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-5 h-5 opacity-70" />
              <span className="text-sm">Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'docs' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-5 h-5 opacity-70" />
              <span className="text-sm">Documents</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'chat' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <MessageSquare className="w-5 h-5 opacity-70" />
              <span className="text-sm">AI Assistant</span>
            </button>
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-slate-50 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
              <p className="text-[10px] font-medium text-slate-400">Chief {user.department}ist</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-4 h-4 rotate-180" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default Layout;
