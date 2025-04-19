import { Snowflake } from 'discord.js';
import { MinecraftUser } from '../../types/MinecraftUser.js';
import { transformUser, UserModel } from './internal/UserModel.js';
import { pool } from './internal/state.js';

export async function createUser(
    discordId: Snowflake,
    username: string,
): Promise<MinecraftUser> {
    const client = await pool.connect();

    try {
        const result = await client.query<UserModel>(
            'INSERT INTO users (discord_id, minecraft_username) VALUES ($1, $2) RETURNING *',
            [discordId, username],
        );

        const user = result.rows.at(0);

        if (user === undefined) {
            throw new Error('Failed to create user');
        }

        return transformUser(user);
    } finally {
        client.release();
    }
}
