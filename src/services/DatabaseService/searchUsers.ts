import { MinecraftUser } from '../../types/MinecraftUser.js';
import { pool } from './internal/state.js';
import { transformUser, UserModel } from './internal/UserModel.js';
import { UserNotFoundError } from './UserNotFoundError.js';

export async function searchUsers(username: string): Promise<MinecraftUser> {
    const client = await pool.connect();

    try {
        const result = await client.query<UserModel>(
            'SELECT * FROM users WHERE minecraft_username ILIKE $1',
            [`%${username}%`],
        );

        const user = result.rows.at(0);

        if (user === undefined) {
            throw new UserNotFoundError(username, 'minecraft');
        }

        return transformUser(user);
    } finally {
        client.release();
    }
}
