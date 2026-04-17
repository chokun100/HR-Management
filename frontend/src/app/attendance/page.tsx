'use client';
import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import Modal from '@/components/Modal';
import { api } from '@/lib/api';
import { Employee } from "@/types";

export default function AttendancePage() {
  const [records, setRecords] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get(`/attendance?date=${dateFilter}`),
      api.get('/employees'),
    ]).then(([att, emp]) => { setRecords(att); setEmployees(emp); }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [dateFilter]);

  const handleClockIn = async () => {
    if (!selectedEmployee) return alert('Select an employee');
    try {
      await api.post('/attendance/clock-in', { employeeId: Number(selectedEmployee) });
      setShowModal(false);
      load();
    } catch (err: unknown) { alert((err as Error).message); }
  };

  const handleClockOut = async (employeeId: number) => {
    try {
      await api.post('/attendance/clock-out', { employeeId });
      load();
    } catch (err: unknown) { alert((err as Error).message); }
  };

  return (
    <AppLayout>
      <div className="page-header page-header-actions">
        <div><h2>Attendance</h2><p>Track employee attendance</p></div>
        <div className="btn-group">
          <input type="date" className="form-control" style={{ width: 180 }} value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
          <button className="btn btn-primary" onClick={() => { setSelectedEmployee(''); setShowModal(true); }}>⏰ Clock In</button>
        </div>
      </div>

      <div className="table-wrapper">
        <div className="table-header"><h3>Attendance for {dateFilter} ({records.length} records)</h3></div>
        {loading ? <div className="loading-spinner"><div className="spinner" /></div> : records.length === 0 ? (
          <div className="empty-state"><div className="icon">⏰</div><h3>No attendance records</h3><p>No records for this date</p></div>
        ) : (
          <table>
            <thead><tr><th>Employee</th><th>Clock In</th><th>Clock Out</th><th>Hours Worked</th><th>Actions</th></tr></thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.employee?.firstName} {r.employee?.lastName}</td>
                  <td><span className="badge badge-active">{r.clockIn || '-'}</span></td>
                  <td>{r.clockOut ? <span className="badge badge-approved">{r.clockOut}</span> : <span className="badge badge-pending">-</span>}</td>
                  <td style={{ fontWeight: 600 }}>{r.hoursWorked ? `${r.hoursWorked}h` : '-'}</td>
                  <td>
                    {!r.clockOut && (
                      <button className="btn btn-warning btn-sm" onClick={() => handleClockOut(r.employeeId)}>Clock Out</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Clock In Employee">
        <div className="form-group">
          <label>Select Employee</label>
          <select className="form-control" value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
            <option value="">-- Select Employee --</option>
            {employees.filter(e => e.status === 'active').map((emp: Employee) => (
              <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.employeeCode})</option>
            ))}
          </select>
        </div>
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleClockIn}>⏰ Clock In Now</button>
        </div>
      </Modal>
    </AppLayout>
  );
}
