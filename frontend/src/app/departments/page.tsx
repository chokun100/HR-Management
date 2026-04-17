'use client';
import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import Modal from '@/components/Modal';
import { api } from '@/lib/api';
import { Department } from "@/types";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[][]>([]);
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
        <button className="btn btn-primary" onClick={openCreate}>+ Add Department</button>
      </div>

      <div className="table-wrapper">
        <div className="table-header"><h3>All Departments ({departments.length})</h3></div>
        {loading ? <div className="loading-spinner"><div className="spinner" /></div> : departments.length === 0 ? (
          <div className="empty-state"><div className="icon">🏢</div><h3>No departments</h3><p>Create your first department</p></div>
        ) : (
          <table>
            <thead><tr><th>Name</th><th>Description</th><th>Employees</th><th>Actions</th></tr></thead>
            <tbody>
              {departments.map((d) => (
                <tr key={d.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{d.name}</td>
                  <td>{d.description || '-'}</td>
                  <td><span className="badge badge-active">{d.employees?.length || 0} members</span></td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(d)}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Department' : 'Add Department'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Department Name *</label>
            <input className="form-control" placeholder="e.g. Engineering" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input className="form-control" placeholder="Brief description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
