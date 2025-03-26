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

@injectable()
export default class ClienteTokenRouter {
    async generarToken(req: Request<IValidarTokenIn>): Promise<Response<IGenerarTokenResponse>> {
        const generarTokenUseCase = GLOBAL_CONTAINER.get<GenerarTokenUseCase>(TYPESDEPENDENCIES.GenerarTokenUseCase);
        const dataRequest = req.headers as Record<string, string>;
        new JsonValidator().validate(schemas.GenerarTokenSchema, dataRequest);
        try {
            const resultado = await generarTokenUseCase.execute(dataRequest);

            const response = {
                isError: false,
                statusCode: +EXCEPCIONES_GLOBALES.PETICION_EXITOSA.CODIGO,
                autorizado: true,
                token: resultado,
                message: 'Token generado exitosamente',
            };
            return { response, status: 200 };
        } catch (error) {
            return {
                response: {
                    isError: true,
                    autorizado: false,
                    token: null,
                    message: error.error.message,
                },
                status: error.statusCode,
            };
        }
    }

    async validarToken(req: Request<IValidarTokenIn>): Promise<Response<ValidarTokenResponse>> {
        const headers = req.headers as Record<string, string>;
        new JsonValidator().validate(schemas.ValidarTokenSchema, headers);
        const token = headers.authorization.replace(/^Bearer\s+/i, '');
        const validarTokenUseCase = GLOBAL_CONTAINER.get<ValidarTokenUseCase>(TYPESDEPENDENCIES.ValidarTokenUseCase);
        try {
            await validarTokenUseCase.execute(headers['x-client-id'], token);

            return {
                response: {
                    isError: false,
                    autorizado: true,
                    message: 'Token válido',
                },
                status: 200,
            };
        } catch (error) {
            return {
                response: {
                    isError: true,
                    autorizado: false,
                    message: error.error.message ?? 'Token inválido',
                },
                status: error.statusCode ?? 401,
            };
        }
    }

    async eliminarRedis(): Promise<Response<ResponseMethod<void>>> {
        const redis = GLOBAL_CONTAINER.get<IClienteRedis>(TYPESDEPENDENCIES.RedisRepoCache);

        await redis.flushAll();

        const response = {
            isError: false,
            statusCode: +EXCEPCIONES_GLOBALES.PETICION_EXITOSA.CODIGO,
            message: 'Datos eliminados exitosamente',
        };
        return { response, status: 200 };
    }
}
