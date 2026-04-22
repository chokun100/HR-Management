'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import {
  ChartPie,
  Megaphone,
  Users,
  Buildings,
  Briefcase,
  Clock,
  FileText,
  TreePalm,
  CalendarCheck,
  Timer,
  Money,
  SignOut,
} from '@phosphor-icons/react';

const navItems = [
  {
    label: 'Overview', items: [
      { href: '/', icon: ChartPie, label: 'Dashboard' },
      { href: '/announcements', icon: Megaphone, label: 'Announcements' },
    ]
  },
  {
    label: 'Management', items: [
      { href: '/employees', icon: Users, label: 'Employees' },
      { href: '/departments', icon: Buildings, label: 'Departments' },
      { href: '/positions', icon: Briefcase, label: 'Positions' },
      { href: '/shifts', icon: Clock, label: 'Shifts' },
      { href: '/documents', icon: FileText, label: 'Documents' },
    ]
  },
  {
    label: 'Operations', items: [
      { href: '/leaves', icon: TreePalm, label: 'Leave Requests' },
      { href: '/attendance', icon: CalendarCheck, label: 'Attendance' },
      { href: '/overtime', icon: Timer, label: 'Overtime' },
      { href: '/payroll', icon: Money, label: 'Payroll' },
    ]
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar" aria-label="Main navigation">
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
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="icon">
                    <Icon size={18} weight={isActive ? 'fill' : 'regular'} />
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
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
          <button className="logout-btn" onClick={logout} title="Sign out" aria-label="Sign out">
            <SignOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
