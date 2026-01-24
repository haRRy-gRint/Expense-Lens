import { useState } from 'react';
import SecurityGate from './SecurityGate';
import TransactionList from './TransactionList';

function History({ refreshKey }) {
    const [historyType, setHistoryType] = useState('public');
    const [localRefresh, setLocalRefresh] = useState(0);

    const forceRefresh = () => setLocalRefresh(prev => prev + 1);

    if (historyType === 'private') {
        return (
            <SecurityGate>
                <div className="card list-card">
                    <div className="list-header">
                        <h2>Transaction History</h2>
                        <div className="toggle-group">
                            <button onClick={() => setHistoryType('public')} className="toggle-btn">Public</button>
                            <button className="toggle-btn active">Private 🔒</button>
                        </div>
                    </div>
                    <TransactionList
                        type="private"
                        key={`private-${refreshKey}-${localRefresh}`}
                        onTransactionDeleted={forceRefresh}
                    />
                </div>
            </SecurityGate>
        );
    }

    return (
        <div className="card list-card">
            <div className="list-header">
                <h2>Transaction History</h2>
                <div className="toggle-group">
                    <button className="toggle-btn active">Public</button>
                    <button onClick={() => setHistoryType('private')} className="toggle-btn">Private 🔒</button>
                </div>
            </div>
            <TransactionList
                type="public"
                key={`public-${refreshKey}-${localRefresh}`}
                onTransactionDeleted={forceRefresh}
            />
        </div>
    );
}

export default History;
