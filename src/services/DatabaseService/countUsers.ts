import { pool } from './internal/state.js';

export async function countUsers(): Promise<number> {
    const client = await pool.connect();

    try {
        const result = await client.query<{ count: string }>(
            'SELECT COUNT(*) AS count FROM users',
        );

        const count = result.rows.at(0)?.count;

        if (count === undefined) {
            throw new Error('Failed to count users');
        }

        return Number(count);
    } finally {
        client.release();
    }
}
