import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import UserModal from '../components/UserModal';

const s = {
  page: { minHeight: '100vh', background: '#f0f2f5', padding: '2rem 1rem' },
  container: { maxWidth: '900px', margin: '0 auto' },
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '1.5rem',
  },
  navTitle: { fontSize: '1.5rem', fontWeight: '800', color: '#1a1a2e' },
  navRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  greeting: { fontSize: '0.875rem', color: '#6b7280' },
  logoutBtn: {
    padding: '0.45rem 1rem', background: 'transparent',
    border: '1.5px solid #e5e7eb', borderRadius: '8px',
    color: '#374151', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer',
  },
  addBtn: {
    padding: '0.6rem 1.25rem',
    background: 'linear-gradient(135deg, #0f3460, #e94560)',
    color: '#fff', border: 'none', borderRadius: '8px',
    fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer',
  },
  statsRow: { display: 'flex', gap: '1rem', marginBottom: '1.5rem' },
  statCard: (color) => ({
    flex: 1, background: '#fff', borderRadius: '12px',
    padding: '1rem 1.25rem',
    borderLeft: `4px solid ${color}`,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  }),
  statNum: { fontSize: '1.75rem', fontWeight: '800', color: '#1a1a2e' },
  statLabel: { fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' },
  card: {
    background: '#fff', borderRadius: '12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden',
  },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' },
  th: {
    padding: '1rem 1.25rem', textAlign: 'left',
    background: '#f8fafc', color: '#6b7280',
    fontWeight: '600', fontSize: '0.78rem',
    textTransform: 'uppercase', letterSpacing: '0.06em',
    borderBottom: '1px solid #f0f2f5',
  },
  td: {
    padding: '0.9rem 1.25rem',
    borderBottom: '1px solid #f8fafc',
    color: '#1a1a2e',
  },
  avatar: (name) => ({
    width: '36px', height: '36px', borderRadius: '50%',
    background: stringToColor(name),
    color: '#fff', display: 'inline-flex',
    alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '0.8rem',
    marginRight: '0.65rem', verticalAlign: 'middle',
    flexShrink: 0,
  }),
  nameCell: { display: 'flex', alignItems: 'center' },
  badge: (role) => ({
    display: 'inline-block',
    padding: '0.25rem 0.65rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '700',
    background: role === 'admin' ? '#fef3c7' : '#dbeafe',
    color: role === 'admin' ? '#92400e' : '#1e40af',
  }),
  editBtn: {
    padding: '0.35rem 0.8rem', marginRight: '0.5rem',
    background: '#eff6ff', color: '#1d4ed8',
    border: '1px solid #bfdbfe', borderRadius: '6px',
    fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer',
  },
  delBtn: {
    padding: '0.35rem 0.8rem',
    background: '#fef2f2', color: '#dc2626',
    border: '1px solid #fecaca', borderRadius: '6px',
    fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer',
  },
  empty: { textAlign: 'center', padding: '3rem', color: '#6b7280', fontSize: '1rem' },
  error: {
    background: '#fee2e2', color: '#991b1b',
    padding: '0.75rem 1rem', borderRadius: '8px',
    marginBottom: '1rem', borderLeft: '3px solid #ef4444',
  },
};

function stringToColor(str = '') {
  const colors = ['#6366f1','#0f3460','#e94560','#10b981','#f59e0b','#8b5cf6','#14b8a6'];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function initials(name = '') {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/users');
      setUsers(data.users);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const openAdd = () => { setEditUser(null); setModalOpen(true); };
  const openEdit = (user) => { setEditUser(user); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditUser(null); };

  const handleSave = async (payload) => {
    try {
      if (editUser) {
        await api.put(`/users/${editUser._id}`, payload);
      } else {
        await api.post('/users', payload);
      }
      await fetchUsers();
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving user');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting user');
    }
  };

  const adminCount = users.filter((u) => u.role === 'admin').length;
  const userCount = users.filter((u) => u.role === 'user').length;

  return (
    <div style={s.page}>
      <div style={s.container}>
        {/* Navbar */}
        <div style={s.nav}>
          <span style={s.navTitle}>🧩 MERN CRUD</span>
          <div style={s.navRight}>
            <span style={s.greeting}>Hello, {currentUser.name || 'User'} 👋</span>
            <button style={s.logoutBtn} onClick={handleLogout}>Logout</button>
            <button style={s.addBtn} onClick={openAdd}>+ Add User</button>
          </div>
        </div>

        {/* Stats */}
        <div style={s.statsRow}>
          <div style={s.statCard('#6366f1')}>
            <div style={s.statNum}>{users.length}</div>
            <div style={s.statLabel}>Total Users</div>
          </div>
          <div style={s.statCard('#e94560')}>
            <div style={s.statNum}>{adminCount}</div>
            <div style={s.statLabel}>Admins</div>
          </div>
          <div style={s.statCard('#10b981')}>
            <div style={s.statNum}>{userCount}</div>
            <div style={s.statLabel}>Regular Users</div>
          </div>
        </div>

        {/* Error */}
        {error && <div style={s.error}>{error}</div>}

        {/* Table */}
        <div style={s.card}>
          <div style={s.tableWrap}>
            {loading ? (
              <div style={s.empty}>Loading users...</div>
            ) : users.length === 0 ? (
              <div style={s.empty}>No users yet. Click "+ Add User" to get started.</div>
            ) : (
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>User</th>
                    <th style={s.th}>Email</th>
                    <th style={s.th}>Role</th>
                    <th style={s.th}>Created</th>
                    <th style={s.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td style={s.td}>
                        <div style={s.nameCell}>
                          <span style={s.avatar(user.name)}>{initials(user.name)}</span>
                          <span style={{ fontWeight: '600' }}>{user.name}</span>
                        </div>
                      </td>
                      <td style={{ ...s.td, color: '#6b7280' }}>{user.email}</td>
                      <td style={s.td}>
                        <span style={s.badge(user.role)}>{user.role}</span>
                      </td>
                      <td style={{ ...s.td, color: '#6b7280', fontSize: '0.82rem' }}>
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </td>
                      <td style={s.td}>
                        <button style={s.editBtn} onClick={() => openEdit(user)}>Edit</button>
                        <button style={s.delBtn} onClick={() => handleDelete(user._id, user.name)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {modalOpen && (
        <UserModal user={editUser} onClose={closeModal} onSave={handleSave} />
      )}
    </div>
  );
}