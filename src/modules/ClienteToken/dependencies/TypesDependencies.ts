const TYPESDEPENDENCIES = {
    Postgresql: Symbol.for('Postgresql'),
    IClienteTokenRepository: Symbol.for('IClienteTokenRepository'),
    ValidarIdClienteUseCase: Symbol.for('ValidarIdClienteUseCase'),
    RedisAdapter: Symbol.for('RedisAdapter'),
    RedisRepoCache: Symbol.for('RedisRepoCache'),
    GenerarTokenUseCase: Symbol.for('GenerarTokenUseCase'),
    ValidarTokenUseCase: Symbol.for('ValidarTokenUseCase'),
};

export default TYPESDEPENDENCIES;
