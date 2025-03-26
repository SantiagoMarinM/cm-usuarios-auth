import { injectable } from 'inversify';
import TYPESDEPENDENCIES from '../dependencies/TypesDependencies';
import { GLOBAL_CONTAINER } from '@common/dependencies/DependencyContainer';
import { UNAUTHORIZED } from '@common/http/exceptions';
import { ENV } from '@modules/shared';
import jwt from 'jsonwebtoken';
import ValidarIdClienteUseCase from './ValidarIdClienteUseCase';
import { CLIENTE_INACTIVO, CLIENTE_INVALIDO, TOKEN_EXPIRADO } from '../constants/errorMessages';

@injectable()
export default class ValidarTokenUseCase {
    private readonly validarIdClienteUseCase = GLOBAL_CONTAINER.get<ValidarIdClienteUseCase>(
        TYPESDEPENDENCIES.ValidarIdClienteUseCase,
    );

    async execute(id_cliente: string, token: string): Promise<void> {
        console.log('id_cliente>>', id_cliente);
        console.log('token>>', token);
        const cliente = await this.validarIdClienteUseCase.execute(id_cliente);
        if (!cliente) throw new UNAUTHORIZED('Acceso no autorizado', '401', CLIENTE_INVALIDO);
        if (!cliente.activo) throw new UNAUTHORIZED('Acceso no autorizado', '401', CLIENTE_INACTIVO);
        try {
            jwt.verify(token, ENV.LLAVE_SECRETA);
        } catch (err) {
            throw new UNAUTHORIZED('Token inválido', '401', TOKEN_EXPIRADO);
        }
    }
}
