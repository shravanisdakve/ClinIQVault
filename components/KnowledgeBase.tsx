
import React, { useState } from 'react';
import { Upload, FileText, Trash2, Edit2, Lock, AlertCircle, X, Save, Search, Loader2 } from 'lucide-react';
import { Document, User } from '../types';

interface KnowledgeBaseProps {
  user: User;
  documents: Document[];
  onUpload: (doc: Document) => void;
  onDelete: (id: string) => void;
  onUpdate: (doc: Document) => void;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ user, documents, onUpload, onDelete, onUpdate }) => {
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [editName, setEditName] = useState('');
  const [editContent, setEditContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [syncingIds, setSyncingIds] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  
  // Filter docs by department first, then by search query
  const filteredDocs = documents.filter(doc => {
    const matchesDept = doc.department === user.department;
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      doc.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const docId = `uuid-${user.department.toLowerCase().slice(0,3)}-${Math.random().toString(10).slice(2,5)}`;
    
    // Simulate upload and initial indexing
    setSyncingIds(prev => new Set(prev).add(docId));
    
    const newDoc: Document = {
      id: docId,
      name: file.name,
      content: `Extracted content for ${file.name}... No clinical summary available yet. Please edit to add patient notes or protocol data for AI context.`,
      department: user.department,
      uploadedBy: user.name,
      uploadedAt: new Date().toISOString().split('T')[0],
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    };
    
    onUpload(newDoc);
    
    // Auto-clear syncing state after simulation
    setTimeout(() => {
      setSyncingIds(prev => {
        const next = new Set(prev);
        next.delete(docId);
        return next;
      });
    }, 2000);
  };

  const startEditing = (doc: Document) => {
    setEditingDoc(doc);
    setEditName(doc.name);
    setEditContent(doc.content);
  };

  const saveEdit = () => {
    if (editingDoc && editName.trim()) {
      setIsSaving(true);
      const docId = editingDoc.id;
      
      // Visual feedback for "re-indexing"
      setSyncingIds(prev => new Set(prev).add(docId));
      
      setTimeout(() => {
        onUpdate({ ...editingDoc, name: editName, content: editContent });
        setEditingDoc(null);
        setIsSaving(false);
        
        // Let the "Re-indexing" badge persist briefly for user feedback
        setTimeout(() => {
          setSyncingIds(prev => {
            const next = new Set(prev);
            next.delete(docId);
            return next;
          });
        }, 1500);
      }, 1000);
    }
  };

  return (
    <div className="p-8 flex flex-col h-full bg-[#f8fafc]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Document Repository</h2>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1">
            <Lock className="w-3.5 h-3.5" />
            <span className="text-sm">Isolated Storage: <span className="font-bold">{user.department}</span></span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#0088cc] transition-colors" />
            <input 
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0088cc] outline-none transition-all w-full md:w-64 font-medium shadow-sm placeholder:text-slate-400"
            />
          </div>

          <label className="bg-[#0088cc] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#0077bb] transition-all cursor-pointer shadow-md active:scale-95 whitespace-nowrap">
            <Upload className="w-4 h-4" />
            Upload Document
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex-1 flex flex-col min-h-0">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="bg-[#fcfdfe] border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Document Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">UUID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Size</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Upload Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-50 text-red-500 rounded-lg">
                        <FileText size={18} />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-400 font-mono">{doc.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{doc.size}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{doc.uploadedAt}</td>
                  <td className="px-6 py-4">
                    {syncingIds.has(doc.id) ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-full border border-amber-100">
                        <Loader2 size={10} className="animate-spin" />
                        Re-indexing
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-100">
                        <div className="w-1 h-1 rounded-full bg-emerald-500" />
                        Indexed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => startEditing(doc)}
                        className="p-1.5 hover:bg-blue-50 hover:text-blue-500 rounded-lg transition-all"
                        title="Edit Document Content"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(doc.id)} 
                        className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all"
                        title="Delete Permanently"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredDocs.length === 0 && (
            <div className="flex flex-col items-center justify-center p-20 text-slate-400 text-center h-full">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                {searchQuery ? <Search className="opacity-20 w-8 h-8" /> : <FileText className="opacity-20 w-8 h-8" />}
              </div>
              <p className="text-sm font-medium">
                {searchQuery 
                  ? `No results found for "${searchQuery}"`
                  : `No documents indexed in ${user.department} storage.`
                }
              </p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-xs text-[#0088cc] font-bold hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-4">
        <div className="p-2 bg-white rounded-full text-blue-600 shadow-sm border border-blue-100">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">HIPAA Compliance Notice</p>
          <p className="text-xs text-blue-600/80 mt-1 leading-relaxed">
            Documents uploaded here are processed locally on-premise. No data leaves the hospital's private network. 
            Access is strictly limited to users within the <span className="font-bold">{user.department}</span> department.
          </p>
        </div>
      </div>

      {/* Edit Modal */}
      {editingDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-blue-500" />
                  Edit Document Content
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Modifying knowledge base context for AI Assistant</p>
              </div>
              <button 
                onClick={() => !isSaving && setEditingDoc(null)} 
                disabled={isSaving}
                className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors disabled:opacity-30"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Filename</label>
                  <input
                    type="text"
                    value={editName}
                    disabled={isSaving}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold text-slate-700 shadow-sm disabled:bg-slate-50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Clinical Content (AI Context Source)</label>
                  <textarea
                    value={editContent}
                    disabled={isSaving}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={12}
                    placeholder="Enter patient notes, clinical findings, or protocols here. This text will be used by the AI to answer questions."
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-600 shadow-sm resize-none leading-relaxed disabled:bg-slate-50"
                  />
                  <p className="text-[10px] text-slate-400 italic mt-2 text-center">Changes will be re-indexed in the local vector database immediately after saving.</p>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-50">
                <button
                  onClick={() => setEditingDoc(null)}
                  disabled={isSaving}
                  className="flex-1 py-3.5 px-4 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all disabled:opacity-50"
                >
                  Discard Changes
                </button>
                <button
                  onClick={saveEdit}
                  disabled={isSaving || !editName.trim()}
                  className="flex-1 py-3.5 px-4 bg-[#0088cc] text-white rounded-xl text-sm font-bold hover:bg-[#0077bb] transition-all shadow-lg flex items-center justify-center gap-2 disabled:bg-slate-400"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Re-indexing Content...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Update Local Knowledge Base
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
