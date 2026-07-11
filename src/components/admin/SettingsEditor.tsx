import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Loader2, CheckCircle2, Plus, Trash2 } from 'lucide-react';

export default function SettingsEditor() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('site_settings').select('*').maybeSingle();
      setSettings(data || { id: 1, stats: [], resume_url: '', availability_status: 'Available for selected projects' });
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const { id, created_at, updated_at, ...updates } = settings;
    await supabase.from('site_settings').upsert({ id: 1, ...updates });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateStat = (index, field, value) => {
    const stats = [...(settings.stats || [])];
    stats[index] = { ...stats[index], [field]: value };
    setSettings({ ...settings, stats });
  };

  const addStat = () => {
    const stats = [...(settings.stats || []), { label: '', value: '', suffix: '' }];
    setSettings({ ...settings, stats });
  };

  const removeStat = (index) => {
    const stats = (settings.stats || []).filter((_, i) => i !== index);
    setSettings({ ...settings, stats });
  };

  if (loading || !settings) return <div className="glass p-8 animate-pulse h-96" />;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white mb-2">Site Settings</h1>
      <p className="text-gray-400 mb-8">Global site configuration and homepage statistics.</p>

      <div className="glass p-6 lg:p-8 space-y-6">
        {/* Availability & Resume */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Availability Status</label>
            <input
              type="text"
              value={settings.availability_status || ''}
              onChange={(e) => setSettings({ ...settings, availability_status: e.target.value })}
              className="w-full bg-ink-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-400/40 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Resume URL</label>
            <input
              type="text"
              value={settings.resume_url || ''}
              onChange={(e) => setSettings({ ...settings, resume_url: e.target.value })}
              className="w-full bg-ink-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-400/40 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Stats */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-xs font-mono uppercase tracking-widest text-gray-500">Homepage Statistics</label>
            <button onClick={addStat} className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1"><Plus className="w-3 h-3" /> Add Stat</button>
          </div>
          <div className="space-y-3">
            {(settings.stats || []).map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <input type="text" value={stat.label || ''} onChange={(e) => updateStat(i, 'label', e.target.value)} placeholder="Label" className="flex-1 bg-ink-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-brand-400/40 focus:outline-none transition-all" />
                <input type="text" value={stat.value || ''} onChange={(e) => updateStat(i, 'value', e.target.value)} placeholder="Value" className="w-24 bg-ink-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-brand-400/40 focus:outline-none transition-all" />
                <input type="text" value={stat.suffix || ''} onChange={(e) => updateStat(i, 'suffix', e.target.value)} placeholder="Suffix" className="w-24 bg-ink-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-brand-400/40 focus:outline-none transition-all" />
                <button onClick={() => removeStat(i)} className="p-2 text-gray-500 hover:text-danger-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
          {saved && <span className="flex items-center gap-2 text-sm text-success-400"><CheckCircle2 className="w-4 h-4" /> Saved!</span>}
        </div>
      </div>
    </div>
  );
}
