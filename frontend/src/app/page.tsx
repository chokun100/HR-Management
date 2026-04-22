'use client';
import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { api } from '@/lib/api';
import { Users, Buildings, Clock, ClipboardText } from '@phosphor-icons/react';

interface DashboardStats {
  totalEmployees: number;
  employeeStatus: { active: number; onLeave: number; resigned: number };
  totalDepartments: number;
  pendingLeaves: number;
  todayAttendance: number;
  departmentStats: { name: string; employeeCount: number }[];
}

const statConfig = [
  { key: 'totalEmployees' as const, label: 'Total Employees', icon: Users },
  { key: 'totalDepartments' as const, label: 'Departments', icon: Buildings },
  { key: 'todayAttendance' as const, label: "Today's Attendance", icon: Clock },
  { key: 'pendingLeaves' as const, label: 'Pending Leaves', icon: ClipboardText },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard').then(setStats).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="loading-spinner"><div className="spinner" /></div>
      </AppLayout>
    );
  }

  const maxCount = Math.max(...(stats?.departmentStats?.map(d => d.employeeCount) || [1]), 1);

  return (
    <AppLayout>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Overview of your workforce and daily operations</p>
      </div>

      <div className="stat-cards">
        {statConfig.map(({ key, label, icon: Icon }) => (
          <div key={key} className="stat-card">
            <div className="stat-icon">
              <Icon size={22} weight="duotone" />
            </div>
            <div className="stat-value">{(stats as any)?.[key] || 0}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <h3 style={{ marginBottom: 6, fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>Employee status</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>Current workforce distribution</p>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1, padding: 18, background: 'rgba(45, 157, 120, 0.06)', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid rgba(45, 157, 120, 0.1)' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--success)', letterSpacing: '-0.02em', lineHeight: 1 }} >{stats?.employeeStatus?.active || 0}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, fontWeight: 500 }}>Active</div>
            </div>
            <div style={{ flex: 1, padding: 18, background: 'rgba(199, 137, 43, 0.06)', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid rgba(199, 137, 43, 0.1)' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--warning)', letterSpacing: '-0.02em', lineHeight: 1 }} >{stats?.employeeStatus?.onLeave || 0}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, fontWeight: 500 }}>On leave</div>
            </div>
            <div style={{ flex: 1, padding: 18, background: 'rgba(196, 74, 74, 0.06)', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid rgba(196, 74, 74, 0.1)' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--danger)', letterSpacing: '-0.02em', lineHeight: 1 }} >{stats?.employeeStatus?.resigned || 0}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, fontWeight: 500 }}>Resigned</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 6, fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>Departments</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Employee distribution by department</p>
          {stats?.departmentStats && stats.departmentStats.length > 0 ? (
            <div className="chart-bar-container">
              {stats.departmentStats.map((dept, i) => (
                <div key={i} className="chart-bar-item">
                  <div className="chart-bar-value">{dept.employeeCount}</div>
                  <div
                    className="chart-bar"
                    style={{ height: `${Math.max((dept.employeeCount / maxCount) * 100, 5)}%` }}
                  />
                  <div className="chart-bar-label">{dept.name}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: 30 }}>
              <p style={{ fontSize: 13 }}>No departments yet</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
