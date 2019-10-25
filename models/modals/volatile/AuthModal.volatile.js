import { types } from 'mobx-state-tree';

const volatile = (self) => {
    return {
        state: {
            isOpen: false,
            name: 'SignIn', // ['SignIn', 'SignUp', 'RecoverPassword']
        },
    };
};

const views = (self) => ({});

const actions = (self) => {
    return {
        change({ isOpen = false, name = 'SignIn' } = {}) {
            self.state = {
                isOpen,
                name,
            };
        },
    };
};

export default types
    .model()
    .volatile(volatile)
    .views(views)
    .actions(actions);
