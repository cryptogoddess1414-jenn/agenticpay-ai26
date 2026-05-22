import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, ToggleLeft, ToggleRight, Zap, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, Eye, AlertTriangle, Edit2, Save, X
} from 'lucide-react';

const ACTION_CONFIG = {
  auto_approve: { label: 'Auto Approve', icon: CheckCircle2, cls: 'text-green-600 bg-green-50 border-green-200' },
  auto_deny:    { label: 'Auto Deny',    icon: XCircle,      cls: 'text-red-600 bg-red-50 border-red-200' },
  require_review: { label: 'Manual Review', icon: Eye,       cls: 'text-amber-600 bg-amber-50 border-amber-200' },
};

const EMPTY_RULE = {
  name: '',
  description: '',
  action: 'auto_approve',
  priority: 10,
  is_active: true,
  clv_min: '',
  clv_max: '',
  risk_score_max: '',
  risk_score_min: '',
  amount_min: '',
  amount_max: '',
  tenure_min_months: '',
  plans: [],
};

const PLAN_OPTIONS = ['free', 'starter', 'pro', 'enterprise'];

function RuleForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_RULE);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const togglePlan = (p) => {
    set('plans', form.plans.includes(p) ? form.plans.filter(x => x !== p) : [...form.plans, p]);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    const clean = { ...form };
    // Convert empty strings to undefined so they're ignored in the engine
    ['clv_min','clv_max','risk_score_min','risk_score_max','amount_min','amount_max','tenure_min_months'].forEach(k => {
      if (clean[k] === '' || clean[k] === null) delete clean[k];
      else clean[k] = Number(clean[k]);
    });
    clean.priority = Number(clean.priority) || 10;
    onSave(clean);
  };

  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      className="border border-[#635BFF]/30 rounded-2xl bg-[#F8F8FF] p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="text-[11px] font-semibold text-[#8898AA] uppercase tracking-wider">Rule Name *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)}
            placeholder="e.g. High-CLV Fast Approve"
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#635BFF]/30" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-[11px] font-semibold text-[#8898AA] uppercase tracking-wider">Description</label>
          <input value={form.description} onChange={e => set('description', e.target.value)}
            placeholder="Optional: describe what this rule does"
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#635BFF]/30" />
        </div>

        {/* Action */}
        <div>
          <label className="text-[11px] font-semibold text-[#8898AA] uppercase tracking-wider">Action</label>
          <select value={form.action} onChange={e => set('action', e.target.value)}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#635BFF]/30">
            <option value="auto_approve">Auto Approve Refund</option>
            <option value="auto_deny">Auto Deny Refund</option>
            <option value="require_review">Require Manual Review</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="text-[11px] font-semibold text-[#8898AA] uppercase tracking-wider">Priority <span className="normal-case font-normal">(lower = first)</span></label>
          <input type="number" value={form.priority} onChange={e => set('priority', e.target.value)} min={1}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#635BFF]/30" />
        </div>
      </div>

      {/* Conditions */}
      <div>
        <p className="text-[11px] font-semibold text-[#8898AA] uppercase tracking-wider mb-2">Conditions <span className="normal-case font-normal text-[#8898AA]">(leave blank to match all)</span></p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <div>
            <label className="text-[10px] text-[#8898AA]">CLV Min ($)</label>
            <input type="number" value={form.clv_min} onChange={e => set('clv_min', e.target.value)} placeholder="e.g. 500"
              className="mt-0.5 w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-[#0A2540] focus:outline-none focus:ring-1 focus:ring-[#635BFF]/30" />
          </div>
          <div>
            <label className="text-[10px] text-[#8898AA]">CLV Max ($)</label>
            <input type="number" value={form.clv_max} onChange={e => set('clv_max', e.target.value)} placeholder="e.g. 10000"
              className="mt-0.5 w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-[#0A2540] focus:outline-none focus:ring-1 focus:ring-[#635BFF]/30" />
          </div>
          <div>
            <label className="text-[10px] text-[#8898AA]">Risk Score Max (0–1)</label>
            <input type="number" step="0.01" min="0" max="1" value={form.risk_score_max} onChange={e => set('risk_score_max', e.target.value)} placeholder="e.g. 0.3"
              className="mt-0.5 w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-[#0A2540] focus:outline-none focus:ring-1 focus:ring-[#635BFF]/30" />
          </div>
          <div>
            <label className="text-[10px] text-[#8898AA]">Risk Score Min (0–1)</label>
            <input type="number" step="0.01" min="0" max="1" value={form.risk_score_min} onChange={e => set('risk_score_min', e.target.value)} placeholder="e.g. 0.7"
              className="mt-0.5 w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-[#0A2540] focus:outline-none focus:ring-1 focus:ring-[#635BFF]/30" />
          </div>
          <div>
            <label className="text-[10px] text-[#8898AA]">Amount Min ($)</label>
            <input type="number" value={form.amount_min} onChange={e => set('amount_min', e.target.value)} placeholder="e.g. 0"
              className="mt-0.5 w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-[#0A2540] focus:outline-none focus:ring-1 focus:ring-[#635BFF]/30" />
          </div>
          <div>
            <label className="text-[10px] text-[#8898AA]">Amount Max ($)</label>
            <input type="number" value={form.amount_max} onChange={e => set('amount_max', e.target.value)} placeholder="e.g. 500"
              className="mt-0.5 w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-[#0A2540] focus:outline-none focus:ring-1 focus:ring-[#635BFF]/30" />
          </div>
          <div>
            <label className="text-[10px] text-[#8898AA]">Tenure Min (months)</label>
            <input type="number" value={form.tenure_min_months} onChange={e => set('tenure_min_months', e.target.value)} placeholder="e.g. 6"
              className="mt-0.5 w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-[#0A2540] focus:outline-none focus:ring-1 focus:ring-[#635BFF]/30" />
          </div>
        </div>
      </div>

      {/* Plan filter */}
      <div>
        <label className="text-[11px] font-semibold text-[#8898AA] uppercase tracking-wider mb-2 block">Apply to Plans <span className="normal-case font-normal">(none = all)</span></label>
        <div className="flex flex-wrap gap-2">
          {PLAN_OPTIONS.map(p => (
            <button key={p} onClick={() => togglePlan(p)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all capitalize
                ${form.plans.includes(p)
                  ? 'bg-[#635BFF] text-white border-[#635BFF]'
                  : 'bg-white text-[#425466] border-gray-200 hover:border-[#635BFF]/40'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Button onClick={handleSave} disabled={!form.name.trim()} size="sm"
          className="bg-[#635BFF] hover:bg-[#5751e8] text-white gap-1.5">
          <Save className="w-3.5 h-3.5" /> Save Rule
        </Button>
        <Button onClick={onCancel} variant="ghost" size="sm" className="text-[#8898AA]">
          <X className="w-3.5 h-3.5 mr-1" /> Cancel
        </Button>
      </div>
    </motion.div>
  );
}

function RuleCard({ rule, onToggle, onDelete, onEdit }) {
  const cfg = ACTION_CONFIG[rule.action];
  const Icon = cfg?.icon;

  return (
    <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      className={`border rounded-xl p-4 bg-white transition-opacity ${!rule.is_active ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="mt-0.5 flex-shrink-0">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-bold ${cfg?.cls}`}>
              {Icon && <Icon className="w-3 h-3" />}
              {cfg?.label}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#0A2540] truncate">{rule.name}</p>
            {rule.description && <p className="text-[11px] text-[#8898AA] mt-0.5">{rule.description}</p>}
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
              {rule.clv_min != null && <Pill label={`CLV ≥ $${rule.clv_min.toLocaleString()}`} />}
              {rule.clv_max != null && <Pill label={`CLV ≤ $${rule.clv_max.toLocaleString()}`} />}
              {rule.risk_score_max != null && <Pill label={`Risk ≤ ${rule.risk_score_max}`} color="red" />}
              {rule.risk_score_min != null && <Pill label={`Risk ≥ ${rule.risk_score_min}`} color="red" />}
              {rule.amount_min != null && <Pill label={`Amount ≥ $${rule.amount_min}`} />}
              {rule.amount_max != null && <Pill label={`Amount ≤ $${rule.amount_max}`} />}
              {rule.tenure_min_months != null && <Pill label={`Tenure ≥ ${rule.tenure_min_months}mo`} />}
              {rule.plans?.length > 0 && <Pill label={`Plans: ${rule.plans.join(', ')}`} color="purple" />}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-[10px] text-[#8898AA] mr-1">P{rule.priority}</span>
          <button onClick={() => onEdit(rule)} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#8898AA] hover:text-[#635BFF] transition-colors">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onToggle(rule)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            {rule.is_active
              ? <ToggleRight className="w-4 h-4 text-[#635BFF]" />
              : <ToggleLeft className="w-4 h-4 text-[#8898AA]" />}
          </button>
          <button onClick={() => onDelete(rule.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#8898AA] hover:text-red-500 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {rule.match_count > 0 && (
        <p className="text-[10px] text-[#8898AA] mt-2 flex items-center gap-1">
          <Zap className="w-3 h-3 text-[#635BFF]" />
          Fired {rule.match_count} time{rule.match_count !== 1 ? 's' : ''}
          {rule.last_matched_at && ` · Last: ${new Date(rule.last_matched_at).toLocaleString()}`}
        </p>
      )}
    </motion.div>
  );
}

function Pill({ label, color }) {
  const cls = color === 'red' ? 'bg-red-50 text-red-600 border-red-100'
    : color === 'purple' ? 'bg-[#EEF0FF] text-[#635BFF] border-[#635BFF]/20'
    : 'bg-gray-50 text-[#425466] border-gray-100';
  return <span className={`text-[10px] px-1.5 py-0.5 rounded border ${cls}`}>{label}</span>;
}

export default function RefundRuleEngine() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => { fetchRules(); }, []);

  const fetchRules = async () => {
    setLoading(true);
    const data = await base44.entities.RefundRule.list('priority');
    setRules(data);
    setLoading(false);
  };

  const handleSave = async (formData) => {
    if (editingRule) {
      await base44.entities.RefundRule.update(editingRule.id, formData);
    } else {
      await base44.entities.RefundRule.create(formData);
    }
    setShowForm(false);
    setEditingRule(null);
    fetchRules();
  };

  const handleToggle = async (rule) => {
    await base44.entities.RefundRule.update(rule.id, { is_active: !rule.is_active });
    fetchRules();
  };

  const handleDelete = async (id) => {
    await base44.entities.RefundRule.delete(id);
    fetchRules();
  };

  const handleEdit = (rule) => {
    // Normalize arrays/numbers back to form-compatible values
    const prep = {
      ...rule,
      clv_min: rule.clv_min ?? '',
      clv_max: rule.clv_max ?? '',
      risk_score_min: rule.risk_score_min ?? '',
      risk_score_max: rule.risk_score_max ?? '',
      amount_min: rule.amount_min ?? '',
      amount_max: rule.amount_max ?? '',
      tenure_min_months: rule.tenure_min_months ?? '',
      plans: rule.plans || [],
    };
    setEditingRule(prep);
    setShowForm(true);
    setExpanded(true);
  };

  const activeCount = rules.filter(r => r.is_active).length;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#635BFF] flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#0A2540]">Automated Refund Rule Engine</p>
            <p className="text-[11px] text-[#8898AA]">{activeCount} active rule{activeCount !== 1 ? 's' : ''} · evaluated in priority order · integrated with Stripe webhook</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!showForm && (
            <Button size="sm" onClick={() => { setEditingRule(null); setShowForm(true); setExpanded(true); }}
              className="bg-[#635BFF] hover:bg-[#5751e8] text-white gap-1.5 text-xs">
              <Plus className="w-3.5 h-3.5" /> Add Rule
            </Button>
          )}
          <button onClick={() => setExpanded(e => !e)} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#8898AA]">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="p-5 space-y-3">

              {/* Webhook integration note */}
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 text-xs text-amber-700">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>Rules fire automatically via the Stripe <strong>charge.refund.updated</strong> webhook. For manual evaluation, use the <strong>Test Rule</strong> button on any transaction row.</span>
              </div>

              {/* Form */}
              {showForm && (
                <RuleForm
                  initial={editingRule}
                  onSave={handleSave}
                  onCancel={() => { setShowForm(false); setEditingRule(null); }}
                />
              )}

              {/* Rules list */}
              {loading ? (
                <div className="space-y-2">
                  {[1,2].map(i => <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />)}
                </div>
              ) : rules.length === 0 ? (
                <div className="text-center py-8 text-[#8898AA]">
                  <Zap className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No rules defined yet.</p>
                  <p className="text-xs mt-1">Add your first rule to automate refund decisions.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {rules.map(rule => (
                    <RuleCard key={rule.id} rule={rule}
                      onToggle={handleToggle}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}