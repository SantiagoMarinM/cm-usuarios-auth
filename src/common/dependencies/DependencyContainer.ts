import { Container } from 'inversify';
import { TYPES } from './Types';
import { Publisher } from '@modules/shared/domain/events';
import { PubsubPublisher } from '@modules/shared/Infrastructure/pubsub/Publisher';

export const GLOBAL_CONTAINER = new Container();

const createDependencyContainer = () => {
    GLOBAL_CONTAINER.bind<Publisher>(TYPES.Publisher).to(PubsubPublisher).inSingletonScope();
};

export default createDependencyContainer;
