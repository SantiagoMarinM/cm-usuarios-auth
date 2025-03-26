import { ENV } from '@modules/shared';
import dotenv from 'dotenv';
import pgPromise, { IMain, IDatabase } from 'pg-promise';
import { IConnectionParameters } from 'pg-promise/typescript/pg-subset';

dotenv.config();

const pgp: IMain = pgPromise();
const PG_CONECTION: IConnectionParameters = {
    host: ENV.POSTGRES_HOST,
    port: +ENV.PG_PORT,
    user: ENV.POSTGRES_USER,
    password: ENV.POSTGRES_PASS,
    database: ENV.POSTGRES_DATABASE,
    statement_timeout: 4000,
    max: 100,
    idleTimeoutMillis: 120000,
    query_timeout: 6000,
    lock_timeout: 3000,
    idle_in_transaction_session_timeout: 4000,
};

const autorizacion = pgp(PG_CONECTION) as IDatabase<IMain>;

export { pgp, autorizacion };
