import { Log } from '@modules/shared';

export interface Request<T> {
    data: T;
    logger: Log;
    ip: string;
    headers: unknown;
}
