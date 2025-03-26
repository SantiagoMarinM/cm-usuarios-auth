import { HTTPSTATUSCODE } from '@common/modules/Ruta';
import CustomError from '@common/utils/CustomError';

export class EventException extends CustomError {
    message: string;

    details?: unknown[];

    constructor(cause: string, eventName: string, details?: unknown[]) {
        super(cause, HTTPSTATUSCODE.INTERNAL);
        this.details = details;
        this.message = `Error al publicar al evento ${eventName}`;
    }
}
