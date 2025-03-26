import TYPESDEPENDENCIES from '@modules/ClienteToken/dependencies/TypesDependencies';
import { GLOBAL_CONTAINER } from '@common/dependencies/DependencyContainer';
import { ErrorCode, InternalError, UNAUTHORIZED } from '@common/http/exceptions';
import * as service from '@modules/ClienteToken/domain/services';

import jwt from 'jsonwebtoken';
import { ENV } from '@modules/shared';
import GenerarTokenUseCase from '@modules/ClienteToken/useCase/GenerarTokenUseCase';
import ValidarIdClienteUseCase from '@modules/ClienteToken/useCase/ValidarIdClienteUseCase';

jest.mock('@common/dependencies/DependencyContainer');
jest.mock('jsonwebtoken');
jest.mock('@modules/ClienteToken/domain/services');

describe('GenerarTokenUseCase', () => {
    let generarTokenUseCase: GenerarTokenUseCase;
    let validarIdClienteUseCaseMock: jest.Mocked<ValidarIdClienteUseCase>;

    beforeEach(() => {
        validarIdClienteUseCaseMock = {
            execute: jest.fn(),
        } as unknown as jest.Mocked<ValidarIdClienteUseCase>;

        (GLOBAL_CONTAINER.get as jest.Mock).mockImplementation((type) => {
            if (type === TYPESDEPENDENCIES.ValidarIdClienteUseCase) {
                return validarIdClienteUseCaseMock;
            }
            return null;
        });

        generarTokenUseCase = new GenerarTokenUseCase();
    });

    it('debería generar un token correctamente', async () => {
        const mockData = { 'x-client-id': '123', 'x-request-id': 'abc' };
        const mockCliente = { apikey: 'test-key', activo: true, tiempo_expiracion: '1h' };
        validarIdClienteUseCaseMock.execute.mockResolvedValue(mockCliente);
        (service.validarIdPeticion as jest.Mock).mockImplementation();
        (jwt.sign as jest.Mock).mockReturnValue('mocked-token');

        const result = await generarTokenUseCase.execute(mockData);

        expect(validarIdClienteUseCaseMock.execute).toHaveBeenCalledWith('123');
        expect(service.validarIdPeticion).toHaveBeenCalledWith('abc', 'test-key');
        expect(jwt.sign).toHaveBeenCalledWith(
            {
                id_cliente: '123',
                id_peticion: 'abc',
                activo: true,
            },
            ENV.LLAVE_SECRETA,
            { expiresIn: ENV.EXPIRE_TOKEN },
        );
        expect(result).toBe('mocked-token');
    });

    it('debería lanzar un error si el cliente no está activo', async () => {
        const mockData = { 'x-client-id': '123', 'x-request-id': 'abc' };
        const mockCliente = { apikey: 'test-key', activo: false, tiempo_expiracion: '1h' };
        validarIdClienteUseCaseMock.execute.mockResolvedValue(mockCliente);
        (service.validarIdPeticion as jest.Mock).mockImplementation();

        await expect(generarTokenUseCase.execute(mockData)).rejects.toBeInstanceOf(UNAUTHORIZED);
    });

    it('debería lanzar un error si la validación del cliente falla', async () => {
        const mockData = { 'x-client-id': '123', 'x-request-id': 'abc' };
        validarIdClienteUseCaseMock.execute.mockRejectedValue(new Error('Error de validación'));

        await expect(generarTokenUseCase.execute(mockData)).rejects.toBeInstanceOf(Error);
    });

    it('debería lanzar un InternalError si jwt.sign falla', async () => {
        const mockData = { 'x-client-id': '123', 'x-request-id': 'abc' };
        const mockCliente = { apikey: 'test-key', activo: true, tiempo_expiracion: '1h' };

        validarIdClienteUseCaseMock.execute.mockResolvedValue(mockCliente);
        (service.validarIdPeticion as jest.Mock).mockImplementation();

        (jwt.sign as jest.Mock).mockImplementation(() => {
            throw new InternalError('Fallo en la firma del token', ErrorCode.INTERNAL_ERROR);
        });

        await expect(generarTokenUseCase.execute(mockData)).rejects.toBeInstanceOf(InternalError);
    });
});
