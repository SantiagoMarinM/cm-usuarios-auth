import { HTTPSTATUSCODE } from '@common/modules/Ruta';
import CustomError from '@common/utils/CustomError';
import { ESQUEMA_ERRONEO } from '@modules/shared/config/schemas/constants';

export class BadMessageException extends CustomError {
    message: string;

    details?: unknown[];

    constructor(cause: string, details?: unknown[]) {
        super(cause, HTTPSTATUSCODE.BAD_MESSAGE);
        this.details = details;
        this.message = ESQUEMA_ERRONEO;
    }
}
