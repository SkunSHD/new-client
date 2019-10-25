import { types } from 'mobx-state-tree';

const DeleteAccountStep1FormModel = {
    password: types.optional(types.string, ''),
    isPasswordShow: types.optional(types.boolean, true),
};

const volatile = (self) => {
    return {
        isRequestDeleteAccount: false,
    };
};

// model mutations goes only in actions
const actions = (self) => {
    return {
        setRequestDeleteAccount(isRequestDeleteAccount = false) {
            self.isRequestDeleteAccount = isRequestDeleteAccount;
        },
    };
};

export default types
    .model('DeleteAccountStep1FormModel', DeleteAccountStep1FormModel)
    .volatile(volatile)
    .actions(actions);
