import { useEffect, useState } from 'react';
import API_URL from '../apiConfig';

function TransactionList({ type, onTransactionDeleted }) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchTransactions = async () => {
        setLoading(true);
        setError('');

        const token = localStorage.getItem('token');
        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const res = await fetch(`${API_URL}/api/transactions?type=${type}`, { headers });

            if (res.status === 401 || res.status === 403) {
                // unauthorized
                throw new Error('Please login to view these transactions');
            }

            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                throw new Error(text || 'Server Error');
            }

            if (!res.ok) throw new Error(data.error || 'Failed to fetch transactions');
            setTransactions(data);
        } catch (err) {
            setError(err.message || 'Could not load transactions');
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (type === 'private' && !localStorage.getItem('token')) {
            setError('Please login to view private transactions');
            return;
        }
        fetchTransactions();
    }, [type]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) return;

        const token = localStorage.getItem('token');
        console.log(`[Frontend] Deleting ${id}, Token: ${token ? 'Yes' : 'No'}`);
        try {
            const res = await fetch(`${API_URL}/api/transactions/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                // fetchTransactions(); // Removing internal fetch, prefer parent refresh or both
                if (onTransactionDeleted) {
                    onTransactionDeleted();
                } else {
                    fetchTransactions();
                }
                alert('Transaction deleted successfully!');
            } else {
                const data = await res.json();
                alert(`Failed to delete: ${data.error || res.statusText}`);
                console.error('Delete failed:', data);
            }
        } catch (err) {
            console.error('Delete error:', err);
            alert('Error connecting to server');
        }
    };

    if (loading) return <div className="loading">Loading transactions...</div>;

    // Customize error for empty public vs empty private
    if (transactions.length === 0 && !error) {
        return <p className="empty-state">No {type} transactions found.</p>;
    }

    if (error) return <div className="error-msg">{error}</div>;

    return (
        <div className="transaction-list">
            <table className="txn-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th className="text-right">Amount</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(txn => (
                        <tr key={txn.id}>
                            <td>{new Date(txn.txn_date).toLocaleDateString()}</td>
                            <td><span className="badge">{txn.category}</span></td>
                            <td>{txn.description}</td>
                            <td className="text-right font-mono">₹{Number(txn.amount).toFixed(2)}</td>
                            <td className="text-right">
                                <button
                                    onClick={() => handleDelete(txn.id)}
                                    className="delete-btn"
                                    title="Delete Transaction"
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TransactionList;
