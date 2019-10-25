import { types } from 'mobx-state-tree';
// Store
import store from '_core/store';

const volatile = {
    sharedType: '', // ['link', 'key']
};

const views = (self) => ({});

const actions = (self) => {
    return {
        open(sharedType = 'link') {
            self.sharedType = sharedType;

            store.modals.open({
                id: 'SharedModal',
                actionType: 'shared',
            });
        },
    };
};

export default types
    .model()
    .volatile(() => volatile)
    .views(views)
    .actions(actions);
