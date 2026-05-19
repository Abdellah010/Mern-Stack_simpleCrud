import { useState, useEffect } from 'react';

const overlay = {
  position: 'fixed', inset: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000, padding: '1rem',
};
const modal = {
  background: '#fff', borderRadius: '14px',
  padding: '2rem', width: '100%', maxWidth: '460px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
};
const header = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  marginBottom: '1.5rem',
};
const title = { fontSize: '1.2rem', fontWeight: '700', color: '#1a1a2e' };
const closeBtn = {
  background: 'none', border: 'none', fontSize: '1.4rem',
  cursor: 'pointer', color: '#6b7280', lineHeight: 1,
};
const group = { marginBottom: '1rem' };
const label = {
  display: 'block', fontSize: '0.78rem', fontWeight: '600',
  color: '#374151', marginBottom: '0.35rem',
  textTransform: 'uppercase', letterSpacing: '0.05em',
};
const input = {
  width: '100%', padding: '0.65rem 0.9rem',
  border: '1.5px solid #e5e7eb', borderRadius: '8px',
  fontSize: '0.95rem', outline: 'none', color: '#1a1a2e',
};
const actions = { display: 'flex', gap: '0.75rem', marginTop: '1.5rem' };
const btnPrimary = {
  flex: 1, padding: '0.75rem',
  background: 'linear-gradient(135deg, #0f3460, #e94560)',
  color: '#fff', border: 'none', borderRadius: '8px',
  fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer',
};
const btnSecondary = {
  flex: 1, padding: '0.75rem',
  background: '#f0f2f5', color: '#374151',
  border: 'none', borderRadius: '8px',
  fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer',
};

export default function UserModal({ user, onClose, onSave }) {
  const isEdit = !!user;
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'user',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email, password: '', role: user.role });
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form };
    if (isEdit && !payload.password) delete payload.password;
    await onSave(payload);
    setLoading(false);
  };

  return (
    <div style={overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={modal}>
        <div style={header}>
          <span style={title}>{isEdit ? '✏️ Edit User' : '➕ Add User'}</span>
          <button style={closeBtn} onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={group}>
            <label style={label}>Full Name</label>
            <input style={input} name="name" placeholder="John Doe"
              value={form.name} onChange={handleChange} required />
          </div>
          <div style={group}>
            <label style={label}>Email</label>
            <input style={input} name="email" type="email" placeholder="john@example.com"
              value={form.email} onChange={handleChange} required />
          </div>
          <div style={group}>
            <label style={label}>{isEdit ? 'New Password (leave blank to keep)' : 'Password'}</label>
            <input style={input} name="password" type="password" placeholder="••••••••"
              value={form.password} onChange={handleChange} required={!isEdit} />
          </div>
          <div style={group}>
            <label style={label}>Role</label>
            <select style={{ ...input, background: '#fff' }} name="role"
              value={form.role} onChange={handleChange}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div style={actions}>
            <button type="button" style={btnSecondary} onClick={onClose}>Cancel</button>
            <button type="submit" style={btnPrimary} disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}