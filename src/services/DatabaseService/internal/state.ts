import pg from 'pg';
import { EnvHelpers } from '../../../utils/index.js';

export let pool: pg.Pool;

export async function initialiseState(): Promise<void> {
    const host = EnvHelpers.getStringOrThrow('DB_HOST');
    const user = EnvHelpers.getStringOrThrow('DB_USER');
    const database = EnvHelpers.getStringOrThrow('DB_NAME');
    const password = EnvHelpers.getStringOrThrow('DB_PASSWORD');
    const port = EnvHelpers.getPortOrThrow(
        'DB_PORT',
        (x) => x.split(':').at(-1) ?? x,
    );

    pool = new pg.Pool({ host, user, database, password, port });

    // Table Creation

    await pool.query(
        `CREATE TABLE IF NOT EXISTS users(
        discord_id VARCHAR(32) PRIMARY KEY,
        minecraft_username VARCHAR(16) NOT NULL UNIQUE,
        state INTEGER NOT NULL DEFAULT 0,
        added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`,
    );

    await pool.query(`CREATE TABLE IF NOT EXISTS user_logs (
        id SERIAL PRIMARY KEY,
        done_to VARCHAR(32) NOT NULL CONSTRAINT fk_user REFERENCES users(discord_id) ON DELETE CASCADE,
        done_by VARCHAR(32) NOT NULL,
        done_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        reason VARCHAR(255),
        previous_state INTEGER NOT NULL
        )`);

    // Index Creation

    await Promise.all([
        // pool.query(
        //     `CREATE INDEX IF NOT EXISTS idx_user_minecraft_username ON users (minecraft_username)`,
        // ),
        pool.query(
            `CREATE INDEX IF NOT EXISTS idx_user_logs_done_to ON user_logs (done_to)`,
        ),
        // pool.query(
        //     `CREATE INDEX IF NOT EXISTS idx_user_logs_done_by ON user_logs (done_by)`,
        // ),
    ]);
}
