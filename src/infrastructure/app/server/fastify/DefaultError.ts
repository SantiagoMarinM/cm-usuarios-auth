/* eslint-disable no-undef */
export interface DefaultErrorModel {
    message: string;
    isError: boolean;
    cause: unknown;
    stack?: string;
    code: number;
    statusCode: number;
    defaultMessage: string;
    details: unknown;
}
