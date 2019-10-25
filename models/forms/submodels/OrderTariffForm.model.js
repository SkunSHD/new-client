import { types } from 'mobx-state-tree';

const OrderTariffFormModel = {
    tariff_id: types.maybeNull(types.number),
    email: types.maybeNull(types.string),
};

export default types.model('OrderTariffFormModel', OrderTariffFormModel);
