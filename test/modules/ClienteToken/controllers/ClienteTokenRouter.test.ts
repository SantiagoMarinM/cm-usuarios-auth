import { GLOBAL_CONTAINER } from '@common/dependencies/DependencyContainer';
import TYPESDEPENDENCIES from '@modules/ClienteToken/dependencies/TypesDependencies';
import ClienteTokenRouter from '@modules/ClienteToken/controllers/ClienteTokenRouter';
import GenerarTokenUseCase from '@modules/ClienteToken/useCase/GenerarTokenUseCase';
import ValidarTokenUseCase from '@modules/ClienteToken/useCase/ValidarTokenUseCase';
import IClienteRedis from '@infrastructure/redis/interfaces/IClienteRedis';
import { ErrorCode, InternalError, UNAUTHORIZED } from '@common/http/exceptions';
import { TOKEN_EXPIRADO } from '@modules/ClienteToken/constants/errorMessages';

jest.mock('@common/dependencies/DependencyContainer');
jest.mock('@modules/shared/config/schemas');
jest.mock('@modules/ClienteToken/domain/services');

describe('ClienteTokenRouter', () => {
    let router: ClienteTokenRouter;
    let generarTokenUseCase: jest.Mocked<GenerarTokenUseCase>;
    let validarTokenUseCase: jest.Mocked<ValidarTokenUseCase>;
    let redis: jest.Mocked<IClienteRedis>;

    beforeEach(() => {
        generarTokenUseCase = { execute: jest.fn() } as unknown as jest.Mocked<GenerarTokenUseCase>;
        validarTokenUseCase = { execute: jest.fn() } as unknown as jest.Mocked<ValidarTokenUseCase>;
        redis = { flushAll: jest.fn() } as unknown as jest.Mocked<IClienteRedis>;

        (GLOBAL_CONTAINER.get as jest.Mock).mockImplementation((type: symbol) => {
            switch (type) {
                case TYPESDEPENDENCIES.GenerarTokenUseCase:
                    return generarTokenUseCase;
                case TYPESDEPENDENCIES.ValidarTokenUseCase:
                    return validarTokenUseCase;
                case TYPESDEPENDENCIES.RedisRepoCache:
                    return redis;
                default:
                    return null;
            }
        });

        router = new ClienteTokenRouter();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('generarToken', () => {
        it('debería generar un token correctamente', async () => {
            const mockData = { cliente: 'test', clave: '1234' };
            const mockToken = {
                autorizado: true,
                data: { token: 'test_token' },
                isError: false,
                message: 'Token generado exitosamente',
                statusCode: 200,
                token: 'test_token',
            };
            generarTokenUseCase.execute.mockResolvedValue(mockToken.data.token);

            const req = { data: mockData } as any;
            const res = await router.generarToken(req);

            expect(generarTokenUseCase.execute).toHaveBeenCalledWith(mockData);
            expect(res.status).toBe(200);
            expect(res.response).toEqual(mockToken);
        });

        it('debería manejar error al generar un token', async () => {
            const mockData = { cliente: 'test', clave: '1234' };
            const mockResError = {
                autorizado: false,
                data: [],
                error: {
                    autorizado: false,
                    code: 'INTERNAL_ERROR',
                    message: 'Error al generar el token',
                    stack: undefined,
                },
                isError: true,
                message: 'Ha ocurrido un error',
                statusCode: 500,
            };
            const mockError = new InternalError(`Error al generar el token`, ErrorCode.INTERNAL_ERROR);
            generarTokenUseCase.execute.mockRejectedValue(mockError);

            const req = { data: mockData } as any;
            const res = await router.generarToken(req);

            expect(res.status).toBe(500);
            expect(res.response.message).toEqual(mockResError);
        });
    });

    describe('validarToken', () => {
        it('debería validar un token correctamente', async () => {
            const mockData = { token: 'test_token' };
            validarTokenUseCase.execute.mockResolvedValue(undefined);

            const req = { data: mockData } as any;
            const res = await router.validarToken(req);

            expect(validarTokenUseCase.execute).toHaveBeenCalledWith(mockData);
            expect(res.status).toBe(200);
            expect(res.response.message).toBe('Token valido');
        });

        it('debería manejar error al validar un token', async () => {
            const mockData = { token: 'test_token' };
            const mockError = new UNAUTHORIZED('Token inválido', '401', TOKEN_EXPIRADO);
            const mockResError = {
                isError: true,
                statusCode: 401,
                message: 'Ha ocurrido un error',
                autorizado: false,
                error: {
                    message: 'Token inválido',
                    code: '401',
                    autorizado: false,
                    stack: 'La petición no es autorizada el token no existe o ya expiro.',
                },
                data: [],
            };
            validarTokenUseCase.execute.mockRejectedValue(mockError);

            const req = { data: mockData } as any;
            const res = await router.validarToken(req);

            expect(res.status).toBe(401);
            expect(res.response.message).toEqual(mockResError);
        });
    });

    describe('eliminarRedis', () => {
        it('debería eliminar datos de Redis correctamente', async () => {
            const res = await router.eliminarRedis();
            expect(redis.flushAll).toHaveBeenCalled();
            expect(res.status).toBe(200);
            expect(res.response.message).toBe('Datos eliminados exitosamente');
        });
    });
});
