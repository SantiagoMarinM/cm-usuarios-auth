import { Log } from '@modules/shared';

export default interface Publicador<T> {
    publicarEventoTrackingGenerado(mensaje: T, topico: string, log: Log): Promise<void>;
}
