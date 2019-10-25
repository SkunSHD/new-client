import { types } from 'mobx-state-tree';

const volatile = (self) => {
    return {
        state: {
            isOpen: false,
            startNode: {},
        },
    };
};

const views = (self) => ({});

const actions = (self) => {
    return {
        change({ isOpen = false, startNode = {} } = {}) {
            self.state = {
                isOpen,
                startNode,
            };
        },
    };
};

export default types
    .model()
    .volatile(volatile)
    .views(views)
    .actions(actions);
