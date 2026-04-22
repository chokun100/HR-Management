'use client';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';

function SkeletonDashboard() {
  return (
    <div className="content-container">
      <div className="page-header">
        <div className="skeleton skeleton-title" style={{ width: 180 }} />
        <div className="skeleton skeleton-text-sm" style={{ width: 260 }} />
      </div>
      <div className="stat-cards">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton skeleton-card" />
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="skeleton skeleton-card" style={{ height: 200 }} />
        <div className="skeleton skeleton-card" style={{ height: 200 }} />
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="app-layout">
        <Sidebar />
      <main id="main-content" className="main-content">
        <SkeletonDashboard />
      </main>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="app-layout">
      <Sidebar />
      <main id="main-content" className="main-content animate-in">
        <div className="content-container">
          {children}
        </div>
      </main>
    </div>
  );
}
