import { ErrorCode, StatusCode } from './ErrorCode';

export abstract class Exception {
    isError: boolean;
    statusCode: number;
    message: string;
    code: ErrorCode;
    cause: string | null;

    constructor(message: string, code: ErrorCode, statusCode: number, cause?: string) {
        this.isError = true;
        this.statusCode = statusCode;
        this.message = message;
        this.code = code;
        this.cause = cause ?? null;
    }
}

export class DinamicException {
    isError: boolean;
    statusCode: StatusCode;
    message: string;
    autorizado: boolean;
    error: {
        message: string;
        code: string;
        autorizado: boolean;
        stack?: string;
    };
    data: any[];

    constructor(
        message: string,
        statusCode: StatusCode,
        codeError: string,
        stack?: string,
        data?: any[],
        autorizado = false,
    ) {
        this.isError = true;
        this.statusCode = statusCode;
        this.message = 'Ha ocurrido un error';
        this.autorizado = autorizado;
        this.error = {
            message: message,
            code: codeError,
            autorizado: autorizado,
            stack: stack,
        };
        this.data = data ?? [];
    }
}

export class BadMessageException extends DinamicException {
    constructor(message: string, code: string, stack?: string, data?: any) {
        super(message, StatusCode.BAD_REQUEST, code, stack, data);
    }
}

export class UNAUTHORIZED extends DinamicException {
    constructor(message: string, code: string, stack?: string, data?: any, autorizado?: boolean) {
        super(message, StatusCode.UNAUTHORIZED, code, stack, data, autorizado);
    }
}

export class InternalError extends DinamicException {
    constructor(message: string, code: string, stack?: string) {
        super(message, StatusCode.INTERNAL_ERROR, code, stack);
    }
}

export class PreconditionFailed extends DinamicException {
    constructor(message: string, code: string, stack?: string, data?: any) {
        super(message, StatusCode.PRECONDITION_FAILED, code, stack, data);
    }
}
export class Conflict extends DinamicException {
    constructor(message: string, code: string, stack?: string, data?: any) {
        super(message, StatusCode.CONFLICT, code, stack, data);
    }
}

export class DataNoContent extends DinamicException {
    constructor(message: string, code: string, stack?: string, data?: any) {
        super(message, StatusCode.OK, code, stack, data);
    }
}

export class RequestSuccess extends Exception {
    constructor(cause: string, message: string) {
        super(message, ErrorCode.OK, StatusCode.OK, cause);
    }
}

export class DataNotFound extends Exception {
    constructor(cause: string, message: string) {
        super(message, ErrorCode.OK, StatusCode.OK, cause);
    }
}

export class IdempotencyException extends Exception {
    constructor(cause: string, message: string) {
        super(message, ErrorCode.BAD_MESSAGE, StatusCode.ACCEPTED, cause);
    }
}

export class AxiosError extends Exception {
    constructor(message: string, cause?: string) {
        super(message, ErrorCode.AXIOS_ERROR, StatusCode.INTERNAL_ERROR, cause);
    }
}

export class PostgresError extends Exception {
    constructor(message: string) {
        const fsError = ErrorCode.REPOSITORY_ERROR;
        super(message, ErrorCode.POSTGRES_ERROR, StatusCode.INTERNAL_ERROR, fsError);
    }
}
export class RedisError extends Exception {
    constructor(message: string) {
        const fsError = ErrorCode.REDIS_ERROR;
        super(message, ErrorCode.REDIS_ERROR, StatusCode.INTERNAL_ERROR, fsError);
    }
}

export class RepositoryException extends Exception {
    constructor() {
        const message = 'Ocurrió un error al momento de guardar la guía';
        super(message, ErrorCode.REPOSITORY_ERROR, StatusCode.INTERNAL_ERROR);
    }
}

export class PubSubException extends Exception {
    constructor(message: string, cause: string) {
        super(message, ErrorCode.PUBSUB_ERROR, StatusCode.INTERNAL_ERROR, cause);
    }
}

export class FirestoreException extends Exception {
    constructor(code: number | string | undefined, message: string) {
        const fsError = ErrorCode.REPOSITORY_ERROR;
        switch (code) {
            case 1:
            case '1':
                super(message, fsError, StatusCode.INTERNAL_ERROR, 'Firestore action cancelled');
                break;
            case 2:
            case '2':
                super(message, fsError, StatusCode.INTERNAL_ERROR, 'Firestore unknown error');
                break;
            case 3:
            case '3':
                super(message, fsError, StatusCode.OK, 'Firestore invalid argument');
                break;
            case 4:
            case '4':
                super(message, fsError, StatusCode.INTERNAL_ERROR, 'Firestore deadline exceeded');
                break;
            case 5:
            case '5':
                super(message, fsError, StatusCode.INTERNAL_ERROR, 'Update nonexistent document');
                break;
            case 6:
            case '6':
                super(message, fsError, StatusCode.OK, 'Firestore document already exists');
                break;
            case 7:
            case '7':
                super(message, fsError, StatusCode.INTERNAL_ERROR, 'Firestore permission denied');
                break;
            case 8:
            case '8':
                super(message, fsError, StatusCode.OK, 'Firestore resource exhausted');
                break;
            case 9:
            case '9':
                super(message, fsError, StatusCode.INTERNAL_ERROR, 'Firestore precondition failed');
                break;
            default:
                super(message, fsError, StatusCode.INTERNAL_ERROR, 'Defaulted unkwnown fs error');
                break;
        }
    }
}

export abstract class ExceptionOk {
    isError: boolean;
    statusCode: number;
    message: string;
    data: any;

    constructor(message: string, statusCode: number) {
        this.isError = false;
        this.statusCode = statusCode;
        this.message = message;
        this.data = [];
    }
}

export class RequestSuccessOk extends ExceptionOk {
    constructor(message: string, statusCode: StatusCode = StatusCode.OK) {
        super(message, statusCode);
    }
}

export class RequestSuccessNotContent extends DinamicException {
    constructor(message: string, code: string, stack?: string, data?: any) {
        super(message, StatusCode.NO_CONTENT, code, stack, data);
    }
}
