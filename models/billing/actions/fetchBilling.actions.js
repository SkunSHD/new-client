import { flow } from 'mobx-state-tree';
// Utils
import API from '_core/utils/api.utils';

export default () => {
    return {
        fetchPreperePayment: flow(function*({
            tariff_id = undefined,
            product = undefined,
            signature = undefined,
        }) {
            return yield API.post({
                url: 'billing/prepare',
                options: {
                    body: {
                        tariff_id,
                        product,
                        ...(signature && { signature }),
                    },
                },
            });
        }),

        fetchActivateVoucher: flow(function*({ code = '' }) {
            return yield API.post({
                url: 'billing/activate-voucher',
                options: {
                    body: { code },
                },
            });
        }),

        fetchOrderTariff: flow(function*({
            method = 'post',
            email,
            tariff_id,
        }) {
            const body = {
                email,
                tariff_id,
            };
            const options = method === 'post' ? { body } : {};
            return yield API[method]({
                url: 'billing/request-prem',
                options,
            });
        }),
    };
};
