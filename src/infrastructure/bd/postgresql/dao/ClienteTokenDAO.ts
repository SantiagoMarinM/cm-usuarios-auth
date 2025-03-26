import { GLOBAL_CONTAINER } from '@common/dependencies/DependencyContainer';
import { UNAUTHORIZED } from '@common/http/exceptions';
import TYPESDEPENDENCIES from '@modules/ClienteToken/dependencies/TypesDependencies';
import { IDataCrearClienteToken, IDataValidarIdClienteOut } from '@modules/ClienteToken/domain/interfaces';
import { IClienteTokenRepository } from '@modules/ClienteToken/domain/repositories/ClienteTokenRepository';
import { injectable } from 'inversify';
import { IDatabase, IMain, as } from 'pg-promise';
import { insertCliente, selectValidarCliente } from './querys/ClienteTokenQuery';

@injectable()
export class ClienteTokenDAO implements IClienteTokenRepository {
    private readonly db = GLOBAL_CONTAINER.get<IDatabase<IMain>>(TYPESDEPENDENCIES.Postgresql);

    async crearCliente(data: IDataCrearClienteToken): Promise<number | null> {
        try {
            const query = as.format(insertCliente, [data.nombre_cliente, data.activo, data.apikey_hash, data.clave]);
            const result = await this.db.query(query);
            return result.length > 0 ? result : null;
        } catch (error) {
            throw new UNAUTHORIZED('Error al crear cliente', '401', error.message);
        }
    }

    async validarIdCliente(clave: string): Promise<IDataValidarIdClienteOut | null> {
        try {
            const query = as.format(selectValidarCliente, [clave]);
            const response = await this.db.oneOrNone(query);
            return response;
        } catch (error) {
            throw new UNAUTHORIZED('Error al consultar el cliente', '401', error.message);
        }
    }
}
