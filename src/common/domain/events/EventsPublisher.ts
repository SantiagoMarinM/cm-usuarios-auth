import { Topic } from '@google-cloud/pubsub';

export interface EventsPublisher {
    publish(event: Topic, data: unknown): Promise<string>;
}
