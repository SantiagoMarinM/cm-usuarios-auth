class CustomError extends Error {
    private status: number;
    private isError = true;
    constructor(message: string, code: number, isError?: boolean) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.status = code;
        this.isError = isError ?? true;
    }
    get isCustomError() {
        return this.isError;
    }
    get statusCode() {
        return this.status;
    }
}

export default CustomError;
