import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Code2, FolderKanban, Sparkles, Link2, Mail, Settings, ArrowUpRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const CARDS = [
  { id: 'experience', label: 'Experience', Icon: Briefcase, table: 'experiences' },
  { id: 'skills', label: 'Skills', Icon: Code2, table: 'skills' },
  { id: 'projects', label: 'Projects', Icon: FolderKanban, table: 'projects' },
  { id: 'services', label: 'Services', Icon: Sparkles, table: 'services' },
  { id: 'socials', label: 'Social Links', Icon: Link2, table: 'social_links' },
  { id: 'messages', label: 'Messages', Icon: Mail, table: 'contact_messages' },
];

export default function Overview({ onNavigate }) {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const results = {};
      for (const card of CARDS) {
        const { count } = await supabase.from(card.table).select('*', { count: 'exact', head: true });
        results[card.id] = count || 0;
      }
      setCounts(results);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white mb-2">Overview</h1>
      <p className="text-gray-400 mb-8">Manage your portfolio content from here.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CARDS.map((card, i) => (
          <motion.button
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onNavigate(card.id)}
            className="glass p-6 text-left hover:border-brand-400/20 hover:bg-white/[0.05] transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-400/10 flex items-center justify-center">
                <card.Icon className="w-5 h-5 text-brand-400" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-brand-400 transition-colors" />
            </div>
            <p className="text-3xl font-display font-bold text-white">
              {loading ? '—' : counts[card.id] || 0}
            </p>
            <p className="text-sm text-gray-400 mt-1">{card.label}</p>
          </motion.button>
        ))}
      </div>

      <div className="mt-8 glass p-6">
        <div className="flex items-center gap-3 mb-3">
          <Settings className="w-4 h-4 text-brand-400" />
          <h3 className="font-display text-sm font-bold text-white">Quick Actions</h3>
        </div>
        <div className="flex flex-wrap gap-3 mt-4">
          <button onClick={() => onNavigate('profile')} className="btn-ghost text-xs">Edit Profile</button>
          <button onClick={() => onNavigate('settings')} className="btn-ghost text-xs">Site Settings</button>
          <button onClick={() => onNavigate('projects')} className="btn-ghost text-xs">Add Project</button>
        </div>
      </div>
    </div>
  );
}
