export interface ICrearCliente {
    nombre_cliente: string;
    activo: boolean;
}

export interface IGenerarToken {
    'x-client-id': string;
    'x-request-id': string;
}
