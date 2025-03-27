/* eslint-disable @typescript-eslint/no-explicit-any */
import { IModule } from '@common/modules/IModule';

export interface IServer {
    port: number | string;
    app: any;
    start(): void;
    addModule(module: IModule): Promise<void>;
}
