'use client';
import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import Modal from '@/components/Modal';
import { api } from '@/lib/api';
import { Document, Employee } from "@/types";
import { Plus, Trash, FileText } from '@phosphor-icons/react';

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const [formData, setFormData] = useState({ employeeId: '', title: '', type: 'other', description: '', fileName: '' });

  const loadData = async () => {
    setLoading(true);
    try {
      const [docRes, empRes] = await Promise.all([
        api.get('/documents'),
        api.get('/employees')
      ]);
      setDocs(docRes);
      setEmployees(empRes);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/documents', { ...formData, employeeId: Number(formData.employeeId) });
      setShowAdd(false);
      loadData();
      setFormData({ employeeId: '', title: '', type: 'other', description: '', fileName: '' });
    } catch (err: unknown) { alert((err as Error).message); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this document?')) return;
    await api.delete(`/documents/${id}`);
    loadData();
  };

  return (
    <AppLayout>
      <div className="page-header page-header-actions">
        <div><h2>Document management</h2><p>Manage employee records and files</p></div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Plus weight="bold" /> Upload document</button>
      </div>

      <div className="table-wrapper">
        <div className="table-header"><h3>Stored documents ({docs.length})</h3></div>
        {loading ? (
          <div className="skeleton">
            <div className="skeleton-row" />
            <div className="skeleton-row" />
            <div className="skeleton-row" />
          </div>
        ) : docs.length === 0 ? (
          <div className="empty-state"><FileText size={32} className="text-muted" /><h3>No documents</h3><p>Upload a document to get started</p></div>
        ) : (
          <table>
            <thead><tr><th>Employee</th><th>Title</th><th>Type</th><th>File name</th><th>Upload date</th><th>Actions</th></tr></thead>
            <tbody>
              {docs.map(d => (
                <tr key={d.id}>
                  <td className="font-semibold">{d.employee?.firstName} {d.employee?.lastName}</td>
                  <td>{d.title}</td>
                  <td><span className="badge badge-active">{d.type}</span></td>
                  <td>{d.fileName || '-'}</td>
                  <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d.id)} aria-label="Delete document"><Trash size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add document record">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="doc-employee">Employee *</label>
            <select id="doc-employee" className="form-control" required value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})}>
              <option value="">-- Select --</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.employeeCode} - {e.firstName} {e.lastName}</option>)}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="doc-title">Document title *</label>
              <input id="doc-title" type="text" className="form-control" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="form-group">
              <label htmlFor="doc-type">Document type</label>
              <select id="doc-type" className="form-control" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="contract">Employment contract</option>
                <option value="id_card">ID card / passport</option>
                <option value="certificate">Certificate</option>
                <option value="resume">Resume</option>
                <option value="tax_form">Tax form</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="doc-file">File name / link</label>
            <input id="doc-file" type="text" className="form-control" value={formData.fileName} onChange={e => setFormData({...formData, fileName: e.target.value})} placeholder="e.g. contract_2024.pdf" />
          </div>
          <div className="form-group">
            <label htmlFor="doc-desc">Description</label>
            <input id="doc-desc" type="text" className="form-control" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save document</button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
