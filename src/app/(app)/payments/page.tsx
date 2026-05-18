'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { DollarSign, Plus, AlertCircle, TrendingUp, Package, Trash2, Pencil } from 'lucide-react';
import { formatDate, formatAUD, getInitials, getAgeGroupColor, todayISO } from '@/lib/utils';
import { PaymentType, PaymentMethod, Student, Payment } from '@/lib/types';
import Modal from '@/components/ui/Modal';

const PAYMENT_TYPES: PaymentType[] = ['Single', '4-Pack', '8-Pack', 'Custom'];
const PAYMENT_METHODS: PaymentMethod[] = ['Cash', 'Bank Transfer', 'Other'];

interface PaymentForm {
  studentId: string;
  type: PaymentType;
  amount: number;
  method: PaymentMethod;
  date: string;
  notes: string;
  classesTotal: number;
  classesRemaining?: number;
}

const getStudentDefaults = (student: Student | undefined, settings: { priceSingle: number; price4Pack: number; price8Pack: number }) => {
  return {
    Single: { amount: student?.priceSingle ?? settings.priceSingle, classes: 1 },
    '4-Pack': { amount: student?.price4Pack ?? settings.price4Pack, classes: 4 },
    '8-Pack': { amount: student?.price8Pack ?? settings.price8Pack, classes: 8 },
    Custom: { amount: 0, classes: 1 },
  };
};

const emptyForm = (): PaymentForm => ({
  studentId: '',
  type: 'Single',
  amount: 0,
  method: 'Cash',
  date: todayISO(),
  notes: '',
  classesTotal: 1,
});

