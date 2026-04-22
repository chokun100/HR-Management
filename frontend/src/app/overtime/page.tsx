'use client';
import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import Modal from '@/components/Modal';
import { api } from '@/lib/api';
import { OvertimeRecord, Employee } from "@/types";
import { Timer } from "lucide-react";

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
      case 'rest_day': return 'Rest Day (2.0x)';
      case 'rest_day_ot': return 'Rest Day OT (3.0x)';
      case 'holiday': return 'Holiday (2.0x)';
      case 'holiday_ot': return 'Holiday OT (3.0x)';
      default: return type;
    }
  };

  return (
    <AppLayout>
      <div className="page-header page-header-actions">
        <div><h2>Overtime (OT)</h2><p>Manage employee overtime and premium pay</p></div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add OT</button>
      </div>

      <div className="table-wrapper">
        <div className="table-header"><h3>OT Records ({records.length})</h3></div>
        {loading ? <div className="loading-spinner"><div className="spinner"/></div> : records.length === 0 ? (
          <div className="empty-state"><div className="icon" aria-hidden="true">⌛</div><h3>No OT records</h3></div>
        ) : (
          <table>
            <thead><tr><th>Employee</th><th>Date</th><th>Hours</th><th>Type</th><th>Rate</th><th>Amount (฿)</th><th>Note</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {records.map(r => (
                <tr key={r.id}>
                  <td style={{fontWeight:600}}>{r.employee?.firstName} {r.employee?.lastName}</td>
                  <td>{r.date}</td>
                  <td>{r.hours} hrs</td>
                  <td>{getOtTypeLabel(r.type)}</td>
                  <td>{r.rate}x</td>
                  <td style={{color:'var(--success)', fontWeight:700}}>฿{Number(r.amount).toLocaleString()}</td>
                  <td>{r.note || '-'}</td>
                  <td><span className={`badge badge-${r.approved ? 'active' : 'warning'}`}>{r.approved ? 'Approved' : 'Pending'}</span></td>
                  <td>
                    {!r.approved && <button className="btn btn-success btn-sm" onClick={() => handleApprove(r.id)} aria-label="Approve record">Approve</button>}
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)} aria-label="Delete record">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add OT Record">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="otEmployee">Employee *</label>
            <select id="otEmployee" className="form-control" required value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})}>
              <option value="">-- Select --</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.employeeCode} - {e.firstName} {e.lastName}</option>)}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="otDate">Date *</label>
              <input id="otDate" type="date" className="form-control" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div className="form-group">
              <label htmlFor="otHours">Hours *</label>
              <input id="otHours" type="number" step="0.5" min="0.5" className="form-control" required value={formData.hours} onChange={e => setFormData({...formData, hours: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="otType">OT Type (Rate) *</label>
            <select id="otType" className="form-control" required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
              <option value="normal">Normal Working Day (1.5x)</option>
              <option value="rest_day">Rest Day - Normal Hours (2.0x)</option>
              <option value="rest_day_ot">Rest Day - Overtime (3.0x)</option>
              <option value="holiday">Public Holiday - Normal Hours (2.0x)</option>
              <option value="holiday_ot">Public Holiday - Overtime (3.0x)</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="otNote">Note</label>
            <input id="otNote" type="text" className="form-control" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} />
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
