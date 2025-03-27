import { Ruta } from './Ruta';

export interface IModule {
    ruta: string;
    getRutas(): Ruta[];
}
