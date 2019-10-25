import { flow } from 'mobx-state-tree';

export default (self) => {
    return {
        preparePayment: flow(function*(data) {
            return yield self.fetchPreperePayment(data);
        }),

        activateVoucher: flow(function*(data) {
            return yield self.fetchActivateVoucher(data);
        }),

        orderTariff: flow(function*(data) {
            return yield self.fetchOrderTariff(data);
        }),
    };
};
