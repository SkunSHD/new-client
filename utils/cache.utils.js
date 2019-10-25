const CACHE = {
    DEBUG_CACHE: true,

    _fetchedDataList: [],

    // Once [fetched], data will not fetch() from server next time
    saveAsFetched: (name) => {
        let styles = `color: orange; font-weight: bold;`;
        if (CACHE.DEBUG_CACHE)
            console.log(
                `%c CACHE:: saved -> loaded from server [${name}]`,
                styles
            );
        if (!CACHE._fetchedDataList.includes(name))
            CACHE._fetchedDataList.push(name);
    },

    isFetched: (name, forceRequest = false) => {
        let isIncludes = CACHE._fetchedDataList.includes(name);
        let styles = `color: ${
            isIncludes ? 'green' : 'orange'
        }; font-weight: bold;`;

        if (forceRequest) {
            if (CACHE.DEBUG_CACHE)
                console.log(
                    `%c CACHE:: request [FORCE] -> loaded from server [${name}]`,
                    `color: orange; font-weight: bold;`
                );
            return false;
        }
        if (isIncludes) {
            if (CACHE.DEBUG_CACHE)
                console.log(
                    `%c CACHE:: get -> loaded from cache [${name}]`,
                    styles
                );
        }
        return isIncludes;
    },

    remove: (name) => {
        let styles = `color: red; font-weight: bold;`;
        if (CACHE.DEBUG_CACHE)
            console.log(`%c CACHE:: removed -> [${name}]`, styles);
        delete CACHE[name];
    },
};

export default CACHE;
