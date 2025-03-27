import { HealtCheckDao } from '@infrastructure/bd/postgresql/dao/HealtCheckDao';
import { IDatabase, IMain } from 'pg-promise';
import { PostgresError } from '@common/http/exceptions';
import { GLOBAL_CONTAINER } from '@common/dependencies/DependencyContainer';
import TYPESDEPENDENCIES from '@modules/HealthCheck/dependencies/TypesDependencies';

jest.mock('@common/dependencies/DependencyContainer');

describe('Test del Archivo HealtCheckDao', () => {
    let healtCheckDao: HealtCheckDao;
    let mockDb: jest.Mocked<IDatabase<IMain>>;

    beforeEach(() => {
        mockDb = {
            query: jest.fn(),
        } as unknown as jest.Mocked<IDatabase<IMain>>;

        (GLOBAL_CONTAINER.get as jest.Mock).mockImplementation((type: symbol) => {
            if (type === TYPESDEPENDENCIES.Postgresql) {
                return mockDb;
            }
            return null;
        });

        healtCheckDao = new HealtCheckDao();
    });

    describe('healtCheckDB', () => {
        it('debería llamar a healtCheckDB correctamente', async () => {
            mockDb.query.mockResolvedValueOnce({});
            await expect(healtCheckDao.healtCheckDB()).resolves.not.toThrow();
            expect(mockDb.query).toHaveBeenCalledWith('SELECT 1 FROM public.stage_solicitud LIMIT 1');
        });

        it('debería arrojar un error si la base de datos falla', async () => {
            const errorMessage = 'Database connection error';
            mockDb.query.mockRejectedValueOnce(new Error(errorMessage));

            await expect(healtCheckDao.healtCheckDB()).rejects.toBeInstanceOf(PostgresError);
        });
    });

    describe('healtCheckTabla', () => {
        it('debería verificar la disponibilidad de una tabla correctamente', async () => {
            const tableName = 'test_table';
            mockDb.query.mockResolvedValueOnce({});
            await expect(healtCheckDao.healtCheckTabla(tableName)).resolves.not.toThrow();
            expect(mockDb.query).toHaveBeenCalledWith(`SELECT 1 FROM ${tableName} LIMIT 1`);
        });

        it('debería arrojar un error si la tabla falla', async () => {
            const tableName = 'test_table';
            const errorMessage = 'Table not found';
            mockDb.query.mockRejectedValueOnce(new Error(errorMessage));

            await expect(healtCheckDao.healtCheckTabla(tableName)).rejects.toBeInstanceOf(PostgresError);
        });
    });
});
