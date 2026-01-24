import jwt from 'jsonwebtoken';

export function verifyToken(req) {
    const token = req.headers['authorization'];
    if (!token) {
        throw { status: 401, message: 'Access Denied: No Token Provided' };
    }

    try {
        const tokenString = token.split(' ')[1];
        if (!tokenString) throw new Error('Malformed Token');

        // In Vercel, process.env is available
        const verified = jwt.verify(tokenString, process.env.JWT_SECRET || 'secret_key_123');
        return verified; // Returns payload { id, email, ... }
    } catch (err) {
        throw { status: 400, message: 'Invalid Token' };
    }
}
