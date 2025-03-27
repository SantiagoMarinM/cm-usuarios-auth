import { PubSub } from '@google-cloud/pubsub';
import { ENV } from '@modules/shared/envs';

export const pubsubMio = new PubSub({ projectId: ENV.GCP_PROJECT });
