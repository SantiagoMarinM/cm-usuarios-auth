import { Request } from '@common/http/Request';
import { Response, ResponseMethod } from '@common/http/Response';
import { JsonValidator } from '@modules/shared/config/schemas';
import * as schemas from '../schemas/ClienteTokenSchemas';
import { GLOBAL_CONTAINER } from '@common/dependencies/DependencyContainer';
import { EXCEPCIONES_GLOBALES } from '@common/http/exceptions';
import TYPESDEPENDENCIES from '../dependencies/TypesDependencies';
import IClienteRedis from '@infrastructure/redis/interfaces/IClienteRedis';

import GenerarTokenUseCase from '../useCase/GenerarTokenUseCase';
import ValidarTokenUseCase from '../useCase/ValidarTokenUseCase';
import { injectable } from 'inversify';
import { ValidarTokenResponse } from '../application/data/out/IValidarTokenResponse';
import { IValidarTokenIn } from '../application/data/in/IValidarTokenIn';
import { IGenerarTokenResponse } from '../application/data/out/IGenerarTokenResponse';
import { ErrorMensajeStatus } from '@common/interfaces';

@injectable()
export default class ClienteTokenRouter {
    async generarToken(req: Request<IValidarTokenIn>): Promise<Response<IGenerarTokenResponse>> {
        const headers = req.headers as Record<string, string>;
        new JsonValidator().validate(schemas.GenerarTokenSchema, headers);
        const generarTokenUseCase = GLOBAL_CONTAINER.get<GenerarTokenUseCase>(TYPESDEPENDENCIES.GenerarTokenUseCase);
        try {
            const resultado = await generarTokenUseCase.execute(headers);
            return this.respuestaGenerarTokenExitoso(resultado);
        } catch (error) {
            return this.respuestaGenerarTokenError(error);
        }
    }

    async validarToken(req: Request<IValidarTokenIn>): Promise<Response<ValidarTokenResponse>> {
        const headers = req.headers as Record<string, string>;
        new JsonValidator().validate(schemas.ValidarTokenSchema, headers);
        const validarTokenUseCase = GLOBAL_CONTAINER.get<ValidarTokenUseCase>(TYPESDEPENDENCIES.ValidarTokenUseCase);
        const token = headers.authorization.replace(/^Bearer\s+/i, '');
        const idCliente = headers['x-client-id'];
        try {
            await validarTokenUseCase.execute(idCliente, token);
            return this.respuestaValidarTokenExitoso();
        } catch (error) {
            return this.respuestaValidarTokenError(error);
        }
    }

    async eliminarRedis(): Promise<Response<ResponseMethod<void>>> {
        const redis = GLOBAL_CONTAINER.get<IClienteRedis>(TYPESDEPENDENCIES.RedisRepoCache);
        await redis.flushAll();
        return {
            response: {
                isError: false,
                statusCode: +EXCEPCIONES_GLOBALES.PETICION_EXITOSA.CODIGO,
                message: 'Datos eliminados exitosamente',
            },
            status: 200,
        };
    }

    private respuestaGenerarTokenExitoso(token: string): Response<IGenerarTokenResponse> {
        return {
            response: {
                isError: false,
                autorizado: true,
                statusCode: +EXCEPCIONES_GLOBALES.PETICION_EXITOSA.CODIGO,
                token,
                message: 'Token generado exitosamente',
            },
            status: 200,
        };
    }

    private respuestaGenerarTokenError(error: ErrorMensajeStatus): Response<IGenerarTokenResponse> {
        return {
            response: {
                isError: true,
                autorizado: false,
                token: null,
                message: error?.error?.message ?? 'Error generando token',
            },
            status: error?.statusCode ?? 400,
        };
    }

    private respuestaValidarTokenExitoso(): Response<ValidarTokenResponse> {
        return {
            response: {
                isError: false,
                autorizado: true,
                message: 'Token válido',
            },
            status: 200,
        };
    }

    private respuestaValidarTokenError(error: ErrorMensajeStatus): Response<ValidarTokenResponse> {
        return {
            response: {
                isError: true,
                autorizado: false,
                message: error?.error?.message ?? 'Token inválido',
            },
            status: error?.statusCode ?? 401,
        };
    }
}
