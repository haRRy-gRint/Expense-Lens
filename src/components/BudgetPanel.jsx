import { useState, useEffect } from 'react';
import API_URL from '../apiConfig';

function BudgetPanel({ refreshTrigger }) {
    const [budgetData, setBudgetData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ monthly_budget: '', savings_target: '' });

    // Get current YYYY-MM
    const currentMonth = new Date().toISOString().slice(0, 7);

    const fetchBudgetStatus = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/budget/status?month=${currentMonth}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const text = await res.text();
            let data;
            try { data = JSON.parse(text); } catch { throw new Error('Server Error'); }

            if (!res.ok) throw new Error(data.error);

            if (data.notSet) {
                setBudgetData(null);
                setEditing(true); // Auto open form if no budget
            } else {
                setBudgetData(data);
                setForm({
                    monthly_budget: data.monthly_budget,
                    savings_target: data.savings_target
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBudgetStatus();
    }, [refreshTrigger]); // Refresh when transactions change

    const handleSetBudget = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/api/budget`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    month: currentMonth + '-01',
                    monthly_budget: form.monthly_budget,
                    savings_target: form.savings_target
                })
            });

            if (res.ok) {
                setEditing(false);
                fetchBudgetStatus();
            }
        } catch (err) {
            alert('Failed to set budget');
        }
    };

    if (loading) return <div className="card">Loading budget info...</div>;

    if (editing) {
        return (
            <div className="card bugdet-card">
                <h2>Set Budget for {currentMonth}</h2>
                <form onSubmit={handleSetBudget} className="form-group">
                    <label>Monthly Limit (₹)</label>
                    <input
                        type="number"
                        value={form.monthly_budget}
                        onChange={e => setForm({ ...form, monthly_budget: e.target.value })}
                        required
                    />
                    <label>Savings Goal (₹)</label>
                    <input
                        type="number"
                        value={form.savings_target}
                        onChange={e => setForm({ ...form, savings_target: e.target.value })}
                    />
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" className="btn-primary">Save Budget</button>
                        {budgetData && <button type="button" onClick={() => setEditing(false)} className="toggle-btn">Cancel</button>}
                    </div>
                </form>
            </div>
        );
    }

    if (!budgetData) return null;

    const percent = Math.min((budgetData.total_spent / budgetData.monthly_budget) * 100, 100);
    const color = budgetData.alert_level === 'danger' ? '#ef4444' : (budgetData.alert_level === 'warning' ? '#f59e0b' : '#10b981');

    return (
        <div className="card budget-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0 }}>💰 Monthly Budget ({currentMonth})</h2>
                <button onClick={() => setEditing(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>⚙️</button>
            </div>

            {budgetData.alert && (
                <div className="alert-banner" style={{
                    backgroundColor: budgetData.alert_level === 'danger' ? '#fef2f2' : '#fffbeb',
                    color: budgetData.alert_level === 'danger' ? '#991b1b' : '#92400e',
                    padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid currentColor'
                }}>
                    {budgetData.alert}
                </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                    <span>Spent: ₹{budgetData.total_spent.toFixed(2)}</span>
                    <span>Limit: ₹{budgetData.monthly_budget.toFixed(2)}</span>
                </div>
                <div style={{ height: '12px', background: '#e5e7eb', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${percent}%`, background: color, height: '100%', transition: 'width 0.5s' }}></div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#6b7280' }}>
                <span>Remaining: ₹{budgetData.remaining.toFixed(2)}</span>
                <span>Goal: ₹{budgetData.savings_target.toFixed(2)}</span>
            </div>
        </div>
    );
}

export default BudgetPanel;
