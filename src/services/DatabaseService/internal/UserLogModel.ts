/* eslint-disable @typescript-eslint/naming-convention */

import { MinecraftUserLog } from '../../../types/MinecraftUserLog.js';

export interface LogModel {
    id: number;

    done_to: string;

    done_by: string;

    done_at: string;

    reason: string | null;

    previous_state: number;
}

export function transformLog(log: LogModel): MinecraftUserLog {
    const { id, done_to, done_by, done_at, reason, previous_state } = log;

    return {
        id,
        doneTo: done_to,
        doneBy: done_by,
        doneAt: new Date(done_at),
        reason,
        previousState: previous_state,
    };
}
