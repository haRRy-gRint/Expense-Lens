import BudgetPanel from './BudgetPanel';
import TransactionForm from './TransactionForm';

function Dashboard({ refreshKey, onTransactionAdded }) {
    return (
        <div className="dashboard-view fade-in-up">
            <BudgetPanel refreshTrigger={refreshKey} />
            <TransactionForm onTransactionAdded={onTransactionAdded} />
        </div>
    );
}

export default Dashboard;
