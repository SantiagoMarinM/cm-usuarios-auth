import 'reflect-metadata';
import { PubSub, v1 } from '@google-cloud/pubsub';
import { ENV } from '@modules/shared';

export const pubsub = new v1.PublisherClient();
export const pubsubMio = new PubSub({ projectId: ENV.GCP_PROJECT });
