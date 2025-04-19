import {
    ChannelType,
    Client,
    GatewayIntentBits,
    Guild,
    Role,
    Snowflake,
    TextChannel,
} from 'discord.js';
import { EnvHelpers } from '../../../utils/index.js';

export let client: Client<true>;

export let mainGuild: Guild;

export let adminChannel: TextChannel;

export let publicChannel: TextChannel;

export let developerID: Snowflake;

export let notificationRole: Role;

async function fetchAndValidateChannel(
    channelId: Snowflake,
): Promise<TextChannel> {
    const channel = await mainGuild.channels.fetch(channelId);

    if (channel === null) {
        throw new Error(
            `Channel ${channelId} not found in guild ${mainGuild.name}`,
        );
    }

    if (channel.type !== ChannelType.GuildText) {
        throw new Error(
            `Expected channel ${channel.name} (${
                channel.id
            }) to be a text channel (got ${ChannelType[channel.type]})`,
        );
    }

    return channel;
}

export async function initialiseState(): Promise<void> {
    const token = EnvHelpers.getStringOrThrow('DISCORD_BOT_TOKEN');

    const mainGuildID = EnvHelpers.getStringOrThrow('MAIN_GUILD_ID');

    const adminChannelID = EnvHelpers.getStringOrThrow('ADMIN_CHANNEL_ID');
    const publicChannelId = EnvHelpers.getStringOrThrow('PUBLIC_CHANNEL_ID');

    developerID = EnvHelpers.getStringOrThrow('DEVELOPER_ID');

    const notificationRoleId = EnvHelpers.getStringOrThrow(
        'NOTIFICATION_ROLE_ID',
    );

    client = new Client<true>({ intents: [GatewayIntentBits.Guilds] });

    client.on('error', (error) => {
        console.error(`Discord client error`, error);
        process.exit(-1);
    });

    await client.login(token);

    mainGuild = await client.guilds.fetch(mainGuildID);

    const [thisAdminChannel, thisPublicChannel, thisNotificationRole] =
        await Promise.all([
            fetchAndValidateChannel(adminChannelID),
            fetchAndValidateChannel(publicChannelId),
            mainGuild.roles.fetch(notificationRoleId),
        ]);

    if (thisNotificationRole === null) {
        throw new Error(
            `Role ${notificationRoleId} not found in guild ${mainGuild.name}`,
        );
    }

    adminChannel = thisAdminChannel;
    publicChannel = thisPublicChannel;
    notificationRole = thisNotificationRole;
}