export default function PaymentsPage() {
  const { students, payments, settings, addPayment, updatePayment, deletePayment } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<PaymentForm>(emptyForm());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterStudent, setFilterStudent] = useState('');
  const [editPayment, setEditPayment] = useState<Payment | null>(null);
  const [editForm, setEditForm] = useState<PaymentForm>(emptyForm());

  const totalCollected = payments.reduce((s, p) => s + p.amount, 0);
  const activePacks = payments.filter((p) => p.classesRemaining > 0);
  const totalClassesRemaining = activePacks.reduce((s, p) => s + p.classesRemaining, 0);

  const filtered = payments
    .filter((p) => !filterStudent || p.studentId === filterStudent)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleStudentChange = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    const defaults = getStudentDefaults(student, settings);
    const typeDefault = defaults[form.type as keyof typeof defaults] || defaults['Single'];
    setForm((f) => ({ ...f, studentId, amount: typeDefault.amount, classesTotal: typeDefault.classes }));
  };

  const handleTypeChange = (type: PaymentType) => {
    const student = students.find((s) => s.id === form.studentId);
    const defaults = getStudentDefaults(student, settings);
    const typeDefault = defaults[type as keyof typeof defaults];
    setForm((f) => ({ ...f, type, amount: typeDefault.amount, classesTotal: typeDefault.classes }));
  };

  const isCustomRate = (student: Student | undefined) => {
    if (!student) return false;
    return student.priceSingle !== undefined || student.price4Pack !== undefined || student.price8Pack !== undefined;
  };

  const handleSubmit = () => {
    if (!form.studentId) return;
    addPayment({ ...form, classesRemaining: form.classesTotal });
    setForm(emptyForm());
    setShowModal(false);
  };

  const openEditPayment = (p: Payment) => {
    setEditPayment(p);
    setEditForm({
      studentId: p.studentId,
      type: p.type,
      amount: p.amount,
      method: p.method,
      date: p.date,
      notes: p.notes,
      classesTotal: p.classesTotal,
      classesRemaining: p.classesRemaining,
    });
  };

  const handleEditSave = () => {
    if (!editPayment) return;
    updatePayment(editPayment.id, {
      studentId: editForm.studentId,
      type: editForm.type,
      amount: editForm.amount,
      method: editForm.method,
      date: editForm.date,
      notes: editForm.notes,
      classesTotal: editForm.classesTotal,
      classesRemaining: Math.min(editForm.classesRemaining ?? editPayment.classesRemaining, editForm.classesTotal),
    });
    setEditPayment(null);
  };

  const handleUseClass = (paymentId: string, current: number) => {
    if (current <= 0) return;
    updatePayment(paymentId, { classesRemaining: current - 1 });
  };

  const inputCls = 'w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors';
  const selectCls = 'w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C] transition-colors';
  const labelCls = 'block text-xs text-[#888888] mb-1.5 font-medium';

  const selectedStudent = students.find((s) => s.id === form.studentId);
  const studentDefaults = selectedStudent ? getStudentDefaults(selectedStudent, settings) : null;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Payments</h1>
          <p className="text-[#888888] text-sm mt-0.5">{payments.length} payment{payments.length !== 1 ? 's' : ''} recorded</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#C9A84C] text-black rounded-lg font-semibold text-sm hover:bg-[#d4b56a] transition-colors"
        >
          <Plus className="w-4 h-4" /> Record Payment
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#27AE60]" />
            <span className="text-xs text-[#888888]">Total Collected</span>
          </div>
          <div className="text-2xl font-bold text-white">{formatAUD(totalCollected)}</div>
          <div className="text-xs text-[#555555] mt-1">AUD all time</div>
        </div>
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-[#9B59B6]" />
            <span className="text-xs text-[#888888]">Active Packs</span>
          </div>
          <div className="text-2xl font-bold text-white">{activePacks.length}</div>
          <div className="text-xs text-[#555555] mt-1">{totalClassesRemaining} classes remaining</div>
        </div>
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-[#C9A84C]" />
            <span className="text-xs text-[#888888]">Pre-paid Balance</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {formatAUD(activePacks.reduce((s, p) => s + (p.amount / p.classesTotal) * p.classesRemaining, 0))}
          </div>
          <div className="text-xs text-[#555555] mt-1">credit on account</div>
        </div>
      </div>

      {/* Pack tracker */}
      {activePacks.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-[#888888] uppercase tracking-wider mb-3">Pack Tracker</h2>
          <div className="grid gap-3">
            {activePacks.map((pack) => {
              const student = students.find((s) => s.id === pack.studentId);
              const pct = (pack.classesRemaining / pack.classesTotal) * 100;
              const isLow = pack.classesRemaining === 1;
              return (
                <div key={pack.id} className={`bg-[#111111] border rounded-xl p-4 ${isLow ? 'border-yellow-500/40' : 'border-[#2a2a2a]'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: getAgeGroupColor(student?.ageGroup || '') }}
                    >
                      {getInitials(student?.name || '?')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white text-sm">{student?.name}</span>
                        {isLow && (
                          <span className="flex items-center gap-1 text-xs text-yellow-400">
                            <AlertCircle className="w-3 h-3" /> Low
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#888888]">{pack.type} · {formatAUD(pack.amount)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-white">{pack.classesRemaining}</span>
                      <span className="text-xs text-[#555555]">/{pack.classesTotal}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: isLow ? '#F59E0B' : '#C9A84C' }}
                    />
                  </div>
                  <button
                    onClick={() => handleUseClass(pack.id, pack.classesRemaining)}
                    className="text-xs text-[#888888] hover:text-white transition-colors"
                  >
                    − Use 1 class
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="mb-4">
        <select
          value={filterStudent}
          onChange={(e) => setFilterStudent(e.target.value)}
          className="bg-[#111111] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
        >
          <option value="">All Students</option>
          {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {/* Payment table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <DollarSign className="w-16 h-16 text-[#2a2a2a] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No payments yet</h3>
          <p className="text-[#555555] text-sm mb-6">Record your first payment to start tracking</p>
          <button onClick={() => setShowModal(true)} className="px-5 py-2.5 bg-[#C9A84C] text-black rounded-lg font-semibold text-sm hover:bg-[#d4b56a]">
            + Record Payment
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => {
            const student = students.find((s) => s.id === p.studentId);
            return (
              <div key={p.id} className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: getAgeGroupColor(student?.ageGroup || '') }}
                >
                  {getInitials(student?.name || '?')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-white text-sm">{student?.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20">{p.type}</span>
                    {isCustomRate(student) && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">Custom rate</span>
                    )}
                  </div>
                  <p className="text-xs text-[#888888] mt-0.5">
                    {formatDate(p.date)} · {p.method} · {p.classesRemaining}/{p.classesTotal} classes left
                  </p>
                  {p.notes && <p className="text-xs text-[#555555] mt-0.5">{p.notes}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-bold text-white">{formatAUD(p.amount)}</div>
                  <div className="text-xs text-[#555555]">AUD</div>
                </div>
                <button
                  onClick={() => openEditPayment(p)}
                  className="p-1.5 text-[#555555] hover:text-[#C9A84C] hover:bg-[#C9A84C]/10 rounded-lg transition-colors ml-1 flex-shrink-0"
                  title="Edit payment"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteId(p.id)}
                  className="p-1.5 text-[#555555] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                  title="Delete payment"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Record payment modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setForm(emptyForm()); }}
        title="Record Payment"
        size="md"
        footer={
          <>
            <button onClick={() => { setShowModal(false); setForm(emptyForm()); }} className="px-4 py-2 text-sm text-[#888888] hover:text-white">Cancel</button>
            <button
              onClick={handleSubmit}
              disabled={!form.studentId}
              className="px-5 py-2 bg-[#C9A84C] text-black rounded-lg font-semibold text-sm hover:bg-[#d4b56a] disabled:opacity-50"
            >
              Record Payment
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Student *</label>
            <select
              className={selectCls}
              value={form.studentId}
              onChange={(e) => handleStudentChange(e.target.value)}
            >
              <option value="">Select student...</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          {/* Show student's custom rates if applicable */}
          {selectedStudent && isCustomRate(selectedStudent) && (
            <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg px-3 py-2.5">
              <p className="text-xs text-purple-400 font-medium mb-1">Custom rates for {selectedStudent.name}</p>
              <div className="flex gap-3 text-xs text-[#888888]">
                {selectedStudent.priceSingle && <span>Single: {formatAUD(selectedStudent.priceSingle)}</span>}
                {selectedStudent.price4Pack && <span>4-Pack: {formatAUD(selectedStudent.price4Pack)}</span>}
                {selectedStudent.price8Pack && <span>8-Pack: {formatAUD(selectedStudent.price8Pack)}</span>}
              </div>
            </div>
          )}

          <div>
            <label className={labelCls}>Payment Type</label>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_TYPES.map((t) => {
                const def = studentDefaults?.[t as keyof typeof studentDefaults];
                return (
                  <button
                    key={t}
                    onClick={() => handleTypeChange(t)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-colors text-left ${
                      form.type === t ? 'bg-[#C9A84C]/20 border-[#C9A84C]/50 text-[#C9A84C]' : 'bg-[#0a0a0a] border-[#2a2a2a] text-[#888888] hover:text-white'
                    }`}
                  >
                    <div>{t}</div>
                    {def && def.amount > 0 && <div className="text-xs opacity-70">{formatAUD(def.amount)}</div>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Amount (AUD) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888] text-sm">$</span>
                <input
                  type="number"
                  className={`${inputCls} pl-6`}
                  value={form.amount}
                  onChange={(e) => setForm((f) => ({ ...f, amount: parseFloat(e.target.value) || 0 }))}
                  min={0}
                  step={5}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Classes in Pack</label>
              <input
                type="number"
                className={inputCls}
                value={form.classesTotal}
                onChange={(e) => setForm((f) => ({ ...f, classesTotal: parseInt(e.target.value) || 1 }))}
                min={1}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Payment Method</label>
              <select className={selectCls} value={form.method} onChange={(e) => setForm((f) => ({ ...f, method: e.target.value as PaymentMethod }))}>
                {PAYMENT_METHODS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Date</label>
              <input type="date" className={inputCls} value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Notes (optional)</label>
            <input
              className={inputCls}
              placeholder="e.g. Paid cash for first class"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </div>
        </div>
      </Modal>

      {/* Edit payment modal */}
      <Modal
        isOpen={!!editPayment}
        onClose={() => setEditPayment(null)}
        title="Edit Payment"
        size="md"
        footer={
          <>
            <button onClick={() => setEditPayment(null)} className="px-4 py-2 text-sm text-[#888888] hover:text-white">Cancel</button>
            <button onClick={handleEditSave} className="px-5 py-2 bg-[#C9A84C] text-black rounded-lg font-semibold text-sm hover:bg-[#d4b56a]">Save Changes</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Student</label>
            <select className={selectCls} value={editForm.studentId} onChange={(e) => setEditForm((f) => ({ ...f, studentId: e.target.value }))}>
              <option value="">Select student...</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Payment Type</label>
              <select className={selectCls} value={editForm.type} onChange={(e) => setEditForm((f) => ({ ...f, type: e.target.value as PaymentType }))}>
                {PAYMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Method</label>
              <select className={selectCls} value={editForm.method} onChange={(e) => setEditForm((f) => ({ ...f, method: e.target.value as PaymentMethod }))}>
                {PAYMENT_METHODS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Amount (AUD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888] text-sm">$</span>
                <input type="number" className={`${inputCls} pl-6`} value={editForm.amount} onChange={(e) => setEditForm((f) => ({ ...f, amount: parseFloat(e.target.value) || 0 }))} min={0} step={5} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Classes in Pack</label>
              <input type="number" className={inputCls} value={editForm.classesTotal} onChange={(e) => setEditForm((f) => ({ ...f, classesTotal: parseInt(e.target.value) || 1 }))} min={1} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Classes remaining</label>
            <input type="number" className={inputCls}
              value={editForm.classesRemaining ?? 0}
              onChange={(e) => setEditForm((f) => ({ ...f, classesRemaining: parseInt(e.target.value) || 0 }))}
              min={0} max={editForm.classesTotal}
            />
          </div>
          <div>
            <label className={labelCls}>Date</label>
            <input type="date" className={inputCls} value={editForm.date} onChange={(e) => setEditForm((f) => ({ ...f, date: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>Notes</label>
            <input className={inputCls} value={editForm.notes} onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Notes about this payment..." />
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Remove Payment?"
        size="sm"
        footer={
          <>
            <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-[#888888] hover:text-white">Cancel</button>
            <button
              onClick={() => { if (deleteId) { deletePayment(deleteId); setDeleteId(null); } }}
              className="px-5 py-2 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600"
            >
              Remove
            </button>
          </>
        }
      >
        <p className="text-[#888888] text-sm">This payment record will be permanently removed.</p>
      </Modal>
    </div>
  );
}
