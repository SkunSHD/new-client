import { types } from 'mobx-state-tree';

const ChangePhoneStep1FormModel = {
    phone: types.optional(types.string, ''),
    password: types.optional(types.string, ''),
    isPasswordShow: types.optional(types.boolean, false),
    isPhoneInvalid: types.optional(types.boolean, true),
};

const volatile = (self) => {
    return {
        isRequestPhoneChange: false,
    };
};

// model mutations goes only in actions
const actions = (self) => {
    return {
        setRequestPhoneChange(isRequestPhoneChange = false) {
            self.isRequestPhoneChange = isRequestPhoneChange;
        },
    };
};

export default types
    .model('ChangePhoneStep1FormModel', ChangePhoneStep1FormModel)
    .volatile(volatile)
    .actions(actions);
