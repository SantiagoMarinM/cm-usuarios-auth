import { GLOBAL_CONTAINER } from '@common/dependencies/DependencyContainer';
import { PostgresError } from '@common/http/exceptions';
import TYPESDEPENDENCIES from '@modules/HealthCheck/dependencies/TypesDependencies';
import { injectable } from 'inversify';
import { IDatabase, IMain } from 'pg-promise';

@injectable()
export class HealtCheckDao {
    dbCm = GLOBAL_CONTAINER.get<IDatabase<IMain>>(TYPESDEPENDENCIES.Postgresql);

    async healtCheckDB(): Promise<void> {
        await this.healtCheckTabla('public.stage_solicitud');
    }

    async healtCheckTabla(tabla: string): Promise<void> {
        try {
            const query = `SELECT 1 FROM ${tabla} LIMIT 1`;
            await this.dbCm.query(query);
        } catch (error) {
            throw new PostgresError(`Error tabla ${tabla} : ` + error.message);
        }
    }
}
