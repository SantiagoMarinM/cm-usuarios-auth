import { IModule } from '@common/modules/IModule';
import { HTTPMETODO } from '@common/modules/Ruta';
import HealtCheckModules from '@modules/HealthCheck/HealtCheckModules';
import { HealtCheckController } from '@modules/HealthCheck/controllers/HealthCheckRouter';

jest.mock('@modules/HealthCheck/controllers/HealthCheckRouter');
jest.mock('@modules/HealthCheck/dependencies/Dependencies');

describe('Tests del Archivo HealtCheckModules', () => {
    let exampleModules: IModule;

    beforeEach(() => {
        exampleModules = new HealtCheckModules();
    });

    it('debería estar definido', () => {
        expect(exampleModules).toBeDefined();
    });

    it('debería tener una ruta', () => {
        expect(exampleModules.ruta).toBe('');
    });

    it('debería tener una ruta', () => {
        const rutas = exampleModules.getRutas();
        expect(rutas).toEqual([
            {
                evento: HealtCheckController.prototype.healtCheck,
                metodo: 'get',
                url: '/healthcheckservice',
            },
            {
                evento: HealtCheckController.prototype.healtCheckDB,
                metodo: 'get',
                url: '/healthcheckdb',
            },
        ]);
        expect(rutas[0].metodo).toBe(HTTPMETODO.GET);
        expect(rutas[1].metodo).toBe(HTTPMETODO.GET);
    });
});
