import { types } from 'mobx-state-tree';

const RecoverPasswordStep1FormModel = {
    email: types.optional(types.string, ''),
};

const volatile = (self) => {
    return {
        isRequestPasswordRecovery: false,
    };
};

// model mutations goes only in actions
const actions = (self) => {
    return {
        setRequestPasswordRecovery(isRequestPasswordRecovery = false) {
            self.isRequestPasswordRecovery = isRequestPasswordRecovery;
        },
    };
};

export default types
    .model('RecoverPasswordStep1FormModel', RecoverPasswordStep1FormModel)
    .volatile(volatile)
    .actions(actions);
