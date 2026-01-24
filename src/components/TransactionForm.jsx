import { useState } from 'react';
import '../index.css';
import API_URL from '../apiConfig';

function TransactionForm({ onTransactionAdded }) {
    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        description: '',
        txn_date: new Date().toISOString().split('T')[0],
        account_type: 'private'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Other'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!formData.amount || !formData.category || !formData.txn_date) {
            setError('Please fill in all required fields.');
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setError('You are not logged in.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const text = await response.text();
            let err;
            try {
                err = JSON.parse(text);
            } catch {
                err = { error: text || 'Server Error' };
            }

            if (!response.ok) {
                throw new Error(err.error || 'Failed to create transaction');
            }

            setFormData({
                amount: '',
                category: '',
                description: '',
                txn_date: new Date().toISOString().split('T')[0],
                account_type: 'private'
            });
            if (onTransactionAdded) onTransactionAdded();
        } catch (err) {
            setError(err.message || 'Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h2>Add New Transaction</h2>
            {error && <div className="error-msg">{error}</div>}
            <form onSubmit={handleSubmit} className="form-grid">
                <div className="form-group">
                    <label>Amount</label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                        placeholder="0.00"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Date</label>
                    <input
                        type="date"
                        value={formData.txn_date}
                        onChange={e => setFormData({ ...formData, txn_date: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Category</label>
                    <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div className="form-group">
                    <label>Visibility</label>
                    <select
                        value={formData.account_type}
                        onChange={e => setFormData({ ...formData, account_type: e.target.value })}
                    >
                        <option value="private">Private</option>
                        <option value="public">Public</option>
                    </select>
                </div>

                <div className="form-group full-width">
                    <label>Description</label>
                    <input
                        type="text"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Optional description"
                    />
                </div>

                <button type="submit" disabled={loading} className="btn-primary full-width">
                    {loading ? 'Adding...' : 'Add Transaction'}
                </button>
            </form>
        </div>
    );
}

export default TransactionForm;
