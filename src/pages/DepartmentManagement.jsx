import React, { useState } from 'react';
import { Building2, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';

const EMPTY_DEPARTMENT = { name: '', description: '', userCount: 0, status: 'active' };
const INITIAL_DEPARTMENTS = [
  { id: 'dept-ops', name: 'Operations & Security', description: 'Facility operations and security governance.', userCount: 5, status: 'active' },
  { id: 'dept-quality', name: 'Quality Engineering', description: 'Inspection, validation, and engineering assurance.', userCount: 8, status: 'active' },
  { id: 'dept-compliance', name: 'Compliance & Audit', description: 'Standards, audit evidence, and policy review.', userCount: 6, status: 'active' },
  { id: 'dept-research', name: 'Research & Development', description: 'Local model and workflow experimentation.', userCount: 5, status: 'offline' },
];

export const DepartmentManagement = () => {
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState(EMPTY_DEPARTMENT);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const visibleDepartments = departments.filter((department) =>
    `${department.name} ${department.description} ${department.status}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_DEPARTMENT);
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(EMPTY_DEPARTMENT);
    setIsModalOpen(true);
  };

  const openEditModal = (department) => {
    setEditingId(department.id);
    setForm(department);
    setIsModalOpen(true);
  };

  const submit = (event) => {
    event.preventDefault();
    if (!form.name.trim()) return;

    setDepartments((current) => {
      if (editingId) {
        return current.map((item) =>
          item.id === editingId
            ? { ...item, ...form, userCount: Number(form.userCount) || 0 }
            : item
        );
      }
      return [
        ...current,
        { ...form, id: `dept-local-${Date.now()}`, userCount: Number(form.userCount) || 0 },
      ];
    });
    closeModal();
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2.5">
            <Building2 className="text-emerald-400" size={20} />
            <span>Departments</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage local organizational groups and access boundaries.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-amber-300 bg-amber-950/30 border border-amber-500/30 rounded-lg px-3 py-1.5">LOCAL MOCK DATA</span>
          <button type="button" onClick={openAddModal} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold">
            <Plus size={14} />
            <span>Add Department</span>
          </button>
        </div>
      </div>

      <div className="bg-[#0e121b] border border-slate-800 rounded-xl p-3.5">
        <div className="relative w-full sm:w-96">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search departments..." className="w-full bg-[#080a0f] border border-slate-700/60 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/40" />
        </div>
      </div>

      <div className="bg-[#0e121a] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead><tr className="bg-[#080a0f] border-b border-slate-800 text-slate-400 font-mono text-[11px]"><th className="py-3 px-4">Department Name</th><th className="py-3 px-3">Description</th><th className="py-3 px-3">User Count</th><th className="py-3 px-3">Status</th><th className="py-3 px-4 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-800/60">
              {visibleDepartments.map((department) => (
                <tr key={department.id} className="hover:bg-[#121722]">
                  <td className="py-3 px-4 font-medium text-slate-200">{department.name}</td>
                  <td className="py-3 px-3 text-slate-400">{department.description}</td>
                  <td className="py-3 px-3 font-mono text-slate-300">{department.userCount}</td>
                  <td className="py-3 px-3"><StatusBadge status={department.status} size="xs" /></td>
                  <td className="py-3 px-4"><div className="flex justify-end gap-1.5"><button type="button" onClick={() => openEditModal(department)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-800 text-slate-300 text-[11px]"><Pencil size={12} />Edit</button><button type="button" onClick={() => setDepartments((current) => current.filter((item) => item.id !== department.id))} className="p-1.5 text-slate-500 hover:text-rose-300"><Trash2 size={13} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {visibleDepartments.length === 0 && <div className="p-10 text-center text-xs font-mono text-slate-500">No departments match this search.</div>}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Edit Department' : 'Add Department'}>
        <form onSubmit={submit} className="space-y-4 text-xs font-mono">
          <label className="block text-slate-400">Department Name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1 w-full bg-[#080a0f] border border-slate-700 rounded-lg px-3 py-2 text-slate-200" /></label>
          <label className="block text-slate-400">Description<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={3} className="mt-1 w-full bg-[#080a0f] border border-slate-700 rounded-lg px-3 py-2 text-slate-200" /></label>
          <div className="grid grid-cols-2 gap-3"><label className="text-slate-400">User Count<input type="number" min="0" value={form.userCount} onChange={(event) => setForm({ ...form, userCount: event.target.value })} className="mt-1 w-full bg-[#080a0f] border border-slate-700 rounded-lg px-3 py-2 text-slate-200" /></label><label className="text-slate-400">Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="mt-1 w-full bg-[#080a0f] border border-slate-700 rounded-lg px-3 py-2 text-slate-200"><option value="active">Active</option><option value="offline">Offline</option></select></label></div>
          <div className="flex justify-end gap-2 border-t border-slate-800 pt-3"><button type="button" onClick={closeModal} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"><X size={13} />Cancel</button><button type="submit" className="px-4 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-semibold">{editingId ? 'Save Changes' : 'Add Department'}</button></div>
        </form>
      </Modal>
    </div>
  );
};

export default DepartmentManagement;
