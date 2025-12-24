
import React, { useState, useEffect } from 'react';
import { User, Department, Document, ChatSession } from './types';
import Layout from './components/Layout';
import ChatInterface from './components/ChatInterface';
import KnowledgeBase from './components/KnowledgeBase';
import Dashboard from './components/Dashboard';
import { Shield, Lock, User as UserIcon, Radiation, Stethoscope, Microscope, CheckCircle2, AlertCircle } from 'lucide-react';

// Simplified Department-specific passwords (Shared Keys)
const DEPT_PASSWORDS: Record<string, string> = {
  [Department.RADIOLOGY]: 'rad123',
  [Department.ONCOLOGY]: 'onc123',
  [Department.PATHOLOGY]: 'pat123'
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'docs' | 'dashboard'>('dashboard');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  // Persistence logic
  useEffect(() => {
    const savedDocs = localStorage.getItem('cliniq_vault_docs');
    const savedSessions = localStorage.getItem('cliniq_vault_chats');
    
    if (savedDocs) {
      setDocuments(JSON.parse(savedDocs));
    } else {
      const seed: Document[] = [
        { id: 'uuid-rad-001', name: 'MRI_Protocol_v2.pdf', content: 'MRI Safety guidelines and scanning protocols for high-field magnets. Ensure patient is screened for metal implants.', department: Department.RADIOLOGY, uploadedBy: 'System', uploadedAt: '2023-10-24', size: '2.4 MB' },
        { id: 'uuid-rad-002', name: 'Patient_Safety_Guidelines.pdf', content: 'Standard patient safety procedures in diagnostic imaging environment. Focus on sedation and monitoring.', department: Department.RADIOLOGY, uploadedBy: 'System', uploadedAt: '2023-10-25', size: '1.1 MB' },
      ];
      setDocuments(seed);
    }

    if (savedSessions) {
      setChatSessions(JSON.parse(savedSessions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cliniq_vault_docs', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('cliniq_vault_chats', JSON.stringify(chatSessions));
  }, [chatSessions]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!selectedDept) {
      setLoginError("Please select a department node.");
      return;
    }
    
    // Validate Department-Specific Password
    const correctPassword = DEPT_PASSWORDS[selectedDept as string];
    if (password !== correctPassword) {
      setLoginError(`Invalid access key for ${selectedDept} department.`);
      return;
    }

    setIsLoggingIn(true);
    const displayName = username.trim() || "Healthcare Professional";

    setTimeout(() => {
      setUser({
        id: 'user-1',
        name: displayName,
        role: 'Doctor',
        department: selectedDept
      });
      setIsLoggingIn(false);
    }, 800);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('dashboard');
    setUsername('');
    setPassword('');
    setSelectedDept(null);
    setLoginError(null);
  };

  const handleUpload = (doc: Document) => {
    setDocuments(prev => [...prev, doc]);
  };

  const handleDeleteDoc = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const handleUpdateDoc = (updatedDoc: Document) => {
    setDocuments(prev => prev.map(doc => doc.id === updatedDoc.id ? updatedDoc : doc));
  };

  const handleUpdateChatSessions = (sessions: ChatSession[]) => {
    setChatSessions(sessions);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#eaeff5] flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
          {/* Header */}
          <div className="bg-[#0088cc] p-10 text-center text-white">
            <div className="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30 shadow-inner">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">ClinIQ Vault</h1>
            <p className="text-white/80 text-sm mt-1">Authorized Department Node Access</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-8 space-y-8">
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block ml-1">Select Your Department</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: Department.RADIOLOGY, label: 'Radiology', icon: Radiation },
                  { id: Department.ONCOLOGY, label: 'Oncology', icon: Stethoscope },
                  { id: Department.PATHOLOGY, label: 'Pathology', icon: Microscope },
                ].map((dept) => (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => {
                      setSelectedDept(dept.id);
                      setLoginError(null);
                    }}
                    className={`relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group ${
                      selectedDept === dept.id 
                        ? 'border-[#0088cc] bg-blue-50/50' 
                        : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <div className={`p-2 rounded-xl transition-colors ${
                      selectedDept === dept.id ? 'bg-[#0088cc] text-white' : 'bg-white text-slate-400 group-hover:text-slate-600'
                    }`}>
                      <dept.icon size={20} />
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-tight ${
                      selectedDept === dept.id ? 'text-[#0088cc]' : 'text-slate-400'
                    }`}>
                      {dept.label}
                    </span>
                    {selectedDept === dept.id && (
                      <div className="absolute -top-1.5 -right-1.5 bg-[#0088cc] text-white rounded-full p-0.5 border-2 border-white shadow-sm">
                        <CheckCircle2 size={12} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 ml-1 mb-1.5 block">Physician/Staff Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-[#f8fafc] text-slate-900 border border-slate-200 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-[#0088cc] outline-none transition-all placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 ml-1 mb-1.5 block">Department Access Key</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setLoginError(null);
                    }}
                    placeholder="••••••••"
                    className={`w-full bg-[#f8fafc] text-slate-900 border rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-[#0088cc] outline-none transition-all placeholder:text-slate-400 ${
                      loginError ? 'border-red-300 ring-1 ring-red-100' : 'border-slate-200'
                    }`}
                    required
                  />
                </div>
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={16} />
                <span className="text-xs font-bold tracking-tight">{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn || !selectedDept}
              className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 ${
                !selectedDept 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                  : 'bg-[#0d121f] text-white hover:bg-[#1a233a]'
              }`}
            >
              {isLoggingIn ? 'Establishing Secure Tunnel...' : 'Verify Node Authorization'}
            </button>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2">
               <Shield className="w-3.5 h-3.5 text-emerald-500" />
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">End-to-End Encrypted Node</span>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout} activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && <Dashboard user={user} documents={documents} />}
      {activeTab === 'chat' && <ChatInterface user={user} documents={documents} chatSessions={chatSessions} onUpdateSessions={handleUpdateChatSessions} />}
      {activeTab === 'docs' && (
        <KnowledgeBase 
          user={user} 
          documents={documents} 
          onUpload={handleUpload} 
          onDelete={handleDeleteDoc}
          onUpdate={handleUpdateDoc}
        />
      )}
    </Layout>
  );
};

export default App;
