import { ICrearCliente, IGenerarToken } from '@common/domain/entities/interfaces';
import Joi from 'joi';

export const CrearClienteTokenSchema = Joi.object<ICrearCliente>({
    nombre_cliente: Joi.string().required(),
    activo: Joi.boolean().default(true),
}).unknown(false);

export const GenerarTokenSchema = Joi.object<IGenerarToken>({
    'x-client-id': Joi.string().required(),
    'x-request-id': Joi.string().required(),
}).unknown(true);

export const ValidarTokenSchema = Joi.object({
    'x-client-id': Joi.string().required(),
    'x-request-id': Joi.string().required(),
    authorization: Joi.string().required(),
}).unknown(true);
