import pool from '../../api/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // --- Middleware Logic Inline ---
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Access Denied: No Token Provided' });
    }

    let user_id;
    try {
        const tokenString = token.split(' ')[1];
        if (!tokenString) throw new Error('Malformed Token');
        const verified = jwt.verify(tokenString, process.env.JWT_SECRET || 'secret_key_123');
        user_id = verified.id;
    } catch (err) {
        return res.status(400).json({ error: 'Invalid Token' });
    }
    // -------------------------------

    try {
        const { password } = req.body;

        const user = await pool.query('SELECT password_hash FROM users WHERE id = $1', [user_id]);

        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const validPass = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPass) {
            return res.status(401).json({ error: 'Invalid Password' });
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error' });
    }
}
