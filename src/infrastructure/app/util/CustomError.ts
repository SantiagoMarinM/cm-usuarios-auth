/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
class CustomError extends Error {
    private status: number;
    private isError = true;
    declare cause: string;
    constructor(message: string, code: number, cause: string, isError?: boolean) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.status = code;
        this.isError = isError ?? true;
        this.cause = cause;
    }
    get isCustomError() {
        return this.isError;
    }
    get statusCode() {
        return this.status;
    }
}

export default CustomError;
