import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

const Dashboard = () => {
    const [view, setView] = useState('overview');
    const [data, setData] = useState({ doctors: [], appointments: [] });
    const [bookingDate, setBookingDate] = useState('');
    const [loading, setLoading] = useState(true);
    
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) return navigate('/login');
        
        const init = async () => {
            try {
                const [docs, apps] = await Promise.all([
                    user.role === 'patient' ? axios.get('http://localhost:5000/api/auth/doctors') : null,
                    axios.get(`http://localhost:5000/api/appointments/${user.id}`)
                ]);
                setData({ 
                    doctors: docs?.data || [], 
                    appointments: apps.data 
                });
            } finally {
                setTimeout(() => setLoading(false), 500);
            }
        };
        init();
    }, [navigate]);

    const apiAction = async (method, url, body = {}) => {
        try {
            await axios[method](url, body);
            const refresh = await axios.get(`http://localhost:5000/api/appointments/${user.id}`);
            setData(prev => ({ ...prev, appointments: refresh.data }));
            return true;
        } catch (err) {
            alert("Action failed. Try again.");
            return false;
        }
    };

    const handleBook = async (docId) => {
        if (!bookingDate) return alert("Select a slot.");
        const date = new Date(bookingDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
        if (await apiAction('post', 'http://localhost:5000/api/appointments/book', { patientId: user.id, doctorId: docId, date })) {
            setBookingDate('');
            setView('appointments');
        }
    };

    if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <h1>CareFlow</h1>
                <ul className="nav-links">
                    {['overview', 'appointments', 'doctors', 'profile'].map(v => (
                        (v !== 'doctors' || user.role === 'patient') && (
                            <li key={v} className={view === v ? 'active' : ''} onClick={() => setView(v)}>
                                {v.toUpperCase()}
                            </li>
                        )
                    ))}
                </ul>
                <button className="btn-logout-alt" onClick={() => { localStorage.clear(); navigate('/login'); }}>Logout</button>
            </aside>

            <main className="main-content">
                <header className="top-nav">
                    <h2>Welcome, {user.name}</h2>
                    <div className="user-pill"><div className="avatar">{user.name[0]}</div></div>
                </header>

                <div className="content-body">
                    {view === 'overview' && <Overview apps={data.appointments} />}
                    {view === 'doctors' && <Doctors list={data.doctors} bookingDate={bookingDate} setDate={setBookingDate} onBook={handleBook} />}
                    {view === 'appointments' && <Appointments list={data.appointments} role={user.role} onCancel={(id) => apiAction('delete', `http://localhost:5000/api/appointments/cancel/${id}`)} />}
                    {view === 'profile' && <Profile user={user} />}
                </div>
            </main>
        </div>
    );
};

// --- Sub-Components (Human-style Abstraction) ---

const Overview = ({ apps }) => (
    <div className="stats-container">
        <div className="stat-card graph-card">
            <div className="circular-progress">98%</div>
            <div><h4>Health Score</h4><p className="trend">↑ 2.4%</p></div>
        </div>
        <div className="stat-card">
            <p>Upcoming Visits</p>
            <h1 className="big-stat">{apps.length}</h1>
        </div>
    </div>
);

const Doctors = ({ list, bookingDate, setDate, onBook }) => (
    <div className="doc-grid">
        {list.map(doc => (
            <div className="doc-card" key={doc._id}>
                <h3>Dr. {doc.name}</h3>
                <p>{doc.specialization}</p>
                <input type="datetime-local" className="time-picker-modern" value={bookingDate} onChange={e => setDate(e.target.value)} />
                <button className="btn-confirm" onClick={() => onBook(doc._id)}>Schedule</button>
            </div>
        ))}
    </div>
);

const Appointments = ({ list, role, onCancel }) => (
    <div className="view-section">
        {list.length ? list.map(app => (
            <div className="appt-item card-shadow" key={app._id}>
                <div className="appt-info">
                    <h4>{role === 'patient' ? `Dr. ${app.doctor?.name}` : `Patient: ${app.patient?.name}`}</h4>
                    <p className="date-tag">{app.date}</p>
                </div>
                <button className="btn-cancel-text" onClick={() => onCancel(app._id)}>Cancel</button>
            </div>
        )) : <div className="empty-state">No appointments found.</div>}
    </div>
);

const Profile = ({ user }) => (
    <div className="profile-card card-shadow">
        <div className="profile-row"><span>Name</span><strong>{user.name}</strong></div>
        <div className="profile-row"><span>Role</span><span className="value-tag">{user.role}</span></div>
        <button className="btn-secondary">Security Settings</button>
    </div>
);

export default Dashboard;