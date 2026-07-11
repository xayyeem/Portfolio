import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Loader2, CheckCircle2 } from 'lucide-react';

export default function ProfileEditor() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('profiles').select('*').maybeSingle();
      setForm(data || {
        name: 'Khalid Haider Jafri',
        role: 'Full-Stack Software Developer',
        secondary_role: '',
        tagline: '',
        intro: '',
        bio: '',
        philosophy: '',
        resume_url: '',
        availability_status: 'Available for selected projects',
        avatar_url: '',
      });
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const { id, created_at, updated_at, ...updates } = form;
    await supabase.from('profiles').upsert({ id: 1, ...updates });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading || !form) return <div className="glass p-8 animate-pulse h-96" />;

  const fields = [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'role', label: 'Primary Role', type: 'text' },
    { key: 'secondary_role', label: 'Secondary Role', type: 'text' },
    { key: 'tagline', label: 'Hero Tagline', type: 'text' },
    { key: 'availability_status', label: 'Availability Status', type: 'text' },
    { key: 'resume_url', label: 'Resume URL', type: 'text' },
    { key: 'avatar_url', label: 'Avatar URL', type: 'text' },
  ];

  const textareas = [
    { key: 'intro', label: 'Introduction' },
    { key: 'bio', label: 'Bio (About page)' },
    { key: 'philosophy', label: 'Philosophy' },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white mb-2">Profile</h1>
      <p className="text-gray-400 mb-8">Your professional identity and bio content.</p>

      <div className="glass p-6 lg:p-8 space-y-5">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">{f.label}</label>
            <input
              type={f.type}
              value={form[f.key] || ''}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              className="w-full bg-ink-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-400/40 focus:outline-none transition-all"
            />
          </div>
        ))}

        {textareas.map((f) => (
          <div key={f.key}>
            <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">{f.label}</label>
            <textarea
              value={form[f.key] || ''}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              rows={4}
              className="w-full bg-ink-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-400/40 focus:outline-none transition-all resize-none"
            />
          </div>
        ))}

        <div className="flex items-center gap-4 pt-2">
          <button onClick={handleSave} disabled={saving} data-cursor="SAVE" className="btn-primary disabled:opacity-50">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
          {saved && (
            <span className="flex items-center gap-2 text-sm text-success-400">
              <CheckCircle2 className="w-4 h-4" /> Saved!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
