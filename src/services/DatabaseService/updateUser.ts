import { Snowflake } from 'discord.js';
import { MinecraftUser } from '../../types/MinecraftUser.js';
import { MinecraftUserState } from '../../types/UserState.js';
import { getUser } from './getUser.js';
import { pool } from './internal/state.js';
import { transformUser, UserModel } from './internal/UserModel.js';
import { UserNotFoundError } from './UserNotFoundError.js';

export async function updateUser(
    discordId: Snowflake,
    newState: MinecraftUserState,
    reason: string | null,
    doneBy: Snowflake,
): Promise<MinecraftUser> {
    const client = await pool.connect();

    try {
        const oldUser = await getUser(discordId);

        const result = await Promise.all([
            client.query<UserModel>(
                'UPDATE users SET state = $1 WHERE discord_id = $2 RETURNING *',
                [newState, discordId],
            ),
            client.query(
                'INSERT INTO user_logs (done_to, done_by, reason, previous_state) VALUES ($1, $2, $3, $4)',
                [discordId, doneBy, reason, oldUser.state],
            ),
        ]);

        const newUser = result[0].rows.at(0);

        if (newUser === undefined) {
            throw new UserNotFoundError(discordId, 'discord');
        }

        return transformUser(newUser);
    } finally {
        client.release();
    }
}
