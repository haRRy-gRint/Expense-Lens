import { useState } from 'react';
// import '../index.css';
import API_URL from '../apiConfig';

function AuthForm({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                throw new Error(text || 'Server Error (Non-JSON response)');
            }

            if (!response.ok) {
                throw new Error(data.error || 'Authentication failed');
            }

            if (isLogin) {
                onLogin(data);
            } else {
                alert('Registration successful! Please login.');
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card auth-card" style={{ maxWidth: '400px', margin: '2rem auto' }}>
            <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={handleSubmit} className="form-group">
                {!isLogin && (
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>
                )}
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                </div>

                <button type="submit" disabled={loading} className="btn-primary full-width">
                    {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register (New)')}
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1rem', color: '#666' }}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    {isLogin ? 'Register' : 'Login'}
                </button>
            </p>
        </div>
    );
}

export default AuthForm;
