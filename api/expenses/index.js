import pool from '../../api/db.js';
import { verifyToken } from '../../api/_utils/auth.js';

export default async function handler(req, res) {
    try {
        const user = verifyToken(req);
        const user_id = user.id;

        if (req.method === 'POST') {
            // POST /api/expenses (Create Transaction)
            const { amount, category, description, txn_date, account_type } = req.body;

            if (!amount || !category || !txn_date || !account_type) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            if (!['public', 'private'].includes(account_type)) {
                return res.status(400).json({ error: 'Invalid account_type' });
            }

            const newTxn = await pool.query(
                'INSERT INTO transactions (user_id, amount, category, description, txn_date, account_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [user_id, amount, category, description, txn_date, account_type]
            );

            return res.status(201).json(newTxn.rows[0]);

        } else if (req.method === 'GET') {
            // GET /api/expenses (List Transactions)
            const { type } = req.query;

            if (!type || !['public', 'private'].includes(type)) {
                return res.status(400).json({ error: 'Invalid or missing type parameter' });
            }

            // Logic: Users only see their own transactions for both public and private types based on requirement updates
            const query = 'SELECT * FROM transactions WHERE account_type = $1 AND user_id = $2 ORDER BY txn_date DESC';
            const params = [type, user_id];

            const result = await pool.query(query, params);
            return res.json(result.rows);

        } else {
            res.setHeader('Allow', ['GET', 'POST']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
        }

    } catch (err) {
        if (err.status) {
            return res.status(err.status).json({ error: err.message });
        }
        console.error(err.message);
        res.status(500).json({ error: 'Server Error' });
    }
}
