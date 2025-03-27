export interface Ruta {
    metodo: HTTPMETODOTYPE;
    url: string;
    evento: CallableFunction;
    handler?: Record<string, any>;
    schema?: Record<string, any>;
}

type HTTPMETODOTYPE = 'get' | 'post' | 'put' | 'delete' | 'patch';

export enum HTTPMETODO {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete',
    PATCH = 'patch',
}
export enum HTTPSTATUSCODE {
    OK = 200,
    INTERNAL = 200,
    UNPROCESSABLE_CONTENT = 422,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_MESSAGE = 400,
}
