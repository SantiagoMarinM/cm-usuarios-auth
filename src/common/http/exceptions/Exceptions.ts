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

export class PostgresError extends Exception {
    constructor(message: string) {
        const fsError = ErrorCode.REPOSITORY_ERROR;
        super(message, ErrorCode.POSTGRES_ERROR, StatusCode.INTERNAL_ERROR, fsError);
    }
}
