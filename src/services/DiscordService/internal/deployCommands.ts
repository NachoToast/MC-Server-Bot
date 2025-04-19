import {
    InteractionContextType,
    REST,
    Routes,
    SlashCommandBuilder,
} from 'discord.js';
import * as allCommands from '../../../commands/index.js';
import { EnvHelpers } from '../../../utils/index.js';
import { getPermissionsFor } from './getPermissionFor.js';
import { client, mainGuild } from './state.js';

export async function deployCommands(): Promise<void> {
    if (EnvHelpers.getBoolOrThrow('SKIP_COMMAND_DEPLOYMENT')) {
        return;
    }

    const body = Object.values(allCommands).map((command) => {
        const builtCommand = new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description)
            .setContexts(InteractionContextType.Guild)
            .setDefaultMemberPermissions(
                getPermissionsFor(command.permissionLevel),
            );

        command.build?.(builtCommand);

        return builtCommand.toJSON();
    });

    const rest = new REST({ version: '9' }).setToken(client.token);

    await rest.put(
        Routes.applicationGuildCommands(client.application.id, mainGuild.id),
        {
            body,
        },
    );
}
