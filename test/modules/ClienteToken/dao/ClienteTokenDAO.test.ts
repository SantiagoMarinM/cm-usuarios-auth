import { UNAUTHORIZED } from '@common/http/exceptions';
import TYPESDEPENDENCIES from '@modules/ClienteToken/dependencies/TypesDependencies';
import { GLOBAL_CONTAINER } from '@common/dependencies/DependencyContainer';
import { IDatabase, IMain, as } from 'pg-promise';
import { ClienteTokenDAO } from '@infrastructure/bd/postgresql/dao/ClienteTokenDAO';
import { insertCliente, selectValidarCliente } from '@infrastructure/bd/postgresql/dao/querys/ClienteTokenQuery';

jest.mock('@common/dependencies/DependencyContainer');

describe('Tests de ClienteTokenDAO', () => {
    let clienteTokenDAO: ClienteTokenDAO;
    let dbMock: jest.Mocked<IDatabase<IMain>>;

    beforeEach(() => {
        dbMock = {
            query: jest.fn(),
            oneOrNone: jest.fn(),
        } as unknown as jest.Mocked<IDatabase<IMain>>;

        (GLOBAL_CONTAINER.get as jest.Mock).mockImplementation((type: symbol) => {
            if (type === TYPESDEPENDENCIES.Postgresql) {
                return dbMock;
            }
            return null;
        });

        clienteTokenDAO = new ClienteTokenDAO();
    });

    describe('crearCliente', () => {
        it('debería crear un cliente correctamente', async () => {
            const data = {
                nombre_cliente: 'Test Cliente',
                activo: true,
                apikey_hash: 'apikey123hash',
                clave: 'clave123',
                apikey: 'apikey123',
            };
            const queryFormatted = as.format(insertCliente, [
                data.nombre_cliente,
                data.activo,
                data.apikey_hash,
                data.clave,
            ]);
            dbMock.query.mockResolvedValue([1]);

            const result = await clienteTokenDAO.crearCliente(data);

            expect(result).toEqual([1]);
            expect(dbMock.query).toHaveBeenCalledWith(queryFormatted);
        });

        it('debería manejar errores al crear un cliente', async () => {
            const data = {
                nombre_cliente: 'Test Cliente',
                activo: true,
                apikey_hash: 'apikey123hash',
                clave: 'clave123',
                apikey: 'apikey123',
            };
            dbMock.query.mockRejectedValue(new Error('Database error'));

            await expect(clienteTokenDAO.crearCliente(data)).rejects.toBeInstanceOf(UNAUTHORIZED);
        });
    });

    describe('validarIdCliente', () => {
        it('debería validar un cliente correctamente', async () => {
            const clave = 'clave123';
            const queryFormatted = as.format(selectValidarCliente, [clave]);
            const mockResponse = { id: 1, nombre_cliente: 'Test Cliente', activo: true };
            dbMock.oneOrNone.mockResolvedValue(mockResponse);

            const result = await clienteTokenDAO.validarIdCliente(clave);

            expect(result).toEqual(mockResponse);
            expect(dbMock.oneOrNone).toHaveBeenCalledWith(queryFormatted);
        });

        it('debería retornar null si el cliente no existe', async () => {
            const clave = 'clave-inexistente';
            dbMock.oneOrNone.mockResolvedValue(null);

            const result = await clienteTokenDAO.validarIdCliente(clave);

            expect(result).toBeNull();
        });

        it('debería manejar errores al validar un cliente', async () => {
            const clave = 'clave-error';
            dbMock.oneOrNone.mockRejectedValue(new Error('Database error'));

            await expect(clienteTokenDAO.validarIdCliente(clave)).rejects.toBeInstanceOf(UNAUTHORIZED);
        });
    });
});
