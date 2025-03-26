import { injectable } from 'inversify';
import TYPESDEPENDENCIES from '../dependencies/TypesDependencies';
import { GLOBAL_CONTAINER } from '@common/dependencies/DependencyContainer';
import { InternalError, UNAUTHORIZED } from '@common/http/exceptions';
import { ENV } from '@modules/shared';
import jwt from 'jsonwebtoken';
import ValidarIdClienteUseCase from './ValidarIdClienteUseCase';

@injectable()
export default class GenerarTokenUseCase {
    private readonly validarIdClienteUseCase = GLOBAL_CONTAINER.get<ValidarIdClienteUseCase>(
        TYPESDEPENDENCIES.ValidarIdClienteUseCase,
    );

    async execute(data: any): Promise<string> {
        const cliente = await this.validarIdClienteUseCase.execute(data['x-client-id']);
        const secretKey = ENV.LLAVE_SECRETA ?? 'secretKey';

        if (!cliente.activo) throw new UNAUTHORIZED('Acceso no autorizado', '401', 'El cliente no se encuentra activo');

        try {
            const token = jwt.sign(
                {
                    id_cliente: data['x-client-id'],
                    id_peticion: data['x-request-id'],
                    activo: cliente.activo,
                },
                secretKey,
                { expiresIn: cliente.tiempo_expiracion },
            );

            return token;
        } catch (error) {
            throw new InternalError(`Error al generar el token: ${error.message}`, '500');
        }
    }
}
