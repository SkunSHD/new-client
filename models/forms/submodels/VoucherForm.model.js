import { types } from 'mobx-state-tree';

const VoucherFormModel = {
    code: types.optional(types.string, ''),
};

export default types.model('VoucherFormModel', VoucherFormModel);
