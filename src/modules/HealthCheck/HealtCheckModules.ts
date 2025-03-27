import { IModule } from '@common/modules/IModule';
import { HTTPMETODO, Ruta } from '@common/modules/Ruta';
import createDependencies from './dependencies/Dependencies';
import { HealtCheckController } from './controllers/HealthCheckRouter';

export default class HealtCheckModules implements IModule {
    private moduloRuta = '';

    constructor() {
        createDependencies();
    }

    getRutas = (): Ruta[] => {
        return [
            { metodo: HTTPMETODO.GET, url: '/healthcheckservice', evento: HealtCheckController.prototype.healtCheck },
            { metodo: HTTPMETODO.GET, url: '/healthcheckdb', evento: HealtCheckController.prototype.healtCheckDB },
        ];
    };

    get ruta(): string {
        return this.moduloRuta;
    }
}
