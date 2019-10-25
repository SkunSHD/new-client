import API from '_core/utils/api.utils';

export default () => {
    return {
        fetchUpdateUsedSpaceTotal() {
            return API.get({
                url: 'config/storage',
            });
        },
    };
};
