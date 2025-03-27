export interface IDataCrearClienteToken {
    nombre_cliente: string;
    apikey: string;
    clave: string;
    activo: boolean;
    apikey_hash: string;
}

export interface IDataValidarIdClienteOut {
    apikey: string;
    activo: boolean;
    tiempo_expiracion: string;
}
