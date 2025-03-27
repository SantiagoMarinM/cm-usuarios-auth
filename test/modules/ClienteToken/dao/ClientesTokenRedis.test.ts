import { ClientesTokenRedis } from '@infrastructure/redis/ClientesTokenRedis';
import { RedisClient } from 'redis';
import TYPESDEPENDENCIES from '@modules/ClienteToken/dependencies/TypesDependencies';
import { GLOBAL_CONTAINER } from '@common/dependencies/DependencyContainer';

jest.mock('@common/dependencies/DependencyContainer');

describe('Tests de ClientesTokenRedis', () => {
    let clientesTokenRedis: ClientesTokenRedis;
    let redisClientMock: jest.Mocked<RedisClient>;

    beforeEach(() => {
        redisClientMock = {
            set: jest.fn(),
            expire: jest.fn(),
            get: jest.fn(),
            flushall: jest.fn(),
        } as unknown as jest.Mocked<RedisClient>;

        (GLOBAL_CONTAINER.get as jest.Mock).mockImplementation((type: symbol) => {
            if (type === TYPESDEPENDENCIES.RedisAdapter) {
                return redisClientMock;
            }
            return null;
        });

        clientesTokenRedis = new ClientesTokenRedis();
    });

    describe('setClienteToken', () => {
        it('debería guardar un cliente en Redis', async () => {
            const key = 'test-key';
            const value = { id: 1, nombre: 'Cliente Test' };

            await clientesTokenRedis.setClienteToken(key, value);

            expect(redisClientMock.set).toHaveBeenCalledWith(key, JSON.stringify(value));
            expect(redisClientMock.expire).toHaveBeenCalled();
        });
    });

    describe('getIdCliente', () => {
        it('debería obtener el valor correctamente desde Redis', async () => {
            const key = 'test-key';
            const mockValue = JSON.stringify({ id: 123 });

            (redisClientMock.get as jest.Mock).mockImplementation(
                (_key: string, callback: (err: Error | null, result: string | null) => void) => {
                    callback(null, mockValue);
                },
            );

            const result = await clientesTokenRedis.getIdCliente(key);

            expect(result).toEqual({ id: 123 });
            expect(redisClientMock.get).toHaveBeenCalledWith(key, expect.any(Function));
        });

        it('debería retornar null si la clave no existe en Redis', async () => {
            const key = 'non-existent-key';

            (redisClientMock.get as jest.Mock).mockImplementation(
                (_key: string, callback: (err: Error | null, result: string | null) => void) => {
                    callback(null, null);
                },
            );

            const result = await clientesTokenRedis.getIdCliente(key);

            expect(result).toBeNull();
            expect(redisClientMock.get).toHaveBeenCalledWith(key, expect.any(Function));
        });

        it('debería manejar errores y retornar null', async () => {
            const key = 'error-key';

            (redisClientMock.get as jest.Mock).mockImplementation(
                (_key: string, callback: (err: Error | null, result: string | null) => void) => {
                    callback(new Error('Redis error'), null);
                },
            );

            const result = await clientesTokenRedis.getIdCliente(key);

            expect(result).toBeNull();
            expect(redisClientMock.get).toHaveBeenCalledWith(key, expect.any(Function));
        });
    });

    describe('flushAll', () => {
        it('debería limpiar toda la data de Redis', async () => {
            await clientesTokenRedis.flushAll();
            expect(redisClientMock.flushall).toHaveBeenCalled();
        });
    });
});
