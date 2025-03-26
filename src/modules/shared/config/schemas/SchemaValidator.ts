import Joi from 'joi';
import { decode } from '@common/utils/base64';
import { BadMessageException } from '@modules/shared';
import { PubSubPayload, pubSubSchema } from './PubSubSchema';
import { parse } from '@common/utils';
import { MENSAJE_INDEFINIDO, VAL_SIN_DATA } from './constants';

type Schema<T> = Joi.ObjectSchema<T> | Joi.ArraySchema;
type Body = Record<string, unknown> | undefined;

interface Validator {
    validate<T>(schema: Schema<T>, data: Body): T;
}

export default class PubsubValidator implements Validator {
    // eslint-disable-next-line prettier/prettier

    validate<T>(schema: Schema<T>, data: Body): T {
        if (data) {
            const pubSubPayload = this.validatePubsub(data);
            if (pubSubPayload) {
                const decodeMessage = parse(decode(pubSubPayload.message.data));
                const { error, value } = schema.validate(decodeMessage, { convert: true });
                if (error) {
                    throw new BadMessageException(error.message);
                }
                return value as T;
            }
        }
        throw new BadMessageException(MENSAJE_INDEFINIDO, [VAL_SIN_DATA]);
    }

    private validatePubsub(dataToValidate: Body, isPubSub?: string | null): PubSubPayload | null {
        if (dataToValidate && isPubSub !== null) {
            const { error, value } = pubSubSchema.validate(dataToValidate, { convert: true });
            if (!error) return value;
        }
        return null;
    }
}
