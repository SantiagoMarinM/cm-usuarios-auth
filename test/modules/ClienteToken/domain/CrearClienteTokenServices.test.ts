import { UNAUTHORIZED } from '@common/http/exceptions';
import { validarIdPeticion } from '@modules/ClienteToken/domain/services';
import bcrypt from 'bcrypt';

describe('CrearClienteTokenServices', () => {
    describe('validarIdPeticion', () => {
        it('should not throw error if request_id matches id_peticion_db', () => {
            const request_id = 'test_request_id';
            const hash = bcrypt.hashSync(request_id, 10);

            expect(() => validarIdPeticion(request_id, hash)).not.toThrow();
        });

        it('should throw error if request_id does not match id_peticion_db', () => {
            const request_id = 'test_request_id';
            const hash = bcrypt.hashSync('different_request_id', 10);
            expect(() => validarIdPeticion(request_id, hash)).toThrow(UNAUTHORIZED);
        });
    });
});
