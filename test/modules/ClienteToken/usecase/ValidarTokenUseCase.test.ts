import ValidarTokenUseCase from '@modules/ClienteToken/useCase/ValidarTokenUseCase';
import ValidarIdClienteUseCase from '@modules/ClienteToken/useCase/ValidarIdClienteUseCase';
import { GLOBAL_CONTAINER } from '@common/dependencies/DependencyContainer';
import TYPESDEPENDENCIES from '@modules/ClienteToken/dependencies/TypesDependencies';
import { UNAUTHORIZED } from '@common/http/exceptions';
import jwt from 'jsonwebtoken';
import { CLIENTE_INACTIVO, CLIENTE_INVALIDO, TOKEN_EXPIRADO } from '@modules/ClienteToken/constants/errorMessages';

jest.mock('jsonwebtoken');

describe('ValidarTokenUseCase', () => {
    const validarIdClienteUseCaseMock = {
        execute: jest.fn(),
    };

    const idCliente = 'cliente123';
    const token = 'jwt.token.prueba';

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

    it('debería validar correctamente si el cliente es válido y el token es correcto', async () => {
        validarIdClienteUseCaseMock.execute.mockResolvedValue({ activo: true });
        (jwt.verify as jest.Mock).mockReturnValue({});

        const useCase = new ValidarTokenUseCase();
        await expect(useCase.execute(idCliente, token)).resolves.toBeUndefined();
    });

    it('debería lanzar UNAUTHORIZED si el cliente es null', async () => {
        validarIdClienteUseCaseMock.execute.mockResolvedValue(null);
        const useCase = new ValidarTokenUseCase();

        try {
            await useCase.execute(idCliente, token);
            fail('No lanzó excepción');
        } catch (error) {
            expect(error).toBeInstanceOf(UNAUTHORIZED);
            expect(error.statusCode).toBe(401);
            expect(error.error.stack).toBe(CLIENTE_INVALIDO);
        }
    });

    it('debería lanzar UNAUTHORIZED si el cliente está inactivo', async () => {
        validarIdClienteUseCaseMock.execute.mockResolvedValue({ activo: false });
        const useCase = new ValidarTokenUseCase();

        try {
            await useCase.execute(idCliente, token);
            fail('No lanzó excepción');
        } catch (error) {
            expect(error).toBeInstanceOf(UNAUTHORIZED);
            expect(error.statusCode).toBe(401);
            expect(error.error.stack).toBe(CLIENTE_INACTIVO);
        }
    });

    it('debería lanzar UNAUTHORIZED si jwt.verify lanza error', async () => {
        validarIdClienteUseCaseMock.execute.mockResolvedValue({ activo: true });
        (jwt.verify as jest.Mock).mockImplementation(() => {
            throw new Error('token inválido');
        });

        const useCase = new ValidarTokenUseCase();

        try {
            await useCase.execute(idCliente, token);
            fail('No lanzó excepción');
        } catch (error) {
            expect(error).toBeInstanceOf(UNAUTHORIZED);
            expect(error.statusCode).toBe(401);
            expect(error.error.stack).toBe(TOKEN_EXPIRADO);
        }
    });
});
