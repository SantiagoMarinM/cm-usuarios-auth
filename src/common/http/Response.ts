interface ErrorResponse {
    isError: boolean;
    statusCode: number;
    message: string;
}

export interface ResponseMethod<T> {
    data: T;
    message: string;
}
export interface Response<T> {
    response: T | ErrorResponse;
    status: number;
}
