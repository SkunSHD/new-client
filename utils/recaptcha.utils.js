// Store
import store from '_core/store';
// Utils
import API from '_core/utils/api.utils';
import env from '_core/utils/env.utils';

export const recaptchaValidation = async (execute) => {
    const token = await execute();
    const verifyResp = await API.post({
        endpoint: '',
        url: env.RECAPTCHA_API_URL,
        params: {
            response: token,
        },
    });

    if (verifyResp.error) {
        store.alerts.error({
            id: 'recaptchaValidation',
            msg: verifyResp.error,
        });
    }

    return verifyResp;
};
