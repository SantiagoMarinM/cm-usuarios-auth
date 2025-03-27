import { error } from 'console';

export const validateEnvs = (ENV: Record<string, string>): never | void => {
    const indefinidas: string[] = [];
    Object.keys(ENV).forEach((key) => {
        if (!process.env[key]) indefinidas.push(key);
    });
    if (indefinidas.length) {
        error(`Las siguientes variables no están definidas en los ENV:\n${indefinidas.join(' \n')}\n`);
        process.exit(1);
    }
};
