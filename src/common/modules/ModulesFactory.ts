import { IServer, FastifyServer } from '@infrastructure/app/server';
import { TYPESSERVER } from '@infrastructure/app/server/TypeServer';
import { IModule } from './IModule';

export default class ModulesFactory {
    private server!: IServer;

    public initModules(modules: (new () => IModule)[]): void {
        modules.forEach((ModuleType) => {
            const module = new ModuleType();
            this.server.addModule(module);
        });
    }

    public createServer(serverType: symbol): IServer | null {
        if (serverType === TYPESSERVER.Fastify) {
            this.server = new FastifyServer();
        }
        return this.server;
    }
}
