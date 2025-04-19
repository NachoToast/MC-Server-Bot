import { Snowflake } from 'discord.js';
import { MinecraftUser } from '../../types/MinecraftUser.js';
import { pool } from './internal/state.js';
import { transformUser, UserModel } from './internal/UserModel.js';
import { UserNotFoundError } from './UserNotFoundError.js';

export async function deleteUser(discordId: Snowflake): Promise<MinecraftUser> {
    const client = await pool.connect();

    try {
        const result = await client.query<UserModel>(
            'DELETE FROM users WHERE discord_id = $1 RETURNING *',
            [discordId],
        );

        const user = result.rows.at(0);

        if (user === undefined) {
            throw new UserNotFoundError(discordId, 'discord');
        }

        return transformUser(user);
    } finally {
        client.release();
    }
}
