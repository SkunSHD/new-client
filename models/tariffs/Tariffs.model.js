import { types } from 'mobx-state-tree';

const Tariffs = {
    id: types.number,
    discount: types.maybeNull(types.number),
    name: types.maybeNull(types.string),
    period: types.maybeNull(types.number),
    price: types.maybeNull(types.number),
    product: types.maybeNull(types.number),
    value: types.maybeNull(types.number),
    is_trial: types.optional(types.boolean, false),
};

export default types.model('Tariffs', Tariffs);
