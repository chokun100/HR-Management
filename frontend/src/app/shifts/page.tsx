'use client';
import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import Modal from '@/components/Modal';
import { api } from '@/lib/api';
import { Shift } from "@/types";
import { Plus, Trash, Clock } from '@phosphor-icons/react';

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const [formData, setFormData] = useState({ name: '', startTime: '08:00', endTime: '17:00', breakMinutes: '60', description: '' });

  const loadData = async () => {
    setLoading(true);
    api.get('/shifts').then(setShifts).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/shifts', { ...formData, breakMinutes: Number(formData.breakMinutes) });
      setShowAdd(false);
      loadData();
      setFormData({ name: '', startTime: '08:00', endTime: '17:00', breakMinutes: '60', description: '' });
    } catch (err: unknown) { alert((err as Error).message); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this shift?')) return;
    await api.delete(`/shifts/${id}`);
    loadData();
  };

  return (
    <AppLayout>
      <div className="page-header page-header-actions">
        <div><h2>Shifts</h2><p>Manage working hour schedules</p></div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Plus weight="bold" /> Add shift</button>
      </div>

      <div className="table-wrapper">
        <div className="table-header"><h3>Shift schedules ({shifts.length})</h3></div>
        {loading ? (
          <div className="skeleton">
            <div className="skeleton-row" />
            <div className="skeleton-row" />
            <div className="skeleton-row" />
          </div>
        ) : shifts.length === 0 ? (
          <div className="empty-state"><Clock size={32} className="text-muted" /><h3>No shifts</h3><p>Add a shift schedule to get started</p></div>
        ) : (
          <table>
            <thead><tr><th>Name</th><th>Start time</th><th>End time</th><th>Break (mins)</th><th>Description</th><th>Actions</th></tr></thead>
            <tbody>
              {shifts.map(s => (
                <tr key={s.id}>
                  <td className="font-semibold">{s.name}</td>
                  <td>{s.startTime}</td>
                  <td>{s.endTime}</td>
                  <td>{s.breakMinutes}</td>
                  <td>{s.description || '-'}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)} aria-label="Delete shift"><Trash size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add shift">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="shift-name">Shift name *</label>
            <input id="shift-name" type="text" className="form-control" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Morning shift" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="shift-start">Start time *</label>
              <input id="shift-start" type="time" className="form-control" required value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
            </div>
            <div className="form-group">
              <label htmlFor="shift-end">End time *</label>
              <input id="shift-end" type="time" className="form-control" required value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="shift-break">Break time (minutes) *</label>
            <input id="shift-break" type="number" className="form-control" required value={formData.breakMinutes} onChange={e => setFormData({...formData, breakMinutes: e.target.value})} />
          </div>
          <div className="form-group">
            <label htmlFor="shift-desc">Description</label>
            <input id="shift-desc" type="text" className="form-control" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create shift</button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
