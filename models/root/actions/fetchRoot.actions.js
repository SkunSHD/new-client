import { flow } from 'mobx-state-tree';
// Utils
import API from '_core/utils/api.utils';

export default () => {
    return {
        fetchConfig: flow(function*() {
            return yield API.get({
                endpoint: API.url({ urlPrefix: API.CLIENT_URL_PREFIX }),
                url: 'config',
            });
        }),

        fetchFexFilesCount() {
            return API.get({ url: 'storage/files-count' });
        },
    };
};
