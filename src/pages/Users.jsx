import React, { useState } from 'react';
import { Pencil, Plus, Search, Shield, Trash2, Users as UsersIcon, X } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';

const EMPTY_USER = {
  name: '',
  email: '',
  department: 'Quality Engineering',
  role: 'user',
  status: 'active',
};

const INITIAL_USERS = [
  {
    id: 'usr_admin_001',
    name: 'Dr. Evelyn Vance',
    email: 'admin@aegis.local',
    department: 'Operations & Security',
    role: 'admin',
    status: 'active',
  },
  {
    id: 'usr_operator_002',
    name: 'Marcus Chen',
    email: 'operator@aegis.local',
    department: 'Quality Engineering',
    role: 'user',
    status: 'active',
  },
  {
    id: 'usr_auditor_003',
    name: 'Priya Nair',
    email: 'priya.nair@aegis.local',
    department: 'Compliance & Audit',
    role: 'auditor',
    status: 'offline',
  },
];

export const Users = () => {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [form, setForm] = useState(EMPTY_USER);

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return [user.name, user.email, user.department, user.role, user.status]
      .join(' ')
      .toLowerCase()
      .includes(query);
  });

  const openAddModal = () => {
    setEditingUserId(null);
    setForm(EMPTY_USER);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUserId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      department: user.department,
      role: user.role,
      status: user.status,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUserId(null);
    setForm(EMPTY_USER);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;

    if (editingUserId) {
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === editingUserId ? { ...user, ...form } : user
        )
      );
    } else {
      setUsers((currentUsers) => [
        ...currentUsers,
        { id: `usr_local_${Date.now()}`, ...form },
      ]);
    }
    closeModal();
  };

  const handleDelete = (userId) => {
    setUsers((currentUsers) => currentUsers.filter((user) => user.id !== userId));
  };

  const updateField = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2.5">
            <UsersIcon className="text-sky-400" size={20} />
            <span>Users &amp; Access</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage local workbench identities, departments, and access roles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-amber-300 bg-amber-950/30 border border-amber-500/30 rounded-lg px-3 py-1.5">
            LOCAL MOCK DATA
          </span>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold shadow-glow-cyan transition-colors"
          >
            <Plus size={14} />
            <span>Add User</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0e121b] border border-slate-800 rounded-xl p-3.5">
        <div className="relative w-full sm:w-96">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by name, email, department, or role..."
            className="w-full bg-[#080a0f] border border-slate-700/60 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/40"
          />
        </div>
        <div className="text-xs font-mono text-slate-400">
          Showing <strong className="text-slate-200">{filteredUsers.length}</strong> of{' '}
          <strong className="text-slate-200">{users.length}</strong> users
        </div>
      </div>

      <div className="bg-[#0e121a] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#080a0f] border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4 font-medium">Name</th>
                <th className="py-3 px-3 font-medium">Username / Email</th>
                <th className="py-3 px-3 font-medium">Department</th>
                <th className="py-3 px-3 font-medium">Role</th>
                <th className="py-3 px-3 font-medium">Status</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#121722] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-sky-950/50 border border-sky-500/20 flex items-center justify-center text-sky-300 font-mono text-[11px]">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-200">{user.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">{user.email}</td>
                  <td className="py-3 px-3 text-slate-400">{user.department}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-sky-950/50 border border-sky-500/20 text-sky-300 font-mono text-[10px] uppercase">
                      {user.role === 'admin' && <Shield size={11} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-3"><StatusBadge status={user.status} size="xs" /></td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(user)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
                        title={`Edit ${user.name}`}
                      >
                        <Pencil size={12} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(user.id)}
                        className="p-1.5 rounded-md text-slate-500 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
                        title={`Delete ${user.name}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="p-10 text-center text-xs font-mono text-slate-500">No users match this search.</div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingUserId ? 'Edit User Access' : 'Add User'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="text-slate-400">
              Name
              <input
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                required
                className="mt-1 w-full bg-[#080a0f] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </label>
            <label className="text-slate-400">
              Username / Email
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                required
                className="mt-1 w-full bg-[#080a0f] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="text-slate-400 sm:col-span-1">
              Department
              <input
                value={form.department}
                onChange={(event) => updateField('department', event.target.value)}
                className="mt-1 w-full bg-[#080a0f] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </label>
            <label className="text-slate-400">
              Role
              <select
                value={form.role}
                onChange={(event) => updateField('role', event.target.value)}
                className="mt-1 w-full bg-[#080a0f] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="user">User</option>
                <option value="auditor">Auditor</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <label className="text-slate-400">
              Status
              <select
                value={form.status}
                onChange={(event) => updateField('status', event.target.value)}
                className="mt-1 w-full bg-[#080a0f] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="active">Active</option>
                <option value="offline">Offline</option>
                <option value="pending">Pending</option>
              </select>
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button type="button" onClick={closeModal} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
              <X size={13} />
              <span>Cancel</span>
            </button>
            <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold transition-colors">
              <span>{editingUserId ? 'Save Changes' : 'Add User'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
