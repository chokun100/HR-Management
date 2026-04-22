'use client';
import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import Modal from '@/components/Modal';
import { api } from '@/lib/api';
import { Employee, Department, Position, Shift } from "@/types";
import { PencilSimple, Trash, MagnifyingGlass, Plus, Users } from '@phosphor-icons/react';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    employeeCode: '', firstName: '', lastName: '', email: '', phone: '',
    address: '', dateOfBirth: '', hireDate: '', salary: '', departmentId: '', positionId: '', shiftId: '', status: 'active',
    nationalId: '', providentFundRate: '0', socialSecurityEnabled: true
  });

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get(`/employees${search ? `?search=${search}` : ''}`),
      api.get('/departments'),
      api.get('/positions'),
      api.get('/shifts'),
    ]).then(([emp, dept, pos, shft]) => {
      setEmployees(emp);
      setDepartments(dept);
      setPositions(pos);
      setShifts(shft);
    }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search]);

  const openCreate = () => {
    setEditing(null);
    setForm({ employeeCode: '', firstName: '', lastName: '', email: '', phone: '', address: '', dateOfBirth: '', hireDate: new Date().toISOString().split('T')[0], salary: '', departmentId: '', positionId: '', shiftId: '', status: 'active', nationalId: '', providentFundRate: '0', socialSecurityEnabled: true });
    setShowModal(true);
  };

  const openEdit = (emp: Employee) => {
    setEditing(emp);
    setForm({
      employeeCode: emp.employeeCode || '', firstName: emp.firstName || '', lastName: emp.lastName || '',
      email: emp.email || '', phone: emp.phone || '', address: emp.address || '',
      dateOfBirth: emp.dateOfBirth || '', hireDate: emp.hireDate || '', salary: emp.salary?.toString() || '',
      departmentId: emp.departmentId?.toString() || '', positionId: emp.positionId?.toString() || '', shiftId: emp.shiftId?.toString() || '', status: emp.status || 'active',
      nationalId: emp.nationalId || '', providentFundRate: emp.providentFundRate?.toString() || '0', socialSecurityEnabled: emp.socialSecurityEnabled ?? true,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, salary: Number(form.salary) || 0, departmentId: form.departmentId ? Number(form.departmentId) : null, positionId: form.positionId ? Number(form.positionId) : null, shiftId: form.shiftId ? Number(form.shiftId) : null, providentFundRate: Number(form.providentFundRate) || 0 };
    if (editing) {
      await api.put(`/employees/${editing.id}`, data);
    } else {
      await api.post('/employees', data);
    }
    setShowModal(false);
    load();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this employee? This action cannot be undone.')) {
      await api.delete(`/employees/${id}`);
      load();
    }
  };

  return (
    <AppLayout>
      <div className="page-header page-header-actions">
        <div>
          <h2>Employees</h2>
          <p>Manage your team and their details</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} weight="bold" /> Add employee
        </button>
      </div>

      <div className="table-wrapper">
        <div className="table-header">
          <h3>All employees ({employees.length})</h3>
          <div className="search-box">
            <span className="search-icon"><MagnifyingGlass size={14} /></span>
            <input placeholder="Search by name or code..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 20 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton skeleton-row" />
            ))}
          </div>
        ) : employees.length === 0 ? (
          <div className="empty-state">
            <div className="icon"><Users size={48} weight="duotone" /></div>
            <h3>No employees found</h3>
            <p>Add your first employee to start building your directory</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Position</th>
                <th>Shift</th>
                <th>Status</th>
                <th className="tabular-nums">Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td className="text-accent font-semibold">{emp.employeeCode}</td>
                  <td className="text-primary font-semibold">{emp.firstName} {emp.lastName}</td>
                  <td>{emp.email || '-'}</td>
                  <td>{emp.department?.name || '-'}</td>
                  <td>{emp.position?.title || '-'}</td>
                  <td>{emp.shift?.name || '-'}</td>
                  <td><span className={`badge badge-${emp.status}`}>{emp.status}</span></td>
                  <td className="font-semibold tabular-nums">฿{Number(emp.salary).toLocaleString()}</td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(emp)} aria-label="Edit employee">
                        <PencilSimple size={14} />
                      </button>
                      <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(emp.id)} aria-label="Delete employee">
                        <Trash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit employee' : 'Add employee'}>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Employee code *</label>
              <input className="form-control" placeholder="EMP001" value={form.employeeCode} onChange={(e) => setForm({ ...form, employeeCode: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Hire date *</label>
              <input type="date" className="form-control" value={form.hireDate} onChange={(e) => setForm({ ...form, hireDate: e.target.value })} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>First name *</label>
              <input className="form-control" placeholder="Somchai" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Last name *</label>
              <input className="form-control" placeholder="Jaidee" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="form-control" placeholder="somchai@company.co.th" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>National ID (13 digits)</label>
              <input className="form-control" placeholder="1123456789012" value={form.nationalId} onChange={(e) => setForm({ ...form, nationalId: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input className="form-control" placeholder="089-123-4567" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Department</label>
              <select className="form-control" value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })}>
                <option value="">— Select —</option>
                {departments.map((d: Department) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Position</label>
              <select className="form-control" value={form.positionId} onChange={(e) => setForm({ ...form, positionId: e.target.value })}>
                <option value="">— Select —</option>
                {positions.map((p: Position) => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Shift (working hours)</label>
              <select className="form-control" value={form.shiftId} onChange={(e) => setForm({ ...form, shiftId: e.target.value })}>
                <option value="">— No shift assigned —</option>
                {shifts.map((s: Shift) => <option key={s.id} value={s.id}>{s.name} ({s.startTime} – {s.endTime})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select className="form-control" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="on_leave">On leave</option>
                <option value="resigned">Resigned</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Salary (THB)</label>
              <input type="number" className="form-control" placeholder="30000" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Provident fund (%)</label>
              <input type="number" step="0.1" className="form-control" placeholder="5.0" value={form.providentFundRate} onChange={(e) => setForm({ ...form, providentFundRate: e.target.value })} />
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 30 }}>
              <input type="checkbox" id="socialSec" checked={form.socialSecurityEnabled} onChange={(e) => setForm({ ...form, socialSecurityEnabled: e.target.checked })} style={{ width: 20, height: 20 }} />
              <label htmlFor="socialSec" style={{ marginBottom: 0 }}>Social security (5%)</label>
            </div>
          </div>
          <div className="form-group">
            <label>Date of birth</label>
            <input type="date" className="form-control" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input className="form-control" placeholder="123 Sukhumvit Rd, Bangkok" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editing ? 'Save changes' : 'Create employee'}</button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
