import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Save, Loader2, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function CrudManager({ table, label, fields, textAreaFields = [], arrayField = null, orderBy = 'display_order', orderAsc = true }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from(table).select('*').order(orderBy, { ascending: orderAsc });
    setItems(data || []);
    setLoading(false);
  }, [table, orderBy, orderAsc]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleSave = async (formData) => {
    setSaving(true);
    if (formData.id) {
      const { id, created_at, updated_at, ...updates } = formData;
      await supabase.from(table).update(updates).eq('id', id);
    } else {
      const { id, created_at, updated_at, ...insertData } = formData;
      const maxOrder = items.reduce((max, item) => Math.max(max, item.display_order || 0), 0);
      await supabase.from(table).insert({ ...insertData, display_order: maxOrder + 1 });
    }
    setSaving(false);
    setShowForm(false);
    setEditing(null);
    fetchItems();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item? This cannot be undone.')) return;
    await supabase.from(table).delete().eq('id', id);
    fetchItems();
  };

  const togglePublish = async (item: any) => {
    await supabase.from(table).update({ is_published: !item.is_published }).eq('id', item.id);
    fetchItems();
  };

  const moveOrder = async (item, direction) => {
    const idx = items.findIndex((i) => i.id === item.id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= items.length) return;
    const swapItem = items[swapIdx];
    await supabase.from(table).update({ display_order: swapItem.display_order }).eq('id', item.id);
    await supabase.from(table).update({ display_order: item.display_order }).eq('id', swapItem.id);
    fetchItems();
  };

  const emptyForm = () => {
    const form: any = {};
    fields.forEach((f) => form[f.key] = f.type === 'array' ? [] : f.type === 'boolean' ? false : '');
    if (arrayField) form[arrayField] = [];
    form.is_published = true;
    return form;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">{label}</h1>
          <p className="text-gray-400 mt-1">Manage {label.toLowerCase()}.</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          data-cursor="ADD"
          className="btn-primary text-xs"
        >
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <CrudForm
            fields={fields}
            textAreaFields={textAreaFields}
            arrayField={arrayField}
            initialData={editing || emptyForm()}
            isEditing={!!editing}
            saving={saving}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        )}
      </AnimatePresence>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => <div key={i} className="glass p-6 animate-pulse h-20" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="glass p-12 text-center text-gray-400">
          No {label.toLowerCase()} yet. Click "Add New" to create one.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-5 flex items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white truncate">
                    {item.title || item.name || item.role || item.platform || item.label || 'Untitled'}
                  </p>
                  {!item.is_published && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-warning-500/10 text-warning-400 border border-warning-500/20">Draft</span>
                  )}
                </div>
                {item.description && <p className="text-sm text-gray-500 truncate mt-1">{item.description}</p>}
                {item.company && <p className="text-sm text-gray-500 mt-1">{item.company}</p>}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => moveOrder(item, -1)} className="p-2 text-gray-500 hover:text-white transition-colors" title="Move up"><ArrowUp className="w-4 h-4" /></button>
                <button onClick={() => moveOrder(item, 1)} className="p-2 text-gray-500 hover:text-white transition-colors" title="Move down"><ArrowDown className="w-4 h-4" /></button>
                <button onClick={() => togglePublish(item)} className="p-2 text-gray-500 hover:text-brand-400 transition-colors" title={item.is_published ? 'Unpublish' : 'Publish'}>
                  {item.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => { setEditing(item); setShowForm(true); }} className="p-2 text-gray-500 hover:text-brand-400 transition-colors" title="Edit"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-500 hover:text-danger-400 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function CrudForm({ fields, textAreaFields = [], arrayField, initialData, isEditing, saving, onSave, onCancel }) {
  const [form, setForm] = useState(initialData);

  const setField = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-ink-950/80 backdrop-blur-sm flex items-center justify-center p-4 lg:p-8 overflow-y-auto"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong p-6 lg:p-8 w-full max-w-2xl my-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold text-white">{isEditing ? 'Edit' : 'Add New'}</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">{f.label}</label>
              {f.type === 'select' ? (
                <select
                  value={form[f.key] || ''}
                  onChange={(e) => setField(f.key, e.target.value)}
                  className="w-full bg-ink-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-400/40 focus:outline-none transition-all"
                >
                  <option value="">Select...</option>
                  {f.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : f.type === 'boolean' ? (
                <button
                  type="button"
                  onClick={() => setField(f.key, !form[f.key])}
                  className={`px-4 py-3 rounded-xl text-sm border transition-all ${form[f.key] ? 'bg-brand-400/10 border-brand-400/30 text-brand-400' : 'bg-ink-800/50 border-white/10 text-gray-400'}`}
                >
                  {form[f.key] ? 'Yes' : 'No'}
                </button>
              ) : (
                <input
                  type={f.type === 'array' ? 'text' : f.type || 'text'}
                  value={Array.isArray(form[f.key]) ? form[f.key].join(', ') : form[f.key] || ''}
                  onChange={(e) => setField(f.key, f.type === 'array' ? e.target.value.split(',').map((s) => s.trim()).filter(Boolean) : e.target.value)}
                  className="w-full bg-ink-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-400/40 focus:outline-none transition-all"
                  placeholder={f.type === 'array' ? 'Comma-separated values' : ''}
                />
              )}
            </div>
          ))}

          {textAreaFields.map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">{f.label}</label>
              <textarea
                value={form[f.key] || ''}
                onChange={(e) => setField(f.key, e.target.value)}
                rows={f.rows || 4}
                className="w-full bg-ink-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-400/40 focus:outline-none transition-all resize-none"
              />
            </div>
          ))}

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving} data-cursor="SAVE" className="btn-primary disabled:opacity-50">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save</>}
            </button>
            <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
