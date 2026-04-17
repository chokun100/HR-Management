'use client';
import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import Modal from '@/components/Modal';
import { api } from '@/lib/api';
import { Position } from "@/types";

export default function PositionsPage() {
  const [positions, setPositions] = useState<Position[][]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Position | null>(null);
  const [form, setForm] = useState({ title: '', description: '', minSalary: '', maxSalary: '' });

  const load = () => {
    setLoading(true);
    api.get('/positions').then(setPositions).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ title: '', description: '', minSalary: '', maxSalary: '' }); setShowModal(true); };

  const openEdit = (p: Position) => {
    setEditing(p);
    setForm({ title: p.title || '', description: p.description || '', minSalary: p.minSalary?.toString() || '', maxSalary: p.maxSalary?.toString() || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, minSalary: Number(form.minSalary) || 0, maxSalary: Number(form.maxSalary) || 0 };
    if (editing) await api.put(`/positions/${editing.id}`, data);
    else await api.post('/positions', data);
    setShowModal(false);
    load();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this position?')) { await api.delete(`/positions/${id}`); load(); }
  };

  return (
    <AppLayout>
      <div className="page-header page-header-actions">
        <div><h2>Positions</h2><p>Manage job titles and salary ranges</p></div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Position</button>
      </div>

      <div className="table-wrapper">
        <div className="table-header"><h3>All Positions ({positions.length})</h3></div>
        {loading ? <div className="loading-spinner"><div className="spinner" /></div> : positions.length === 0 ? (
          <div className="empty-state"><div className="icon">💼</div><h3>No positions</h3><p>Create your first position</p></div>
        ) : (
          <table>
            <thead><tr><th>Title</th><th>Description</th><th>Salary Range</th><th>Employees</th><th>Actions</th></tr></thead>
            <tbody>
              {positions.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.title}</td>
                  <td>{p.description || '-'}</td>
                  <td>฿{Number(p.minSalary).toLocaleString()} - ฿{Number(p.maxSalary).toLocaleString()}</td>
                  <td><span className="badge badge-active">{p.employees?.length || 0}</span></td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Position' : 'Add Position'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Job Title *</label>
            <input className="form-control" placeholder="e.g. Software Engineer" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input className="form-control" placeholder="Brief description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Min Salary (฿)</label>
              <input type="number" className="form-control" placeholder="15000" value={form.minSalary} onChange={(e) => setForm({ ...form, minSalary: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Max Salary (฿)</label>
              <input type="number" className="form-control" placeholder="50000" value={form.maxSalary} onChange={(e) => setForm({ ...form, maxSalary: e.target.value })} />
            </div>
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
