import { types } from 'mobx-state-tree';

const PaymentModel = {
    created_at: types.maybeNull(types.number),
    is_successful: types.maybeNull(types.boolean),
    name: types.maybeNull(types.string),
    value: types.maybeNull(types.number),
    period: types.maybeNull(types.number),
    paysystem: types.maybeNull(types.number),
};

export default types.model('PaymentModel', PaymentModel);
