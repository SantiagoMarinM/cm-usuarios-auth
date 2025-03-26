import Joi, { ValidationResult } from 'joi';
import { BadMessageException } from '@modules/shared';
import { VALIDATION_MESSAGE } from './constants';

type Schema = Joi.ObjectSchema | Joi.ArraySchema;
type Body = Record<string, unknown> | undefined;

interface Validator {
    validate<T>(schema: Schema, data: Body): ValidationResult<T>;
}

export class JsonValidator implements Validator {
    validate<T>(schema: Schema, data: Body): T {
        if (data) {
            const { error, value } = schema.validate(data, { convert: true, abortEarly: false });
            if (error) {
                throw new BadMessageException(error.message, error.details);
            }
            return value;
        }
        throw new BadMessageException(VALIDATION_MESSAGE);
    }
}
