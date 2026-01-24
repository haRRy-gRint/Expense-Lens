import { useState } from 'react';
import '../index.css';
import API_URL from '../apiConfig';

function SecurityGate({ children }) {
    const [verified, setVerified] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`${API_URL}/api/auth/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ password })
            });

            const text = await res.text();
            let data;
            try { data = JSON.parse(text); } catch { data = { error: text || 'Server Error' }; }

            if (!res.ok) {
                throw new Error(data.error || 'Verification Failed');
            }

            setVerified(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (verified) {
        return children;
    }

    return (
        <div className="card" style={{ maxWidth: '400px', margin: '2rem auto', textAlign: 'center' }}>
            <h2>🔒 Security Check</h2>
            <p>Please re-enter your password to view private data.</p>
            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={handleVerify} className="form-group">
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    required
                    style={{ marginBottom: '1rem' }}
                />
                <button type="submit" disabled={loading} className="btn-primary full-width">
                    {loading ? 'Verifying...' : 'Unlock'}
                </button>
            </form>
        </div>
    );
}

export default SecurityGate;
