'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { exportAllData, importAllData, clearAllStorage, getStorage, setStorage } from '@/lib/storage';
import { Settings, Download, Upload, AlertTriangle, Save, RefreshCw, Lock, Users, Eye, EyeOff, Cloud, CloudOff } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/contexts/ToastContext';
import { AuthStore } from '@/lib/types';
import { isCloudEnabled, cloudResync } from '@/lib/cloud';

const DEFAULT_AUTH: AuthStore = { teacher: { username: 'teacher', password: 'ruvel2024' } };

export default function SettingsPage() {
  const { settings, updateSettings, students, updateStudent } = useApp();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    teacherName: settings.teacherName,
    studioName: settings.studioName,
    location: settings.location,
    currency: settings.currency,
    priceSingle: String(settings.priceSingle),
    price4Pack: String(settings.price4Pack),
    price8Pack: String(settings.price8Pack),
  });
  const [resetModal, setResetModal] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');
  // Auth state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [editingPinStudentId, setEditingPinStudentId] = useState<string | null>(null);
  const [newPin, setNewPin] = useState('');

  const handleSave = () => {
    updateSettings({
      teacherName: form.teacherName,
      studioName: form.studioName,
      location: form.location,
      currency: form.currency,
      priceSingle: parseFloat(form.priceSingle) || 40,
      price4Pack: parseFloat(form.price4Pack) || 140,
      price8Pack: parseFloat(form.price8Pack) || 260,
    });
  };

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ruvel-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported successfully!', 'success');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          importAllData(ev.target?.result as string);
          showToast('Data imported! Refresh the page to load.', 'success');
          setTimeout(() => window.location.reload(), 1500);
        } catch {
          showToast('Failed to import — invalid file', 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleReset = () => {
    if (resetConfirmText !== 'RESET') return;
    clearAllStorage();
    showToast('All data cleared. Reloading...', 'info');
    setTimeout(() => window.location.reload(), 1500);
  };

  const handleChangePassword = () => {
    if (!newPassword || newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    const auth = getStorage<AuthStore>('auth', DEFAULT_AUTH);
    setStorage('auth', { ...auth, teacher: { ...auth.teacher, password: newPassword } });
    setNewPassword('');
    setConfirmPassword('');
    showToast('Password updated!', 'success');
  };

  const handleUpdatePin = (studentId: string) => {
    if (!/^\d{4}$/.test(newPin)) {
      showToast('PIN must be exactly 4 digits', 'error');
      return;
    }
    updateStudent(studentId, { pin: newPin });
    setEditingPinStudentId(null);
    setNewPin('');
    showToast('PIN updated!', 'success');
  };

  const handleUpdateUsername = (studentId: string, username: string) => {
    updateStudent(studentId, { username });
    showToast('Username updated!', 'success');
  };

  const inputCls = 'w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors';
  const labelCls = 'block text-xs text-[#888888] mb-1.5 font-medium';
  const sectionCls = 'bg-[#111111] border border-[#2a2a2a] rounded-xl p-5 mb-4';

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-[#888888] text-sm mt-0.5">Configure your studio preferences</p>
      </div>

      {/* Sync status */}
      <div className={sectionCls}>
        <h2 className="font-semibold text-white flex items-center gap-2 mb-3">
          {isCloudEnabled() ? <Cloud className="w-4 h-4 text-emerald-400" /> : <CloudOff className="w-4 h-4 text-[#888]" />}
          Sincronización entre dispositivos
        </h2>
        {isCloudEnabled() ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <p className="text-sm text-emerald-300 font-medium">Activa</p>
            </div>
            <p className="text-xs text-[#888] mb-3">
              Tu celular, iPad y desktop están conectados. Los cambios se sincronizan automáticamente.
              La app vuelve a buscar datos cada vez que entras a la pestaña.
            </p>
            <button
              onClick={async () => {
                await cloudResync();
                showToast('Sincronización forzada — recarga la página para ver cambios', 'success');
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1a1a1a] border border-[#2a2a2a] text-white hover:border-[#3a3a3a]"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Forzar sincronización ahora
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#888]" />
              <p className="text-sm text-[#888] font-medium">Desactivada — modo local</p>
            </div>
            <p className="text-xs text-[#888] mb-2">
              La app está funcionando solo con localStorage de este dispositivo. Para que los cambios
              se sincronicen entre celular, iPad y desktop, sigue las instrucciones en{' '}
              <code className="text-[#C9A84C]">SUPABASE_SETUP.md</code> (5 min, gratis).
            </p>
            <p className="text-xs text-[#666]">
              Tip: el archivo está en la raíz del proyecto en GitHub.
            </p>
          </div>
        )}
      </div>

      {/* Studio settings */}
      <div className={sectionCls}>
        <h2 className="font-semibold text-white flex items-center gap-2 mb-4">
          <Settings className="w-4 h-4 text-[#C9A84C]" /> Studio Profile
        </h2>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Your Name / Title</label>
            <input
              className={inputCls}
              value={form.teacherName}
              onChange={(e) => setForm({ ...form, teacherName: e.target.value })}
              placeholder="e.g. Maestro, Alex"
            />
            <p className="text-xs text-[#555555] mt-1">Shown in the dashboard greeting</p>
          </div>
          <div>
            <label className={labelCls}>Studio Name</label>
            <input
              className={inputCls}
              value={form.studioName}
              onChange={(e) => setForm({ ...form, studioName: e.target.value })}
            />
          </div>
          <div>
            <label className={labelCls}>Location</label>
            <input
              className={inputCls}
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
          <div>
            <label className={labelCls}>Currency</label>
            <input
              className={inputCls}
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className={sectionCls}>
        <h2 className="font-semibold text-white mb-4">Default Class Prices (AUD)</h2>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>Single Class</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888] text-sm">$</span>
              <input
                className={`${inputCls} pl-7`}
                type="number"
                value={form.priceSingle}
                onChange={(e) => setForm({ ...form, priceSingle: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>4-Class Pack</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888] text-sm">$</span>
              <input
                className={`${inputCls} pl-7`}
                type="number"
                value={form.price4Pack}
                onChange={(e) => setForm({ ...form, price4Pack: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>8-Class Pack</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888] text-sm">$</span>
              <input
                className={`${inputCls} pl-7`}
                type="number"
                value={form.price8Pack}
                onChange={(e) => setForm({ ...form, price8Pack: e.target.value })}
              />
            </div>
          </div>
        </div>
        <div className="mt-3 p-3 bg-[#1a1a1a] rounded-lg">
          <p className="text-xs text-[#888888]">
            Savings calculator: 4-pack saves{' '}
            <span className="text-[#C9A84C]">${Math.max(0, parseFloat(form.priceSingle) * 4 - parseFloat(form.price4Pack)).toFixed(0)}</span>
            {' '}· 8-pack saves{' '}
            <span className="text-[#C9A84C]">${Math.max(0, parseFloat(form.priceSingle) * 8 - parseFloat(form.price8Pack)).toFixed(0)}</span>
          </p>
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-6 py-3 bg-[#C9A84C] text-black rounded-xl font-bold hover:bg-[#d4b56a] transition-colors mb-6"
      >
        <Save className="w-4 h-4" /> Save Settings
      </button>

      {/* Data management */}
      <div className={sectionCls}>
        <h2 className="font-semibold text-white flex items-center gap-2 mb-4">
          <RefreshCw className="w-4 h-4 text-[#C9A84C]" /> Data Management
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
            <div>
              <p className="text-sm font-medium text-white">Export Data</p>
              <p className="text-xs text-[#888888]">Download a JSON backup of all your data</p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 bg-[#111111] border border-[#2a2a2a] text-white rounded-lg text-sm hover:border-[#C9A84C]/40 transition-colors"
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
            <div>
              <p className="text-sm font-medium text-white">Import Data</p>
              <p className="text-xs text-[#888888]">Restore from a JSON backup file</p>
            </div>
            <button
              onClick={handleImport}
              className="flex items-center gap-2 px-3 py-2 bg-[#111111] border border-[#2a2a2a] text-white rounded-lg text-sm hover:border-[#C9A84C]/40 transition-colors"
            >
              <Upload className="w-4 h-4" /> Import
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
            <div>
              <p className="text-sm font-medium text-red-400">Reset App Data</p>
              <p className="text-xs text-[#888888]">Clear everything and start fresh</p>
            </div>
            <button
              onClick={() => setResetModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm hover:bg-red-500/20 transition-colors"
            >
              <AlertTriangle className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* Auth Management */}
      <div className={sectionCls}>
        <h2 className="font-semibold text-white flex items-center gap-2 mb-4">
          <Lock className="w-4 h-4 text-[#C9A84C]" /> Login & Security
        </h2>

        {/* Teacher password */}
        <div className="mb-5">
          <p className="text-sm font-medium text-white mb-1">Teacher Password</p>
          <p className="text-xs text-[#888888] mb-3">Username: <span className="text-white font-mono">teacher</span></p>
          <div className="space-y-2">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className={inputCls}
                placeholder="New password (min 6 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555555] hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <input
              type="password"
              className={inputCls}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              onClick={handleChangePassword}
              disabled={!newPassword || !confirmPassword}
              className="px-4 py-2 bg-[#C9A84C]/20 border border-[#C9A84C]/30 text-[#C9A84C] rounded-lg text-sm font-medium hover:bg-[#C9A84C]/30 disabled:opacity-50 transition-colors"
            >
              Update Password
            </button>
          </div>
        </div>

        {/* Student PINs */}
        <div>
          <p className="text-sm font-medium text-white flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-[#888888]" /> Student Login Credentials
          </p>
          <div className="space-y-3">
            {students.map((student) => (
              <div key={student.id} className="p-3 bg-[#1a1a1a] rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white text-sm">{student.name}</span>
                  <span className="text-xs text-[#888888]">{student.ageGroup}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[10px] text-[#888888] mb-1">Username</p>
                    <input
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded px-2 py-1.5 text-white text-xs focus:outline-none focus:border-[#C9A84C]"
                      defaultValue={student.username || student.name.toLowerCase()}
                      onBlur={(e) => {
                        if (e.target.value !== student.username) {
                          handleUpdateUsername(student.id, e.target.value.toLowerCase().trim());
                        }
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#888888] mb-1">4-Digit PIN</p>
                    {editingPinStudentId === student.id ? (
                      <div className="flex gap-1">
                        <input
                          className="flex-1 bg-[#0a0a0a] border border-[#C9A84C]/50 rounded px-2 py-1.5 text-white text-xs focus:outline-none"
                          placeholder="1234"
                          maxLength={4}
                          value={newPin}
                          onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdatePin(student.id);
                            if (e.key === 'Escape') { setEditingPinStudentId(null); setNewPin(''); }
                          }}
                          autoFocus
                        />
                        <button onClick={() => handleUpdatePin(student.id)} className="px-2 py-1 bg-[#C9A84C] text-black rounded text-xs font-bold">✓</button>
                        <button onClick={() => { setEditingPinStudentId(null); setNewPin(''); }} className="px-2 py-1 bg-[#2a2a2a] text-[#888888] rounded text-xs">✕</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setEditingPinStudentId(student.id); setNewPin(''); }}
                        className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded px-2 py-1.5 text-[#888888] text-xs text-left hover:border-[#C9A84C]/30 transition-colors"
                      >
                        {student.pin ? '••••' : 'Set PIN'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#555555] mt-3">Students log in at the /login page with their username and 4-digit PIN.</p>
        </div>
      </div>

      {/* App info */}
      <div className={sectionCls}>
        <h2 className="font-semibold text-white mb-3">About</h2>
        <div className="space-y-1.5 text-sm text-[#888888]">
          <p>App: <span className="text-white">RÜVEL Piano Method</span></p>
          <p>Version: <span className="text-white">2.0.0</span></p>
          <p>Storage: <span className="text-white">Browser localStorage (ruvel_*)</span></p>
          <p>Built for: <span className="text-white">Perth, Australia</span></p>
        </div>
      </div>

      {/* Reset modal */}
      <Modal
        isOpen={resetModal}
        onClose={() => { setResetModal(false); setResetConfirmText(''); }}
        title="Reset All Data"
        size="sm"
        footer={
          <>
            <button onClick={() => { setResetModal(false); setResetConfirmText(''); }} className="px-4 py-2 text-sm text-[#888888] hover:text-white">Cancel</button>
            <button
              onClick={handleReset}
              disabled={resetConfirmText !== 'RESET'}
              className="px-5 py-2 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Wipe Everything
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400 font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> This cannot be undone!
            </p>
            <p className="text-xs text-[#888888] mt-1">All students, classes, payments, reviews, and media will be permanently deleted.</p>
          </div>
          <p className="text-sm text-[#888888]">Type <strong className="text-white">RESET</strong> to confirm:</p>
          <input
            className="w-full bg-[#0a0a0a] border border-red-500/30 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-red-500"
            placeholder="Type RESET"
            value={resetConfirmText}
            onChange={(e) => setResetConfirmText(e.target.value.toUpperCase())}
          />
        </div>
      </Modal>
    </div>
  );
}
