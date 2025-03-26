import { IDataCrearClienteToken, IDataValidarIdClienteOut } from '@modules/ClienteToken/domain/interfaces';

export interface IClienteTokenRepository {
    crearCliente(data: IDataCrearClienteToken): Promise<number | null>;
    validarIdCliente(id_cliente: string): Promise<IDataValidarIdClienteOut | null>;
}
