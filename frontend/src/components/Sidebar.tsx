'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import {
  LayoutDashboard,
  Megaphone,
  Users,
  Building2,
  Briefcase,
  Clock,
  FileText,
  Palmtree,
  CalendarCheck,
  Timer,
  Banknote,
  LogOut,
} from 'lucide-react';

const navItems = [
  {
    label: 'MAIN',
    items: [
      { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/announcements', icon: Megaphone, label: 'Announcements' },
    ],
  },
  {
    label: 'MANAGEMENT',
    items: [
      { href: '/employees', icon: Users, label: 'Employees' },
      { href: '/departments', icon: Building2, label: 'Departments' },
      { href: '/positions', icon: Briefcase, label: 'Positions' },
      { href: '/shifts', icon: Clock, label: 'Shifts' },
      { href: '/documents', icon: FileText, label: 'Documents' },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { href: '/leaves', icon: Palmtree, label: 'Leave Requests' },
      { href: '/attendance', icon: CalendarCheck, label: 'Attendance' },
      { href: '/overtime', icon: Timer, label: 'Overtime (OT)' },
      { href: '/payroll', icon: Banknote, label: 'Payroll' },
    ],
  },
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

      <nav className="sidebar-nav" aria-label="Main navigation">
        {navItems.map((group) => (
          <div key={group.label}>
            <div className="nav-label">{group.label}</div>
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="icon">
                    <Icon size={18} strokeWidth={2} />
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
          <button
            className="logout-btn"
            onClick={logout}
            aria-label="Logout"
            type="button"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
