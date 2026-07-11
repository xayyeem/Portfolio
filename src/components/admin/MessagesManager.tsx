import { useContactMessages } from '../../lib/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Mail, Trash2, X, CheckCircle2, Circle, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function MessagesManager() {
  const { data: messages, loading, refetch } = useContactMessages();
  const [selected, setSelected] = useState(null);

  const toggleRead = async (msg) => {
    await supabase.from('contact_messages').update({ is_read: !msg.is_read }).eq('id', msg.id);
    refetch();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    await supabase.from('contact_messages').delete().eq('id', id);
    setSelected(null);
    refetch();
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white mb-2">Messages</h1>
      <p className="text-gray-400 mb-8">Contact form submissions.</p>

      {loading ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="glass p-6 animate-pulse h-20" />)}</div>
      ) : messages.length === 0 ? (
        <div className="glass p-12 text-center text-gray-400">
          <Mail className="w-8 h-8 mx-auto mb-4 text-gray-600" />
          No messages yet.
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass p-5 cursor-pointer hover:border-brand-400/20 transition-all ${!msg.is_read ? 'border-l-2 border-l-brand-400' : ''}`}
              onClick={() => { setSelected(msg); if (!msg.is_read) toggleRead(msg); }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {!msg.is_read && <span className="w-2 h-2 rounded-full bg-brand-400 shrink-0" />}
                    <p className="font-medium text-white truncate">{msg.name}</p>
                    <span className="text-xs text-gray-500 truncate">{msg.email}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate mt-1">{msg.message}</p>
                  {msg.project_type && <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-brand-400/10 text-brand-400">{msg.project_type}</span>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={(e) => { e.stopPropagation(); toggleRead(msg); }} className="p-2 text-gray-500 hover:text-brand-400">
                    {msg.is_read ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }} className="p-2 text-gray-500 hover:text-danger-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-ink-950/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="glass-strong p-6 lg:p-8 w-full max-w-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-white">Message</h2>
                <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-gray-500">From</p>
                  <p className="text-white mt-1">{selected.name} <span className="text-gray-500">&lt;{selected.email}&gt;</span></p>
                </div>
                {selected.company && <div><p className="text-xs font-mono uppercase tracking-widest text-gray-500">Company</p><p className="text-white mt-1">{selected.company}</p></div>}
                {selected.project_type && <div><p className="text-xs font-mono uppercase tracking-widest text-gray-500">Project Type</p><p className="text-white mt-1">{selected.project_type}</p></div>}
                {selected.budget_range && <div><p className="text-xs font-mono uppercase tracking-widest text-gray-500">Budget</p><p className="text-white mt-1">{selected.budget_range}</p></div>}
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-gray-500">Message</p>
                  <p className="text-gray-300 mt-1 whitespace-pre-wrap">{selected.message}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 pt-2">
                  <Calendar className="w-3 h-3" />
                  {new Date(selected.created_at).toLocaleString()}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <a href={`mailto:${selected.email}`} className="btn-primary text-xs">Reply via Email</a>
                <button onClick={() => handleDelete(selected.id)} className="btn-ghost text-xs text-danger-400">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
