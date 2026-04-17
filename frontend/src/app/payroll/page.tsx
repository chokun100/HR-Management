'use client';
import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import Modal from '@/components/Modal';
import { api } from '@/lib/api';
import { PayrollRecord } from "@/types";

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState<PayrollRecord[][]>([]);
  const [loading, setLoading] = useState(true);
  const [showGenerate, setShowGenerate] = useState(false);
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');

  const load = () => {
    setLoading(true);
    let url = '/payroll';
    const params: string[] = [];
    if (filterMonth) params.push(`month=${filterMonth}`);
    if (filterYear) params.push(`year=${filterYear}`);
    if (params.length) url += `?${params.join('&')}`;
    api.get(url).then(setPayrolls).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filterMonth, filterYear]);

  const handleGenerate = async () => {
    try {
      const result = await api.post('/payroll/generate', { month, year });
      alert(`Generated ${result.generated} payroll records`);
      setShowGenerate(false);
      load();
    } catch (err: unknown) { alert((err as Error).message); }
  };

  const handleMarkPaid = async (id: number) => {
    await api.put(`/payroll/${id}/pay`, {});
    load();
  };

  const totalNet = payrolls.reduce((s, p) => s + Number(p.netSalary), 0);

  return (
    <AppLayout>
      <div className="page-header page-header-actions">
        <div><h2>Payroll</h2><p>Manage employee salaries and payments</p></div>
        <button className="btn btn-primary" onClick={() => setShowGenerate(true)}>💰 Generate Payroll</button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <select className="form-control" style={{ width: 150 }} value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
          <option value="">All Months</option>
          {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
            <option key={m} value={m}>{new Date(2000, m - 1).toLocaleString('en', { month: 'long' })}</option>
          ))}
        </select>
        <select className="form-control" style={{ width: 120 }} value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
          <option value="">All Years</option>
          {[2024,2025,2026,2027].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        {payrolls.length > 0 && (
          <div style={{ marginLeft: 'auto', padding: '8px 16px', background: 'rgba(16,185,129,0.1)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Total Net:</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#10b981' }}>฿{totalNet.toLocaleString()}</span>
          </div>
        )}
      </div>

      <div className="table-wrapper">
        <div className="table-header"><h3>Payroll Records ({payrolls.length})</h3></div>
        {loading ? <div className="loading-spinner"><div className="spinner" /></div> : payrolls.length === 0 ? (
          <div className="empty-state"><div className="icon">💰</div><h3>No payroll records</h3><p>Generate payroll for a month</p></div>
        ) : (
          <table>
            <thead><tr><th>Employee</th><th>Period</th><th>Base Salary</th><th>Bonus</th><th>OT</th><th>Deductions</th><th>Social Sec.</th><th>Prov. Fund</th><th>Tax</th><th>Net Salary</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {payrolls.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.employee?.firstName} {p.employee?.lastName}</td>
                  <td>{p.month}/{p.year}</td>
                  <td>฿{Number(p.baseSalary).toLocaleString()}</td>
                  <td style={{ color: '#10b981' }}>+฿{Number(p.bonus).toLocaleString()}</td>
                  <td style={{ color: '#10b981' }}>+฿{Number(p.otAmount || 0).toLocaleString()}</td>
                  <td style={{ color: '#ef4444' }}>-฿{Number(p.deductions).toLocaleString()}</td>
                  <td style={{ color: '#f59e0b' }}>-฿{Number(p.socialSecurity || 0).toLocaleString()}</td>
                  <td style={{ color: '#f59e0b' }}>-฿{Number(p.providentFund || 0).toLocaleString()}</td>
                  <td style={{ color: '#ef4444' }}>-฿{Number(p.tax).toLocaleString()}</td>
                  <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>฿{Number(p.netSalary).toLocaleString()}</td>
                  <td><span className={`badge badge-${p.isPaid ? 'paid' : 'unpaid'}`}>{p.isPaid ? 'Paid' : 'Unpaid'}</span></td>
                  <td>
                    {!p.isPaid && (
                      <button className="btn btn-success btn-sm" onClick={() => handleMarkPaid(p.id)}>Mark Paid</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={showGenerate} onClose={() => setShowGenerate(false)} title="Generate Monthly Payroll">
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
          This will generate payroll for all active employees for the selected month.
        </p>
        <div className="form-row">
          <div className="form-group">
            <label>Month</label>
            <select className="form-control" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                <option key={m} value={m}>{new Date(2000, m - 1).toLocaleString('en', { month: 'long' })}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Year</label>
            <select className="form-control" value={year} onChange={(e) => setYear(Number(e.target.value))}>
              {[2024,2025,2026,2027].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={() => setShowGenerate(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleGenerate}>💰 Generate</button>
        </div>
      </Modal>
    </AppLayout>
  );
}
