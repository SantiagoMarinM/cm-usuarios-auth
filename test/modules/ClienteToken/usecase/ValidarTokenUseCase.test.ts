import ValidarTokenUseCase from '@modules/ClienteToken/useCase/ValidarTokenUseCase';
import ValidarIdClienteUseCase from '@modules/ClienteToken/useCase/ValidarIdClienteUseCase';
import { GLOBAL_CONTAINER } from '@common/dependencies/DependencyContainer';
import TYPESDEPENDENCIES from '@modules/ClienteToken/dependencies/TypesDependencies';
import { UNAUTHORIZED } from '@common/http/exceptions';
import * as service from '@modules/ClienteToken/domain/services';
import { ENV } from '@modules/shared';
import jwt from 'jsonwebtoken';

jest.mock('@modules/ClienteToken/domain/services');
jest.mock('jsonwebtoken');
jest.mock('@common/dependencies/DependencyContainer');

describe('ValidarTokenUseCase', () => {
    let validarTokenUseCase: ValidarTokenUseCase;
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

        validarTokenUseCase = new ValidarTokenUseCase();
    });

    it('debería validar el token correctamente cuando el cliente es válido y activo', async () => {
        const mockData = { 'x-client-id': 'client123', 'x-request-id': 'req123', token: 'valid-token' };
        const mockCliente = { apikey: 'apikey123', activo: true, tiempo_expiracion: '1h' };

        validarIdClienteUseCaseMock.execute.mockResolvedValue(mockCliente);
        (jwt.verify as jest.Mock).mockReturnValue(true);

        await validarTokenUseCase.execute(mockData);
        expect(service.validarIdPeticion).toHaveBeenCalledWith(mockData['x-request-id'], mockCliente.apikey);
        expect(jwt.verify).toHaveBeenCalledWith(mockData.token, ENV.LLAVE_SECRETA);
    });

    it('debería lanzar error si el cliente no existe', async () => {
        const mockData = { 'x-client-id': 'client123', 'x-request-id': 'req123', token: 'valid-token' };
        (validarIdClienteUseCaseMock.execute as jest.Mock).mockResolvedValue(null);

        await expect(validarTokenUseCase.execute(mockData)).rejects.toBeInstanceOf(UNAUTHORIZED);
    });

    it('debería lanzar error si el cliente está inactivo', async () => {
        const mockData = { 'x-client-id': 'client123', 'x-request-id': 'req123', token: 'valid-token' };
        const mockCliente = { apikey: 'apikey123', activo: false, tiempo_expiracion: '1h' };

        validarIdClienteUseCaseMock.execute.mockResolvedValue(mockCliente);

        await expect(validarTokenUseCase.execute(mockData)).rejects.toBeInstanceOf(UNAUTHORIZED);
    });

    it('debería lanzar error si el token es inválido o ha expirado', async () => {
        const mockData = { 'x-client-id': 'client123', 'x-request-id': 'req123', token: 'invalid-token' };
        const mockCliente = { apikey: 'apikey123', activo: true, tiempo_expiracion: '1h' };

        validarIdClienteUseCaseMock.execute.mockResolvedValue(mockCliente);
        (jwt.verify as jest.Mock).mockImplementation(() => {
            throw new Error('Token inválido');
        });

        await expect(validarTokenUseCase.execute(mockData)).rejects.toBeInstanceOf(UNAUTHORIZED);
    });
});
