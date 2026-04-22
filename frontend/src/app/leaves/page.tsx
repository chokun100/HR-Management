'use client';
import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import Modal from '@/components/Modal';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { LeaveRequest, Employee } from "@/types";
import { Plus, Check, X, CalendarBlank } from '@phosphor-icons/react';

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('');
  const { user } = useAuth();
  const [form, setForm] = useState({ employeeId: '', type: 'vacation', startDate: '', endDate: '', reason: '' });

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get(`/leaves${filter ? `?status=${filter}` : ''}`),
      api.get('/employees'),
    ]).then(([l, e]) => { setLeaves(l); setEmployees(e); }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/leaves', { ...form, employeeId: Number(form.employeeId) });
    setShowModal(false);
    load();
  };

  const handleApprove = async (id: number) => {
    await api.put(`/leaves/${id}/approve`, { approvedBy: user?.username || 'admin' });
    load();
  };

  const handleReject = async (id: number) => {
    await api.put(`/leaves/${id}/reject`, { approvedBy: user?.username || 'admin' });
    load();
  };

  const typeLabels: Record<string, string> = { sick: 'Sick', vacation: 'Vacation', personal: 'Personal', maternity: 'Maternity', other: 'Other' };

  return (
    <AppLayout>
      <div className="page-header page-header-actions">
        <div><h2>Leave requests</h2><p>Manage employee leave requests</p></div>
        <button className="btn btn-primary" onClick={() => { setForm({ employeeId: '', type: 'vacation', startDate: '', endDate: '', reason: '' }); setShowModal(true); }}><Plus weight="bold" /> New request</button>
      </div>

      <div className="filter-bar" style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['', 'pending', 'approved', 'rejected'].map(s => (
          <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(s)}>
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="table-wrapper">
        <div className="table-header"><h3>Leave requests ({leaves.length})</h3></div>
        {loading ? (
          <div className="skeleton">
            <div className="skeleton-row" />
            <div className="skeleton-row" />
            <div className="skeleton-row" />
          </div>
        ) : leaves.length === 0 ? (
          <div className="empty-state"><CalendarBlank size={32} className="text-muted" /><h3>No leave requests</h3><p>Create a leave request to get started</p></div>
        ) : (
          <table>
            <thead><tr><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {leaves.map((l) => (
                <tr key={l.id}>
                  <td className="font-semibold text-primary">{l.employee?.firstName} {l.employee?.lastName}</td>
                  <td>{typeLabels[l.leaveType] || l.leaveType}</td>
                  <td>{l.startDate}</td>
                  <td>{l.endDate}</td>
                  <td>{l.reason || '-'}</td>
                  <td><span className={`badge badge-${l.status}`}>{l.status}</span></td>
                  <td>
                    {l.status === 'pending' && (
                      <div className="btn-group">
                        <button className="btn btn-success btn-sm" onClick={() => handleApprove(l.id)} aria-label="Approve leave"><Check size={16} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleReject(l.id)} aria-label="Reject leave"><X size={16} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New leave request">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="leave-employee">Employee *</label>
            <select id="leave-employee" className="form-control" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required>
              <option value="">-- Select employee --</option>
              {employees.map((emp: Employee) => <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="leave-type">Leave type *</label>
            <select id="leave-type" className="form-control" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="vacation">Vacation</option>
              <option value="sick">Sick leave</option>
              <option value="personal">Personal</option>
              <option value="maternity">Maternity</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="leave-start">Start date *</label>
              <input id="leave-start" type="date" className="form-control" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
            </div>
            <div className="form-group">
              <label htmlFor="leave-end">End date *</label>
              <input id="leave-end" type="date" className="form-control" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="leave-reason">Reason</label>
            <input id="leave-reason" className="form-control" placeholder="Reason for leave" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Submit request</button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
