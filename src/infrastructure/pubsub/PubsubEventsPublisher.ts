import { EventsPublisher } from '@common/domain/events';
import { toBuffer } from '@common/utils/base64';
import { Topic } from '@google-cloud/pubsub';

export default class PubSubEventsPublisher implements EventsPublisher {
    async publish(event: Topic, dataToPublish: unknown): Promise<string> {
        const data = toBuffer(dataToPublish);
        return event.publishMessage({ data });
    }
}
