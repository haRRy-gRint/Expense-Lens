import pool from '../../api/db.js';
import { verifyToken } from '../../api/_utils/auth.js';

export default async function handler(req, res) {
    try {
        const user = verifyToken(req);
        const user_id = user.id;
        const { id } = req.query; // Dynamic route parameter

        if (req.method === 'DELETE') {
            // DELETE /api/expenses/:id
            console.log(`[DELETE] Attempting to delete txn ${id} for user ${user_id}`);

            const checkTxn = await pool.query('SELECT * FROM transactions WHERE id = $1', [id]);

            if (checkTxn.rows.length === 0) {
                return res.status(404).json({ error: 'Transaction not found' });
            }

            const txn = checkTxn.rows[0];

            // Check ownership
            if (txn.user_id != user_id) {
                return res.status(403).json({ error: 'Unauthorized: You do not own this transaction' });
            }

            await pool.query('DELETE FROM transactions WHERE id = $1', [id]);
            return res.json({ message: 'Transaction deleted' });

        } else {
            res.setHeader('Allow', ['DELETE']);
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
