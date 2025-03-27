import { InternalError } from '@common/http/exceptions';
import jwt from 'jsonwebtoken';
import { GLOBAL_CONTAINER } from '@common/dependencies/DependencyContainer';
import ValidarIdClienteUseCase from '@modules/ClienteToken/useCase/ValidarIdClienteUseCase';
import TYPESDEPENDENCIES from '@modules/ClienteToken/dependencies/TypesDependencies';
import GenerarTokenUseCase from '@modules/ClienteToken/useCase/GenerarTokenUseCase';
import { IDataValidarIdClienteOut } from '@modules/ClienteToken/domain/interfaces';

jest.mock('jsonwebtoken');

describe('GenerarTokenUseCase', () => {
    const validarIdClienteUseCaseMock = {
        execute: jest.fn(),
    };

    const data = {
        'x-client-id': 'cliente123',
        'x-request-id': 'peticion456',
    };

    const tokenFake = 'token.jwt.fake';

    beforeAll(() => {
        if (GLOBAL_CONTAINER.isBound(TYPESDEPENDENCIES.ValidarIdClienteUseCase)) {
            GLOBAL_CONTAINER.rebind<ValidarIdClienteUseCase>(TYPESDEPENDENCIES.ValidarIdClienteUseCase).toConstantValue(
                validarIdClienteUseCaseMock as any,
            );
        } else {
            GLOBAL_CONTAINER.bind<ValidarIdClienteUseCase>(TYPESDEPENDENCIES.ValidarIdClienteUseCase).toConstantValue(
                validarIdClienteUseCaseMock as any,
            );
        }
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('debería generar un token si el cliente está activo', async () => {
        validarIdClienteUseCaseMock.execute.mockResolvedValue({ activo: true } as IDataValidarIdClienteOut);
        (jwt.sign as jest.Mock).mockReturnValue(tokenFake);

        const useCase = new GenerarTokenUseCase();
        const result = await useCase.execute(data);

        expect(result).toBe(tokenFake);
        expect(validarIdClienteUseCaseMock.execute).toHaveBeenCalledWith('cliente123');
        expect(jwt.sign).toHaveBeenCalledWith(
            {
                id_cliente: 'cliente123',
                id_peticion: 'peticion456',
                activo: true,
            },
            expect.any(String), // la llave secreta
            { expiresIn: '1h' },
        );
    });

    it('debería lanzar UNAUTHORIZED si el cliente no está activo', async () => {
        validarIdClienteUseCaseMock.execute.mockResolvedValue({ activo: false } as IDataValidarIdClienteOut);

        const useCase = new GenerarTokenUseCase();

        await expect(useCase.execute(data)).rejects.toMatchObject({
            isError: true,
            statusCode: 401,
            error: {
                code: '401',
                autorizado: false,
                message: 'Acceso no autorizado',
            },
        });
    });

    it('debería lanzar InternalError si jwt.sign lanza un error', async () => {
        validarIdClienteUseCaseMock.execute.mockResolvedValue({ activo: true } as IDataValidarIdClienteOut);
        (jwt.sign as jest.Mock).mockImplementation(() => {
            throw new Error('Fallo en JWT');
        });

        const useCase = new GenerarTokenUseCase();

        try {
            await useCase.execute(data);
            fail('No lanzó InternalError');
        } catch (err) {
            expect(err).toBeInstanceOf(InternalError);
            expect(err.statusCode).toBe(500);
            expect(err.error.message).toMatch('Fallo en JWT');
        }
    });
});
