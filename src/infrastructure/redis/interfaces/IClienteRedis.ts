import { IDataValidarIdClienteOut } from '@modules/ClienteToken/domain/interfaces';

export default interface IClienteRedis {
    setClienteToken(key: string, value: object): Promise<void>;
    getIdCliente(key: string): Promise<IDataValidarIdClienteOut | null>;
    flushAll(): Promise<void>;
}
