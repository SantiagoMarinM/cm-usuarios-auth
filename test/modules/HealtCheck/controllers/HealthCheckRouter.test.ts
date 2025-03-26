import { HealtCheckController } from '@modules/HealthCheck/controllers/HealthCheckRouter';
import { Request } from '@common/http/Request';
import { Response } from '@common/http/Response';
import Result from '@common/http/Result';
import { HealtCheckUseCase } from '@modules/HealthCheck/usecase/HealtCheckUseCase';
import { GLOBAL_CONTAINER } from '@common/dependencies/DependencyContainer';

jest.mock('@common/dependencies/DependencyContainer');

describe('Test del Archivo HealtCheckController', () => {
    let healtCheckController: HealtCheckController;
    let mockHealtCheckUseCase: HealtCheckUseCase;

    beforeEach(() => {
        mockHealtCheckUseCase = {
            healtCheckDB: jest.fn(),
        } as unknown as HealtCheckUseCase;

        (GLOBAL_CONTAINER.get as jest.Mock).mockImplementation((type: symbol) => {
            if (type) {
                return mockHealtCheckUseCase;
            }
            return null;
        });

        healtCheckController = new HealtCheckController();
    });

    describe('healtCheck', () => {
        it('debería retornar una respuesta 200 OK con el mensaje "ok"', async () => {
            const req = {} as Request<string>;
            const expectedResponse: Response<string> = Result.ok<string>('ok');

            const response = await healtCheckController.healtCheck(req);

            expect(response).toEqual(expectedResponse);
        });
    });

    describe('healtCheckDB', () => {
        it('debería retornar una respuesta 200 OK con el mensaje "ok" después de una verificación exitosa de la base de datos', async () => {
            const req = {} as Request<string>;
            (mockHealtCheckUseCase.healtCheckDB as jest.Mock).mockResolvedValueOnce('Ok');
            const expectedResponse: Response<string> = Result.ok<string>('ok');

            const response = await healtCheckController.healtCheckDB(req);

            expect(response).toEqual(expectedResponse);
            expect(mockHealtCheckUseCase.healtCheckDB).toHaveBeenCalledTimes(1);
        });
    });
});
