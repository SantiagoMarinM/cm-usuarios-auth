import { pubsubMio } from './config/PubSubConfig';

const EVENTO_CHECKPOINT_12_RECIBIDO = pubsubMio.topic('evento-checkpoint-asignacion-recibido');
export default EVENTO_CHECKPOINT_12_RECIBIDO;
