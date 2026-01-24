import { useState, useEffect } from 'react';
import AuthForm from './components/AuthForm';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import History from './components/History';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [viewType, setViewType] = useState('landing');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);

  // Check for stored token and user on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setViewType('app');
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData.user);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData.user));
    setViewType('app');
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setViewType('landing');
  };

  const handleTransactionAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 style={{ cursor: 'pointer' }} onClick={() => setViewType('landing')}>Expense-Lens</h1>

        {user && viewType === 'app' && (
          <div className="nav-bar">
            <button
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Dashboard
            </button>
            <button
              className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              🕒 History
            </button>
          </div>
        )}

        {viewType === 'landing' && !user ? null : (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
            {user && (
              <span className="badge" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>
                👤 {user.username}
              </span>
            )}
            {user ? (
              <button onClick={handleLogout} className="toggle-btn" style={{ border: '1px solid #ddd' }}>Logout</button>
            ) : (
              <button onClick={() => setViewType('login')} className="toggle-btn" style={{ border: '1px solid #ddd' }}>Login</button>
            )}
          </div>
        )}
      </header>

      <main className="main-content">
        {viewType === 'landing' && !user && <LandingPage onGetStarted={() => setViewType('login')} />}
        {viewType === 'login' && !user && <AuthForm onLogin={handleLogin} />}

        {user && viewType === 'app' && (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard refreshKey={refreshKey} onTransactionAdded={handleTransactionAdded} />
            )}
            {activeTab === 'history' && (
              <History refreshKey={refreshKey} />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;

