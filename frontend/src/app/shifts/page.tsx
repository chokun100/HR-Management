'use client';
import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import Modal from '@/components/Modal';
import { api } from '@/lib/api';
import { Shift } from "@/types";

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[][]>([]);
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
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add Shift</button>
      </div>

      <div className="table-wrapper">
        <div className="table-header"><h3>Shift Schedules ({shifts.length})</h3></div>
        {loading ? <div className="loading-spinner"><div className="spinner"/></div> : shifts.length === 0 ? (
          <div className="empty-state"><div className="icon">⏱️</div><h3>No shifts</h3></div>
        ) : (
          <table>
            <thead><tr><th>Name</th><th>Start Time</th><th>End Time</th><th>Break (Mins)</th><th>Description</th><th>Actions</th></tr></thead>
            <tbody>
              {shifts.map(s => (
                <tr key={s.id}>
                  <td style={{fontWeight:600}}>{s.name}</td>
                  <td>{s.startTime}</td>
                  <td>{s.endTime}</td>
                  <td>{s.breakMinutes}</td>
                  <td>{s.description || '-'}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Shift">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Shift Name *</label>
            <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Morning Shift" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Start Time *</label>
              <input type="time" className="form-control" required value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
            </div>
            <div className="form-group">
              <label>End Time *</label>
              <input type="time" className="form-control" required value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label>Break Time (Minutes) *</label>
            <input type="number" className="form-control" required value={formData.breakMinutes} onChange={e => setFormData({...formData, breakMinutes: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input type="text" className="form-control" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Shift</button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
