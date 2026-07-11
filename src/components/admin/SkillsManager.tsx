import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Save, Loader2, ChevronDown, ChevronRight, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function SkillsManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [showCatForm, setShowCatForm] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [showSkillForm, setShowSkillForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('skill_categories')
      .select('*, skills(*)')
      .order('display_order', { ascending: true });
    setCategories(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const saveCategory = async (formData) => {
    setSaving(true);
    if (formData.id) {
      const { id, created_at, updated_at, skills, ...updates } = formData;
      await supabase.from('skill_categories').update(updates).eq('id', id);
    } else {
      const { id, created_at, updated_at, skills, ...insertData } = formData;
      const maxOrder = categories.reduce((max, c) => Math.max(max, c.display_order || 0), 0);
      await supabase.from('skill_categories').insert({ ...insertData, display_order: maxOrder + 1 });
    }
    setSaving(false);
    setShowCatForm(false);
    setEditingCat(null);
    fetchAll();
  };

  const deleteCategory = async (id) => {
    if (!confirm('Delete this category and all its skills?')) return;
    await supabase.from('skill_categories').delete().eq('id', id);
    fetchAll();
  };

  const saveSkill = async (formData) => {
    setSaving(true);
    if (formData.id) {
      const { id, created_at, updated_at, ...updates } = formData;
      await supabase.from('skills').update(updates).eq('id', id);
    } else {
      const { id, created_at, updated_at, ...insertData } = formData;
      const cat = categories.find((c) => c.id === showSkillForm);
      const maxOrder = cat?.skills?.reduce((max, s) => Math.max(max, s.display_order || 0), 0) || 0;
      await supabase.from('skills').insert({ ...insertData, category_id: showSkillForm, display_order: maxOrder + 1 });
    }
    setSaving(false);
    setShowSkillForm(null);
    fetchAll();
  };

  const deleteSkill = async (id) => {
    await supabase.from('skills').delete().eq('id', id);
    fetchAll();
  };

  const togglePublish = async (item, table) => {
    await supabase.from(table).update({ is_published: !item.is_published }).eq('id', item.id);
    fetchAll();
  };

  const moveCategory = async (cat, direction) => {
    const idx = categories.findIndex((c) => c.id === cat.id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= categories.length) return;
    await supabase.from('skill_categories').update({ display_order: categories[swapIdx].display_order }).eq('id', cat.id);
    await supabase.from('skill_categories').update({ display_order: cat.display_order }).eq('id', categories[swapIdx].id);
    fetchAll();
  };

  if (loading) return <div className="space-y-3">{[0, 1].map((i) => <div key={i} className="glass p-6 animate-pulse h-20" />)}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Skills</h1>
          <p className="text-gray-400 mt-1">Manage skill categories and individual skills.</p>
        </div>
        <button onClick={() => { setEditingCat(null); setShowCatForm(true); }} data-cursor="ADD" className="btn-primary text-xs">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <AnimatePresence>
        {showCatForm && (
          <SimpleForm
            title={editingCat ? 'Edit Category' : 'New Category'}
            fields={[
              { key: 'name', label: 'Category Name', type: 'text' },
              { key: 'icon', label: 'Icon (Code, Layers, Wrench, Plug)', type: 'text' },
            ]}
            textAreaFields={[{ key: 'description', label: 'Description', rows: 3 }]}
            initialData={editingCat || { is_published: true }}
            saving={saving}
            onSave={saveCategory}
            onCancel={() => { setShowCatForm(false); setEditingCat(null); }}
          />
        )}
        {showSkillForm && (
          <SimpleForm
            title="Add Skill"
            fields={[{ key: 'name', label: 'Skill Name', type: 'text' }]}
            initialData={{ is_published: true }}
            saving={saving}
            onSave={saveSkill}
            onCancel={() => setShowSkillForm(null)}
          />
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {categories.map((cat) => (
          <motion.div key={cat.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass overflow-hidden">
            <div className="flex items-center justify-between p-5">
              <button onClick={() => setExpanded(expanded === cat.id ? null : cat.id)} className="flex items-center gap-3 flex-1 text-left">
                {expanded === cat.id ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                <div>
                  <p className="font-medium text-white">{cat.name}</p>
                  <p className="text-xs text-gray-500">{cat.skills?.length || 0} skills</p>
                </div>
              </button>
              <div className="flex items-center gap-1">
                <button onClick={() => moveCategory(cat, -1)} className="p-2 text-gray-500 hover:text-white"><ArrowUp className="w-4 h-4" /></button>
                <button onClick={() => moveCategory(cat, 1)} className="p-2 text-gray-500 hover:text-white"><ArrowDown className="w-4 h-4" /></button>
                <button onClick={() => togglePublish(cat, 'skill_categories')} className="p-2 text-gray-500 hover:text-brand-400">{cat.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</button>
                <button onClick={() => { setEditingCat(cat); setShowCatForm(true); }} className="p-2 text-gray-500 hover:text-brand-400"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => deleteCategory(cat.id)} className="p-2 text-gray-500 hover:text-danger-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>

            <AnimatePresence>
              {expanded === cat.id && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="px-5 pb-5 pt-2 border-t border-white/[0.04]">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-mono uppercase tracking-widest text-gray-500">Skills</p>
                      <button onClick={() => setShowSkillForm(cat.id)} className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1"><Plus className="w-3 h-3" /> Add Skill</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cat.skills?.map((skill) => (
                        <div key={skill.id} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] group">
                          <span className="text-sm text-gray-300">{skill.name}</span>
                          <button onClick={() => deleteSkill(skill.id)} className="text-gray-600 hover:text-danger-400"><X className="w-3 h-3" /></button>
                        </div>
                      ))}
                      {(!cat.skills || cat.skills.length === 0) && <p className="text-sm text-gray-500">No skills yet.</p>}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SimpleForm({ title, fields, textAreaFields = [], initialData, saving, onSave, onCancel }) {
  const [form, setForm] = useState(initialData);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-ink-950/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onCancel}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="glass-strong p-6 lg:p-8 w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold text-white">{title}</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-5">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">{f.label}</label>
              <input type={f.type || 'text'} value={form[f.key] || ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="w-full bg-ink-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-400/40 focus:outline-none transition-all" />
            </div>
          ))}
          {textAreaFields.map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">{f.label}</label>
              <textarea value={form[f.key] || ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} rows={f.rows || 4} className="w-full bg-ink-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-400/40 focus:outline-none transition-all resize-none" />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">{saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save</>}</button>
            <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
