export function getNestedValue(obj: Record<string, any>, path: string, defaultValue: any = undefined) {
    const keys = path.split('.');
    let value = obj;

    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return defaultValue; // La clave no existe en el camino
        }
    }

    return value;
}
