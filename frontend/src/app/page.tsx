'use client';
import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { api } from '@/lib/api';
import {
  Users,
  Building2,
  Clock,
  ClipboardList,
} from 'lucide-react';

interface DashboardStats {
  totalEmployees: number;
  employeeStatus: { active: number; onLeave: number; resigned: number };
  totalDepartments: number;
  pendingLeaves: number;
  todayAttendance: number;
  departmentStats: { name: string; employeeCount: number }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/dashboard')
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="loading-spinner" aria-label="Loading dashboard">
          <div className="spinner" />
        </div>
      </AppLayout>
    );
  }

  const maxCount = Math.max(
    ...(stats?.departmentStats?.map((d) => d.employeeCount) || [1]),
    1
  );

  return (
    <AppLayout>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Welcome to HR Management System Overview</p>
      </div>

      <div className="stat-cards">
        <div className="stat-card accent-1">
          <div className="stat-icon">
            <Users size={22} />
          </div>
          <div className="stat-value">{stats?.totalEmployees || 0}</div>
          <div className="stat-label">Total Employees</div>
        </div>
        <div className="stat-card accent-2">
          <div className="stat-icon">
            <Building2 size={22} />
          </div>
          <div className="stat-value">{stats?.totalDepartments || 0}</div>
          <div className="stat-label">Departments</div>
        </div>
        <div className="stat-card accent-3">
          <div className="stat-icon">
            <Clock size={22} />
          </div>
          <div className="stat-value">{stats?.todayAttendance || 0}</div>
          <div className="stat-label">Today&apos;s Attendance</div>
        </div>
        <div className="stat-card accent-4">
          <div className="stat-icon">
            <ClipboardList size={22} />
          </div>
          <div className="stat-value">{stats?.pendingLeaves || 0}</div>
          <div className="stat-label">Pending Leave Requests</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3 style={{ marginBottom: 8, fontSize: 16, fontWeight: 700 }}>
            Employee Status
          </h3>
          <p
            style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}
          >
            Current workforce distribution
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            <div
              style={{
                flex: 1,
                padding: 16,
                background: 'rgba(16,185,129,0.08)',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: 'var(--success)',
                }}
              >
                {stats?.employeeStatus?.active || 0}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  marginTop: 4,
                }}
              >
                Active
              </div>
            </div>
            <div
              style={{
                flex: 1,
                padding: 16,
                background: 'rgba(245,158,11,0.08)',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: 'var(--warning)',
                }}
              >
                {stats?.employeeStatus?.onLeave || 0}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  marginTop: 4,
                }}
              >
                On Leave
              </div>
            </div>
            <div
              style={{
                flex: 1,
                padding: 16,
                background: 'rgba(239,68,68,0.08)',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: 'var(--danger)',
                }}
              >
                {stats?.employeeStatus?.resigned || 0}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  marginTop: 4,
                }}
              >
                Resigned
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 8, fontSize: 16, fontWeight: 700 }}>
            Departments
          </h3>
          <p
            style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}
          >
            Employee distribution by department
          </p>
          {stats?.departmentStats && stats.departmentStats.length > 0 ? (
            <div className="chart-bar-container">
              {stats.departmentStats.map((dept, i) => (
                <div key={i} className="chart-bar-item">
                  <div className="chart-bar-value">{dept.employeeCount}</div>
                  <div
                    className="chart-bar"
                    style={{
                      height: `${Math.max((dept.employeeCount / maxCount) * 100, 5)}%`,
                    }}
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
