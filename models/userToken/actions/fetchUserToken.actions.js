// Utils
import API from '_core/utils/api.utils';

export default () => {
    return {
        fetchRefreshToken({ token = '' }) {
            return API.post({
                endpoint: API.url({ urlPrefix: API.CLIENT_URL_PREFIX }),
                url: 'auth/refresh',
                options: {
                    body: { token },
                },
            });
        },
    };
};
