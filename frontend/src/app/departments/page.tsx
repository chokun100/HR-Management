'use client';
import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import Modal from '@/components/Modal';
import { api } from '@/lib/api';
import { Department } from "@/types";
import { Plus, PencilSimple, Trash, Buildings } from '@phosphor-icons/react';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const load = () => {
    setLoading(true);
    api.get('/departments').then(setDepartments).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ name: '', description: '' }); setShowModal(true); };

  const openEdit = (d: Department) => {
    setEditing(d);
    setForm({ name: d.name || '', description: d.description || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) await api.put(`/departments/${editing.id}`, form);
    else await api.post('/departments', form);
    setShowModal(false);
    load();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this department?')) { await api.delete(`/departments/${id}`); load(); }
  };

  return (
    <AppLayout>
      <div className="page-header page-header-actions">
        <div><h2>Departments</h2><p>Manage organizational departments</p></div>
        <button className="btn btn-primary" onClick={openCreate}><Plus weight="bold" /> Add department</button>
      </div>

      <div className="table-wrapper">
        <div className="table-header"><h3>All departments ({departments.length})</h3></div>
        {loading ? (
          <div className="skeleton">
            <div className="skeleton-row" />
            <div className="skeleton-row" />
            <div className="skeleton-row" />
          </div>
        ) : departments.length === 0 ? (
          <div className="empty-state"><Buildings size={32} className="text-muted" /><h3>No departments</h3><p>Create your first department to get started</p></div>
        ) : (
          <table>
            <thead><tr><th>Name</th><th>Description</th><th>Actions</th></tr></thead>
            <tbody>
              {departments.map((d) => (
                <tr key={d.id}>
                  <td className="font-semibold text-primary">{d.name}</td>
                  <td>{d.description || '-'}</td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(d)} aria-label="Edit department"><PencilSimple size={16} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d.id)} aria-label="Delete department"><Trash size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit department' : 'Add department'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="dept-name">Department name *</label>
            <input id="dept-name" className="form-control" placeholder="e.g. Engineering" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label htmlFor="dept-desc">Description</label>
            <input id="dept-desc" className="form-control" placeholder="Brief description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
