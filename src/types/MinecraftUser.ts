import { Snowflake } from 'discord.js';
import { MinecraftUserState } from './UserState.js';

export interface MinecraftUser {
    discordId: Snowflake;

    minecraftUsername: string;

    state: MinecraftUserState;

    addedAt: Date;
}
