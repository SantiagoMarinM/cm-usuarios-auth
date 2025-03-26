import { IModule } from '@common/modules/IModule';
import { HTTPMETODO, Ruta } from '@common/modules/Ruta';
import ClienteTokenRouter from './controllers/ClienteTokenRouter';
import createDependencyContainer from '@common/dependencies/DependencyContainer';
import { createDependencies } from './dependencies/Dependencies';

export default class ClientesModules implements IModule {
    private readonly moduloRuta = '/';
    constructor() {
        createDependencies();
        createDependencyContainer();
    }

    getRutas = (): Ruta[] => {
        return [
            {
                metodo: HTTPMETODO.GET,
                url: '/',
                evento: ClienteTokenRouter.prototype.generarToken,
            },
            {
                metodo: HTTPMETODO.GET,
                url: '/validar-token',
                evento: ClienteTokenRouter.prototype.validarToken,
            },
            {
                metodo: HTTPMETODO.DELETE,
                url: '/redis',
                evento: ClienteTokenRouter.prototype.eliminarRedis,
            },
        ];
    };

    get ruta(): string {
        return this.moduloRuta;
    }
}
