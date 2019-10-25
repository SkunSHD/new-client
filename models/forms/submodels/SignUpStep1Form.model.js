import { types } from 'mobx-state-tree';

const signUpStep1FormModel = {
    email: types.optional(types.string, ''),
    first_name: types.optional(types.string, ''),
    password: types.optional(types.string, ''),
    isPasswordShow: types.boolean,
    terms: types.optional(types.boolean, false),
    privacy: types.optional(types.boolean, false),
};

const volatile = (self) => {
    return {
        isRequestScaffold: false,
    };
};

// model mutations goes only in actions
const actions = (self) => {
    return {
        setRequestPhoneScaffold(isRequestScaffold = false) {
            self.isRequestScaffold = isRequestScaffold;
        },
    };
};

export default types
    .model('signUpStep1FormModel', signUpStep1FormModel)
    .volatile(volatile)
    .actions(actions);
