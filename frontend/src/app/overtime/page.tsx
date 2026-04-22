'use client';
import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import Modal from '@/components/Modal';
import { api } from '@/lib/api';
import { OvertimeRecord, Employee } from "@/types";
import { Plus, Trash, Check, Timer } from '@phosphor-icons/react';

export default function OvertimePage() {
  const [records, setRecords] = useState<OvertimeRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    hours: '1',
    type: 'normal',
    note: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [otRes, empRes] = await Promise.all([
        api.get('/overtime'),
        api.get('/employees')
      ]);
      setRecords(otRes);
      setEmployees(empRes);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/overtime', { ...formData, employeeId: Number(formData.employeeId) });
      setShowAdd(false);
      loadData();
    } catch (err: unknown) { alert((err as Error).message); }
  };

  const handleApprove = async (id: number) => {
    try {
      await api.put(`/overtime/${id}/approve`, {});
      loadData();
    } catch (err: unknown) { alert((err as Error).message); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this OT record?')) return;
    await api.delete(`/overtime/${id}`);
    loadData();
  };

  const getOtTypeLabel = (type: string) => {
    switch(type) {
      case 'normal': return 'Normal OT (1.5x)';
      case 'rest_day': return 'Rest day (2.0x)';
      case 'rest_day_ot': return 'Rest day OT (3.0x)';
      case 'holiday': return 'Holiday (2.0x)';
      case 'holiday_ot': return 'Holiday OT (3.0x)';
      default: return type;
    }
  };

  return (
    <AppLayout>
      <div className="page-header page-header-actions">
        <div><h2>Overtime (OT)</h2><p>Manage employee overtime and premium pay</p></div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Plus weight="bold" /> Add OT</button>
      </div>

      <div className="table-wrapper">
        <div className="table-header"><h3>OT records ({records.length})</h3></div>
        {loading ? (
          <div className="skeleton">
            <div className="skeleton-row" />
            <div className="skeleton-row" />
            <div className="skeleton-row" />
          </div>
        ) : records.length === 0 ? (
          <div className="empty-state"><Timer size={32} className="text-muted" /><h3>No OT records</h3><p>Add an overtime record to get started</p></div>
        ) : (
          <table>
            <thead><tr><th>Employee</th><th>Date</th><th>Hours</th><th>Type</th><th>Rate</th><th>Amount (฿)</th><th>Note</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {records.map(r => (
                <tr key={r.id}>
                  <td className="font-semibold">{r.employee?.firstName} {r.employee?.lastName}</td>
                  <td>{r.date}</td>
                  <td>{r.hours} hrs</td>
                  <td>{getOtTypeLabel(r.type)}</td>
                  <td>{r.rate}x</td>
                  <td className="text-accent font-semibold">฿{Number(r.amount).toLocaleString()}</td>
                  <td>{r.note || '-'}</td>
                  <td><span className={`badge badge-${r.approved ? 'active' : 'warning'}`}>{r.approved ? 'Approved' : 'Pending'}</span></td>
                  <td>
                    <div className="btn-group">
                      {!r.approved && <button className="btn btn-success btn-sm" onClick={() => handleApprove(r.id)} aria-label="Approve OT"><Check size={16} /></button>}
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)} aria-label="Delete OT record"><Trash size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add OT record">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="ot-employee">Employee *</label>
            <select id="ot-employee" className="form-control" required value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})}>
              <option value="">-- Select --</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.employeeCode} - {e.firstName} {e.lastName}</option>)}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ot-date">Date *</label>
              <input id="ot-date" type="date" className="form-control" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div className="form-group">
              <label htmlFor="ot-hours">Hours *</label>
              <input id="ot-hours" type="number" step="0.5" min="0.5" className="form-control" required value={formData.hours} onChange={e => setFormData({...formData, hours: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="ot-type">OT type (rate) *</label>
            <select id="ot-type" className="form-control" required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
              <option value="normal">Normal working day (1.5x)</option>
              <option value="rest_day">Rest day - normal hours (2.0x)</option>
              <option value="rest_day_ot">Rest day - overtime (3.0x)</option>
              <option value="holiday">Public holiday - normal hours (2.0x)</option>
              <option value="holiday_ot">Public holiday - overtime (3.0x)</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="ot-note">Note</label>
            <input id="ot-note" type="text" className="form-control" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save OT</button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
