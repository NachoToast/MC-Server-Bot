import { bold, time, TimestampStyles } from 'discord.js';
import { DiscordService } from '../services/index.js';
import { CommandPermissionLevel } from '../types/CommandPermissionLevel.js';
import { Command } from './Command.js';

export const pingCommand: Command = {
    permissionLevel: CommandPermissionLevel.Everyone,

    name: 'ping',

    description: "See if NachoToast's internet is down",

    async execute(interaction) {
        const ping = Math.abs(Date.now() - interaction.createdTimestamp);

        const client = DiscordService.getClient();

        const apiLatency = Math.abs(Math.round(client.ws.ping));

        const startedAt = client.readyAt;

        const memoryUsage = process.memoryUsage().heapUsed / 1024 ** 2;

        const output: string[] = [
            bold('Pong!'),
            `> Ping: ${ping.toLocaleString()}ms`,
            `> API Latency: ${apiLatency.toLocaleString()}ms`,
            `> Started: ${time(startedAt, TimestampStyles.RelativeTime)}`,
            `> Memory: ${Math.ceil(memoryUsage).toLocaleString()} MB`,
        ];

        await interaction.reply(output.join('\n'));
    },
};
