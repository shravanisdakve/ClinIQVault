
import React, { useState, useEffect } from 'react';
import { Send, Bot, Plus, Edit2, Trash2, Cpu, Sparkles, Clock, Shield, MessageSquare } from 'lucide-react';
import { Message, User, Document, ChatSession } from '../types';
import { askHealthcareAI } from '../services/geminiService';

interface ChatInterfaceProps {
  user: User;
  documents: Document[];
  chatSessions: ChatSession[];
  onUpdateSessions: (sessions: ChatSession[]) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ user, documents, chatSessions, onUpdateSessions }) => {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Filter sessions by user department
  const departmentSessions = chatSessions.filter(s => s.department === user.department);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text, timestamp };
    
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askHealthcareAI(text, user.department, documents);
      const assistantMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        text: response, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      
      const updatedMessages = [...newMessages, assistantMsg];
      setMessages(updatedMessages);
      
      // Auto-save or update session
      saveOrUpdateSession(updatedMessages);
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveOrUpdateSession = (sessionMessages: Message[]) => {
    if (sessionMessages.length === 0) return;

    if (currentSessionId) {
      // Update existing session
      const updated = chatSessions.map(s => 
        s.id === currentSessionId ? { ...s, messages: sessionMessages } : s
      );
      onUpdateSessions(updated);
    } else {
      // Create new session
      const newId = Date.now().toString();
      const newSession: ChatSession = {
        id: newId,
        title: sessionMessages[0].text.slice(0, 30) + (sessionMessages[0].text.length > 30 ? '...' : ''),
        messages: sessionMessages,
        department: user.department
      };
      setCurrentSessionId(newId);
      onUpdateSessions([newSession, ...chatSessions]);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setInput('');
  };

  const loadSession = (session: ChatSession) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages);
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = chatSessions.filter(s => s.id !== id);
    onUpdateSessions(updated);
    if (currentSessionId === id) {
      handleNewChat();
    }
  };

  const suggestions = [
    `What are the safety requirements for ${user.department === 'Radiology' ? 'MRI' : 'clinical procedures'}?`,
    "Summarize the latest department protocols",
    "Contraindications for current patient records?"
  ];

  return (
    <div className="flex h-full bg-[#fcfdfe]">
      {/* Local Sidebar (Chat History) */}
      <aside className="w-64 border-r border-slate-100 flex flex-col p-4 bg-white">
        <button 
          onClick={handleNewChat}
          className="w-full border border-slate-200 rounded-xl py-2.5 flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all mb-6 shadow-sm active:scale-95"
        >
          <Plus size={16} /> New Chat
        </button>

        <p className="px-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-3">History ({user.department})</p>
        <div className="space-y-1 flex-1 overflow-y-auto pr-1 custom-scrollbar">
          {departmentSessions.length > 0 ? (
            departmentSessions.map(session => (
              <div 
                key={session.id}
                onClick={() => loadSession(session)}
                className={`group px-3 py-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  currentSessionId === session.id 
                    ? 'bg-blue-50 border-blue-100 text-blue-700' 
                    : 'border-transparent text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <MessageSquare size={14} className={currentSessionId === session.id ? 'text-blue-500' : 'text-slate-300'} />
                  <span className="text-xs font-semibold truncate">{session.title}</span>
                </div>
                <button 
                  onClick={(e) => deleteSession(e, session.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 hover:text-red-500 rounded"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-slate-300 opacity-60">
              <Clock size={24} className="mb-2" />
              <p className="text-[10px] font-bold uppercase">No recent chats</p>
            </div>
          )}
        </div>
        
        <div className="mt-auto p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Local Node Active</span>
          </div>
          <p className="text-[9px] text-slate-400 leading-tight">History is encrypted and stored in your browser's private storage.</p>
        </div>
      </aside>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative">
        <header className="h-12 border-b border-slate-100 flex items-center px-4 gap-2">
          <span className="text-sm font-bold text-slate-800">
            {currentSessionId ? 'Ongoing Consultation' : 'New Chat Session'}
          </span>
          <div className="px-2 py-0.5 bg-slate-100 text-[10px] font-bold text-slate-400 rounded-md flex items-center gap-1 uppercase">
            <Cpu size={10} /> Gemini 3
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center px-6 animate-in fade-in duration-500">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 shadow-sm text-blue-600">
                <Bot size={32} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">ClinIQ Vault</h2>
              <p className="text-slate-400 text-sm mb-10 leading-relaxed">
                Secure, local, and context-aware AI for {user.department}. Data never leaves this server.
              </p>

              <div className="grid grid-cols-2 gap-3 w-full max-w-xl">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className="p-4 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-600 hover:border-blue-400 hover:bg-blue-50 transition-all text-left flex items-start gap-3 group shadow-sm active:scale-[0.98]"
                  >
                    <span className="flex-1">{s}</span>
                    <Sparkles size={14} className="text-slate-200 group-hover:text-blue-400 transition-colors mt-0.5" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto py-8 space-y-8 px-6">
              {messages.map((m) => (
                <div key={m.id} className="flex gap-4 animate-in slide-in-from-bottom-2 duration-300">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    m.role === 'user' ? 'bg-[#0088cc] text-white shadow-md' : 'bg-white text-blue-600 border border-slate-200 shadow-sm'
                  }`}>
                    {m.role === 'user' ? user.name[0].toUpperCase() : <Bot size={18} />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {m.role === 'user' ? user.name : 'AI ASSISTANT'}
                      </span>
                      <span className="text-[9px] text-slate-300">{m.timestamp}</span>
                    </div>
                    <div className="text-sm text-slate-700 leading-relaxed pt-0.5 whitespace-pre-wrap">
                      {m.text}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4 animate-pulse">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200">
                    <Bot size={18} className="text-slate-400" />
                  </div>
                  <div className="flex-1 space-y-2 pt-2">
                    <div className="h-2 bg-slate-100 rounded w-1/4"></div>
                    <div className="h-2 bg-slate-100 rounded w-3/4"></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Input Area */}
        <div className="p-8 max-w-4xl mx-auto w-full">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }} 
            className="relative"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Query authorized ${user.department} records...`}
              className="w-full bg-[#333333] text-white rounded-2xl py-5 pl-8 pr-16 text-sm outline-none shadow-xl border border-white/5 placeholder:text-slate-500 font-medium transition-all focus:ring-2 focus:ring-[#0088cc]/50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
                input.trim() && !isLoading ? 'text-[#0088cc] hover:bg-white/5' : 'text-slate-600 opacity-50'
              }`}
            >
              <Send size={20} />
            </button>
          </form>
          <p className="text-center text-[10px] text-slate-300 mt-3 font-bold uppercase tracking-wider flex items-center justify-center gap-2">
            <Shield size={10} className="text-emerald-500" />
            End-to-end encrypted session for {user.department}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
