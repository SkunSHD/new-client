import { types } from 'mobx-state-tree';
// Utils
import TARIFF from '_core/utils/tariff.utils';

const Licenses = {
    id: types.maybe(types.number),
    active_until_at: types.maybeNull(types.number),
    files_delete_date: types.maybeNull(types.number),
    discount: types.maybeNull(types.number),
    name: types.maybeNull(types.string),
    period: types.maybeNull(types.number),
    price: types.maybeNull(types.number),
    product: types.optional(types.number, TARIFF.FEX_PLUS),
    value: types.optional(types.number, 0),
    is_trial: types.optional(types.boolean, true),
};

export default types.model('Licenses', Licenses);
