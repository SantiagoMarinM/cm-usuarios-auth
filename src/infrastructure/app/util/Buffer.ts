export const decode = (buffer: string): string => {
    return Buffer.from(buffer, 'base64').toString();
};

export const encode = <T>(data?: T): Buffer => {
    const buffer = JSON.stringify(data);
    return Buffer.from(buffer);
};
