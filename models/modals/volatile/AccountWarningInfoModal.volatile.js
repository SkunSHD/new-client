import { observable } from 'mobx';
import { types } from 'mobx-state-tree';

const volatile = (self) =>
    observable({
        state: {
            isOpen: false,
            title: '',
            action: '', // ['deactivateAccount', 'changePhone']
        },
    });

const views = (self) => ({});

const actions = (self) => {
    return {
        change({ isOpen = false, title = '', action = '' } = {}) {
            self.state = {
                isOpen,
                title,
                action,
            };
        },
    };
};

export default types
    .model()
    .volatile(volatile)
    .views(views)
    .actions(actions);
