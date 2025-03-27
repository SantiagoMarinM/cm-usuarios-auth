export const TYPES = {
    PostgresqlCM: Symbol.for('PostgresqlCM'), // Conexión CM
    PostgresqlUnidades: Symbol.for('PostgresqlUnidades'), // Conexión Unidades
    PostgresRepository: Symbol.for('PostgresRepository'),
    PubSub: Symbol.for('PubSub'),
    PubSubRepo: Symbol.for('PubSubRepo'),
    EventsPublisher: Symbol.for('PubSubEventsPublisher'),
    Publisher: Symbol.for('PubsubPublisher'),
};
