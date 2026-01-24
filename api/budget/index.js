import pool from '../../api/db.js';
import { verifyToken } from '../../api/_utils/auth.js';

export default async function handler(req, res) {
    try {
        const user = verifyToken(req);
        const user_id = user.id;

        if (req.method === 'POST') {
            // POST /api/budget
            const { month, monthly_budget, savings_target } = req.body;

            if (!month || !monthly_budget) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const query = `
            INSERT INTO budgets (user_id, month, monthly_budget, savings_target)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id, month)
            DO UPDATE SET monthly_budget = EXCLUDED.monthly_budget, savings_target = EXCLUDED.savings_target
            RETURNING *;
        `;

            const result = await pool.query(query, [user_id, month, monthly_budget, savings_target || 0]);
            return res.json(result.rows[0]);

        } else {
            res.setHeader('Allow', ['POST']);
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
