export interface HeadersSchema {
    'x-client-name': string;
    'x-client-devices': string;
    'x-request-id': string;
    'x-timestamp': string;
    'codigo-empleado': string;
    'id-apertura': number;
}

export interface ICrearCliente {
    nombre_cliente: string;
    activo: boolean;
}

export interface IGenerarToken {
    'x-client-id': string;
    'x-request-id': string;
}

export interface IValidarToken {
    'x-client-id': string;
    'x-request-id': string;
    token: string;
}

export interface IEnviarCorreo {
    nombre_cliente: string;
    expiracion_token: string;
    id_cliente: string;
    id_peticion: string;
}
