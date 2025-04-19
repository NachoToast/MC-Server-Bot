import { MinecraftUser } from '../../types/MinecraftUser.js';
import { pool } from './internal/state.js';
import { transformUser, UserModel } from './internal/UserModel.js';

export async function getUsers(
    count: number,
    offset: number,
): Promise<MinecraftUser[]> {
    const client = await pool.connect();

    try {
        const result = await client.query<UserModel>(
            'SELECT * FROM users LIMIT $1 OFFSET $2',
            [count, offset],
        );

        return result.rows.map(transformUser);
    } finally {
        client.release();
    }
}
