'use client';
import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import Modal from '@/components/Modal';
import { api } from '@/lib/api';
import { Announcement } from "@/types";

export default function AnnouncementsPage() {
  const [data, setData] = useState<Announcement[][]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  
  const [formData, setFormData] = useState({ title: '', content: '', priority: 'normal', author: 'HR Dept' });

  const loadData = async () => {
    setLoading(true);
    api.get('/announcements?all=true').then(setData).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/announcements', formData);
      setShowAdd(false);
      loadData();
      setFormData({ title: '', content: '', priority: 'normal', author: 'HR Dept' });
    } catch (err: unknown) { alert((err as Error).message); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this announcement?')) return;
    await api.delete(`/announcements/${id}`);
    loadData();
  };

  return (
    <AppLayout>
      <div className="page-header page-header-actions">
        <div><h2>Announcements</h2><p>Company-wide news and communications</p></div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ New Announcement</button>
      </div>

      <div className="table-wrapper">
        <div className="table-header"><h3>Recent Announcements ({data.length})</h3></div>
        {loading ? <div className="loading-spinner"><div className="spinner"/></div> : data.length === 0 ? (
          <div className="empty-state"><div className="icon">📢</div><h3>No announcements</h3></div>
        ) : (
          <table>
            <thead><tr><th>Title</th><th>Content Preview</th><th>Priority</th><th>Author</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {data.map(a => (
                <tr key={a.id}>
                  <td style={{fontWeight:600}}>{a.title}</td>
                  <td>{a.content.substring(0, 50)}...</td>
                  <td><span className={`badge badge-${a.priority === 'high' || a.priority === 'urgent' ? 'resigned' : 'active'}`}>{a.priority}</span></td>
                  <td>{a.author}</td>
                  <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(a.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Post Announcement">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input type="text" className="form-control" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Content *</label>
            <textarea className="form-control" rows={4} required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select className="form-control" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="form-group">
              <label>Author</label>
              <input type="text" className="form-control" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Post</button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
