import { GLOBAL_CONTAINER } from '@common/dependencies/DependencyContainer';
import { IDatabase, IMain } from 'pg-promise';
import TYPESDEPENDENCIES from './TypesDependencies';
import { autorizacion } from '@infrastructure/bd';
import { ClienteTokenDAO } from '@infrastructure/bd/postgresql/dao/ClienteTokenDAO';
import { IClienteTokenRepository } from '../domain/repositories/ClienteTokenRepository';
import { RedisClient } from 'redis';
import { RedisClientesConnection } from '@infrastructure/redis/adapter/redis';
import IClienteRedis from '@infrastructure/redis/interfaces/IClienteRedis';
import { ClientesTokenRedis } from '@infrastructure/redis/ClientesTokenRedis';
import ValidarIdClienteUseCase from '../useCase/ValidarIdClienteUseCase';
import GenerarTokenUseCase from '../useCase/GenerarTokenUseCase';
import ValidarTokenUseCase from '../useCase/ValidarTokenUseCase';

export const createDependencies = (): void => {
    GLOBAL_CONTAINER.bind<IDatabase<IMain>>(TYPESDEPENDENCIES.Postgresql).toConstantValue(autorizacion);
    GLOBAL_CONTAINER.bind<IClienteTokenRepository>(TYPESDEPENDENCIES.IClienteTokenRepository)
        .to(ClienteTokenDAO)
        .inSingletonScope();
    GLOBAL_CONTAINER.bind<ValidarIdClienteUseCase>(TYPESDEPENDENCIES.ValidarIdClienteUseCase)
        .to(ValidarIdClienteUseCase)
        .inSingletonScope();
    GLOBAL_CONTAINER.bind<GenerarTokenUseCase>(TYPESDEPENDENCIES.GenerarTokenUseCase)
        .to(GenerarTokenUseCase)
        .inSingletonScope();
    GLOBAL_CONTAINER.bind<ValidarTokenUseCase>(TYPESDEPENDENCIES.ValidarTokenUseCase)
        .to(ValidarTokenUseCase)
        .inSingletonScope();
    GLOBAL_CONTAINER.bind<RedisClient>(TYPESDEPENDENCIES.RedisAdapter).toConstantValue(RedisClientesConnection);
    GLOBAL_CONTAINER.bind<IClienteRedis>(TYPESDEPENDENCIES.RedisRepoCache).to(ClientesTokenRedis).inSingletonScope();
};
