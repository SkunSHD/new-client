import { types } from 'mobx-state-tree';
// Store
import store from '_core/store';

const volatile = {
    isTitleRename: false,
};

const views = (self) => ({});

const actions = (self) => {
    return {
        open({ isTitleRename = false } = {}) {
            self.isTitleRename = isTitleRename;

            store.modals.open({ id: 'RenameNodeModal', actionType: 'rename' });
        },
    };
};

export default types
    .model()
    .volatile(() => volatile)
    .views(views)
    .actions(actions);
