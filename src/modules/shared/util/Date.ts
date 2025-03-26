import moment from 'moment-timezone';

export const date24h = (date: string): Date => {
    const datetime = moment(new Date(date)).isValid() ? new Date(date) : new Date();
    const res = moment(datetime).add(-5, 'hours').format('YYYY-MM-DD HH:mm:ss');
    return new Date(res);
};

export const date = (date: string): Date => {
    const datetime = moment(new Date(date)).isValid() ? new Date(date) : new Date();
    const res = moment(datetime).add(-5, 'hours').format('YYYY-MM-DD');
    return new Date(res);
};

export const dateFormart = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}/${month}/${day}`;
};
