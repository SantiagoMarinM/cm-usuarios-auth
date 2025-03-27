import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { validateEnvs } from '@modules/shared/envs/Validate';
const envFile = existsSync('.env.local');
if (envFile) {
    dotenv.config({
        path: '.env.local',
    });
} else {
    dotenv.config();
}

export const MANTIENE_ESTADO_ANTERIOR = 2;

export const ENV = {
    POSTGRES_HOST: process.env.POSTGRES_HOST ?? 'dbcmtest.loc',
    DOMAIN: process.env.DOMAIN ?? 'mio',
    SERVICE_NAME: process.env.SERVICE_NAME ?? 'cm-usuarios-auth',
    GCP_PROJECT: process.env.GCP_PROJECT ?? 'cm-mio-dev',
    ENV: process.env.ENV ?? 'local',
    PG_PORT: process.env.PG_PORT ?? '5434',
    POSTGRES_USER: process.env.POSTGRES_USER ?? 'mio_user_default',
    POSTGRES_PASS: process.env.POSTGRES_PASS ?? 'cualquier_cosa',
    POSTGRES_DATABASE: process.env.POSTGRES_DATABASE ?? 'mio',
    PORT: process.env.PORT ?? '8080',
    ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN ?? 'localhost',
    HOST: process.env.HOST ?? '0.0.0.0',
    REDIS_HOST: process.env.REDIS_HOST ?? 'localhost',
    REDIS_PORT: process.env.REDIS_PORT ?? '6379',
    DIAS_REDIS: process.env.DIAS_REDIS ?? '1',
    LLAVE_SECRETA: process.env.LLAVE_SECRETA ?? 'HolaEstaEsLaSecretKeyParaGenerarElTokenEnAmbienteDeTest',
    EXPIRE_TOKEN: process.env.EXPIRE_TOKEN ?? '1h',
};

if (!envFile) validateEnvs(ENV);
