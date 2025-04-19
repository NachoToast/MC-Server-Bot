import { Snowflake } from 'discord.js';
import { MinecraftUserState } from './UserState.js';

export interface MinecraftUserLog {
    id: number;

    doneTo: Snowflake;

    doneBy: Snowflake;

    doneAt: Date;

    reason: string | null;

    previousState: MinecraftUserState;
}
