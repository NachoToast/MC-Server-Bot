import { startUpdateStatusTask } from './updateStatus.js';

export async function startAllTasks(): Promise<void> {
    await startUpdateStatusTask();
}
