import { Snowflake } from 'discord.js';
import { MinecraftUserLog } from '../../types/MinecraftUserLog.js';
import { pool } from './internal/state.js';
import { LogModel, transformLog } from './internal/UserLogModel.js';

export async function getUserLogs(
    discordId: Snowflake,
    page: number,
    perPage: number,
): Promise<[MinecraftUserLog[], number]> {
    const client = await pool.connect();

    try {
        const result = await Promise.all([
            client.query<LogModel>(
                'SELECT * FROM user_logs WHERE done_to = $1 ORDER BY done_at DESC LIMIT $2 OFFSET $3',
                [discordId, perPage, (page - 1) * perPage],
            ),
            client.query<{ count: string }>(
                'select COUNT(*) as count from user_logs where done_to = $1',
                [discordId],
            ),
        ]);

        const count = result[1].rows.at(0)?.count;

        if (count === undefined) {
            throw new Error('Failed to count user logs');
        }

        const logs = result[0].rows.map(transformLog);

        return [logs, Number(count)];
    } finally {
        client.release();
    }
}
