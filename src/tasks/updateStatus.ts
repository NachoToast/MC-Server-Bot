import { ActivityType } from 'discord.js';
import { schedule } from 'node-cron';
import { DatabaseService, DiscordService } from '../services/index.js';

let lastSeenEntryCount = -1;

async function updateStatus(): Promise<void> {
    const entryCount = await DatabaseService.countUsers();

    if (entryCount === lastSeenEntryCount) {
        return;
    }

    lastSeenEntryCount = entryCount;

    DiscordService.getClient().user.setActivity({
        name: `${entryCount.toLocaleString()} Applications`,
        type: ActivityType.Watching,
    });
}

export async function startUpdateStatusTask(): Promise<void> {
    await updateStatus();

    schedule('*/5 * * * *', () => {
        updateStatus().catch(DiscordService.handleError);
    });
}
