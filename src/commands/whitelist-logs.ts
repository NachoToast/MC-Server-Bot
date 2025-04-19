import { DatabaseService } from '../services/index.js';
import { CommandPermissionLevel } from '../types/CommandPermissionLevel.js';
import { EmbedHelpers } from '../utils/index.js';
import { Command } from './Command.js';

const PER_PAGE = 10;
export const whitelistLogsCommand: Command = {
    permissionLevel: CommandPermissionLevel.AdminsOnly,

    name: 'whitelist-logs',

    description: 'Get the logs of a user',

    build(base) {
        base.addUserOption((option) =>
            option
                .setName('user')
                .setDescription('The Discord user to fetch the logs of')
                .setRequired(true),
        ).addIntegerOption((option) =>
            option
                .setName('page')
                .setDescription('The page of logs to fetch')
                .setRequired(false)
                .setMinValue(1),
        );
    },

    async execute(interaction) {
        const user = interaction.options.getUser('user', true);

        await interaction.deferReply();

        const page = interaction.options.getInteger('page') ?? 1;

        const [[logs, totalCount], fetchedUser] = await Promise.all([
            DatabaseService.getUserLogs(user.id, page, PER_PAGE),
            DatabaseService.getUser(user.id),
        ]);

        await interaction.editReply(
            EmbedHelpers.makeLogsEmbed(
                fetchedUser,
                user,
                logs,
                page,
                PER_PAGE,
                totalCount,
            ),
        );
    },
};
