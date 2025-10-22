export const sortObject = (obj: Record<string, any>) => {
    return Object.keys(obj).sort().reduce<Record<string, any>>((acc, key) => {
        acc[key] = obj[key];
        return acc;
    }, {});
};