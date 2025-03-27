import { Publisher } from '@modules/shared/domain/events';
import { injectable } from 'inversify';
import { EventException } from '../errors';
import { Topic } from '@google-cloud/pubsub';
import 'reflect-metadata';

@injectable()
export class PubsubPublisher implements Publisher {
    async publish(topic: Topic, data: Record<string, unknown>): Promise<void> {
        try {
            await topic.publishMessage({ json: data });
        } catch (error) {
            throw new EventException(error.message, topic.name);
        }
    }
}
