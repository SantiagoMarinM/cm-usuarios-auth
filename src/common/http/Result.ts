import { HTTPSTATUSCODE } from '@common/modules/Ruta';
import { Response } from './Response';

export default class Result {
    static ok<T>(data: T): Response<T> {
        return {
            response: data,
            status: HTTPSTATUSCODE.OK,
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    static failure<T>(exception: any): Response<T> {
        const response = {
            isError: true,
            message: exception?.message || 'unknown',
            statusCode: exception?.status || HTTPSTATUSCODE.INTERNAL,
        };
        return {
            response,
            status: exception.status || HTTPSTATUSCODE.INTERNAL,
        };
    }
}
