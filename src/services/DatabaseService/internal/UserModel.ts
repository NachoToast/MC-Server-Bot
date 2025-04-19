/* eslint-disable @typescript-eslint/naming-convention */

import { MinecraftUser } from '../../../types/MinecraftUser.js';
import { MinecraftUserState } from '../../../types/UserState.js';

export interface UserModel {
    discord_id: string;

    minecraft_username: string;

    state: number;

    added_at: string;
}

export function transformUser(user: UserModel): MinecraftUser {
    const { discord_id, minecraft_username, state, added_at } = user;

    return {
        discordId: discord_id,
        minecraftUsername: minecraft_username,
        state: state as MinecraftUserState,
        addedAt: new Date(added_at),
    };
}
