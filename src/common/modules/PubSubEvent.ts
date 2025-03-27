interface MessageInterface {
    data: string;
    publishTime: string;
    messageId: string;
}

export interface PubSubEventInterface {
    subscription: string;
    message: MessageInterface;
}
