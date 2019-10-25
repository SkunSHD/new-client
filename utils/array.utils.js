export default {
    head: (array) => (array && array.length ? array[0] : undefined),
    last: (array) => {
        return array && array.length ? array[array.length - 1] : undefined;
    },
    uniqueItems: (array) => [...new Set(array)],
};
