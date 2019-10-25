import { types } from 'mobx-state-tree';

const tariffPaymentFormModel = {
    tariff_id: types.maybeNull(types.number),
    product: types.maybeNull(types.number),
    paysystem: types.maybeNull(types.string),
    orderNumber: types.maybeNull(types.number),
    signature: types.maybe(types.string),
    productPrice: types.maybeNull(types.number),
    month: types.maybeNull(types.number),
    productName: types.maybe(types.string),
};

export default types.model('tariffPaymentFormModel', tariffPaymentFormModel);
