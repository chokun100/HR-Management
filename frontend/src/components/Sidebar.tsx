'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';

const navItems = [
  { label: 'MAIN', items: [
    { href: '/', icon: '📊', label: 'Dashboard' },
    { href: '/announcements', icon: '📢', label: 'Announcements' },
  ]},
  { label: 'MANAGEMENT', items: [
    { href: '/employees', icon: '👥', label: 'Employees' },
    { href: '/departments', icon: '🏢', label: 'Departments' },
    { href: '/positions', icon: '💼', label: 'Positions' },
    { href: '/shifts', icon: '⏱️', label: 'Shifts' },
    { href: '/documents', icon: '📄', label: 'Documents' },
  ]},
  { label: 'OPERATIONS', items: [
    { href: '/leaves', icon: '🏖️', label: 'Leave Requests' },
    { href: '/attendance', icon: '⏰', label: 'Attendance' },
    { href: '/overtime', icon: '⌛', label: 'Overtime (OT)' },
    { href: '/payroll', icon: '💰', label: 'Payroll' },
  ]},
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">HR</div>
        <div>
          <h1>HR System</h1>
          <span>Management Portal</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((group) => (
          <div key={group.label}>
            <div className="nav-label">{group.label}</div>
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${pathname === item.href ? 'active' : ''}`}
              >
                <span className="icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-info">
            <div className="name">{user?.username || 'User'}</div>
            <div className="role">{user?.role || 'employee'}</div>
          </div>
          <button className="logout-btn" onClick={logout} title="Logout">
            🚪
          </button>
        </div>
      </div>
    </aside>
  );
}
