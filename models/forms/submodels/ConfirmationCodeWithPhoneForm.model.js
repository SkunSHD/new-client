import { types } from 'mobx-state-tree';

const ConfirmationCodeWithPhoneForm = {
    phone: types.optional(types.string, ''),
    isPhoneInvalid: types.optional(types.boolean, true),
};

export default types.model(
    'ConfirmationCodeWithPhoneForm',
    ConfirmationCodeWithPhoneForm
);
