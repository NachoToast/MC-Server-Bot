import {
    ChatInputCommandInteraction,
    GuildMember,
    SlashCommandBuilder,
} from 'discord.js';
import { CommandPermissionLevel } from '../types/CommandPermissionLevel.js';

export interface Command {
    permissionLevel: CommandPermissionLevel;

    name: string;

    description: string;

    build?(base: SlashCommandBuilder): void;

    execute(
        interaction: ChatInputCommandInteraction,
        member: GuildMember,
    ): Promise<void>;
}
