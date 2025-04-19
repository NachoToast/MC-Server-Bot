import { PermissionFlagsBits } from 'discord.js';
import { CommandPermissionLevel } from '../../../types/CommandPermissionLevel.js';

export function getPermissionsFor(
    level: CommandPermissionLevel,
): bigint | null {
    switch (level) {
        case CommandPermissionLevel.Everyone:
            return null;
        case CommandPermissionLevel.AdminsOnly:
            return PermissionFlagsBits.BanMembers;
        case CommandPermissionLevel.DeveloperOnly:
            return PermissionFlagsBits.Administrator;
    }
}
