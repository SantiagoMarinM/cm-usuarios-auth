import { HealtCheckUseCase } from '@modules/HealthCheck/usecase/HealtCheckUseCase';
import { HealtCheckDao } from '@infrastructure/bd/postgresql/dao/HealtCheckDao';
import { GLOBAL_CONTAINER } from '@common/dependencies/DependencyContainer';

jest.mock('@common/dependencies/DependencyContainer');

describe('Test del Archivo HealtCheckUseCase', () => {
    let healtCheckUseCase: HealtCheckUseCase;
    let mockHealtCheckDao: HealtCheckDao;

    beforeEach(() => {
        mockHealtCheckDao = {
            healtCheckDB: jest.fn(),
        } as unknown as HealtCheckDao;

        (GLOBAL_CONTAINER.get as jest.Mock).mockImplementation((type: symbol) => {
            if (type) {
                return mockHealtCheckDao;
            }
            return null;
        });

        healtCheckUseCase = new HealtCheckUseCase();
    });

    describe('healtCheckDB', () => {
        it('debería llamar a healtCheckDB correctamente', async () => {
            await healtCheckUseCase.healtCheckDB();
            expect(mockHealtCheckDao.healtCheckDB).toHaveBeenCalledTimes(1);
        });
    });
});
