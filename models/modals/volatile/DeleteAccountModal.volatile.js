import { observable } from 'mobx';
import { types } from 'mobx-state-tree';

const volatile = (self) =>
    observable({
        state: {
            isOpen: false,
            isDisabledSubmit: true,
            isSubmitted: false,
        },
    });

const views = (self) => ({});

const actions = (self) => {
    return {
        change({
            isOpen = false,
            isDisabledSubmit = true,
            isSubmitted = false,
        } = {}) {
            self.state = {
                isOpen,
                isDisabledSubmit,
                isSubmitted,
            };
        },
    };
};

export default types
    .model()
    .volatile(volatile)
    .views(views)
    .actions(actions);
