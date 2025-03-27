import { injectable } from 'inversify';
import TYPESDEPENDENCIES from '../dependencies/TypesDependencies';
import { IClienteTokenRepository } from '../domain/repositories/ClienteTokenRepository';
import { IDataValidarIdClienteOut } from '../domain/interfaces';
import { GLOBAL_CONTAINER } from '@common/dependencies/DependencyContainer';
import IClienteRedis from '@infrastructure/redis/interfaces/IClienteRedis';
import { UNAUTHORIZED } from '@common/http/exceptions';

@injectable()
export default class ValidarIdClienteUseCase {
    private readonly redis = GLOBAL_CONTAINER.get<IClienteRedis>(TYPESDEPENDENCIES.RedisRepoCache);
    private readonly repository = GLOBAL_CONTAINER.get<IClienteTokenRepository>(
        TYPESDEPENDENCIES.IClienteTokenRepository,
    );

    async execute(nombre_cliente: string): Promise<IDataValidarIdClienteOut> {
        const id = await this.redis.getIdCliente(`auth${nombre_cliente}`);
        if (!id) {
            const validarIdClientDao = await this.repository.validarIdCliente(nombre_cliente);
            if (!validarIdClientDao) throw new UNAUTHORIZED('Error al validar cliente', '401', 'Cliente no encontrado');

            if (validarIdClientDao.activo) {
                this.redis.setClienteToken(`auth${nombre_cliente}`, {
                    activo: validarIdClientDao.activo,
                    tiempo_expiracion: '1h',
                });
            }
            return validarIdClientDao;
        }
        return id;
    }
}
