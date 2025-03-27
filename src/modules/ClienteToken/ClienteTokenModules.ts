import { IModule } from '@common/modules/IModule';
import { HTTPMETODO, Ruta } from '@common/modules/Ruta';
import ClienteTokenRouter from './controllers/ClienteTokenRouter';
import createDependencyContainer from '@common/dependencies/DependencyContainer';
import { createDependencies } from './dependencies/Dependencies';

export default class ClientesModules implements IModule {
    private readonly moduloRuta = '/';
    private readonly controller = new ClienteTokenRouter();

    constructor() {
        createDependencies();
        createDependencyContainer();
    }

    getRutas = (): Ruta[] => {
        return [
            {
                metodo: HTTPMETODO.GET,
                url: '/',
                evento: this.controller.generarToken.bind(this.controller),
            },
            {
                metodo: HTTPMETODO.GET,
                url: '/validar-token',
                evento: this.controller.validarToken.bind(this.controller),
            },
            {
                metodo: HTTPMETODO.DELETE,
                url: '/redis',
                evento: this.controller.eliminarRedis.bind(this.controller),
            },
        ];
    };

    get ruta(): string {
        return this.moduloRuta;
    }
}
