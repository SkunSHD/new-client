import { types } from 'mobx-state-tree';
import { merge } from '_core/utils/fs.utils';

const RenameNodeFormModel = {
    name: types.optional(types.string, ''),
};

const volatile = {
    isDisabledSubmit: true,
    isSubmitted: false,
};

const views = (self) => ({});

const actions = (self) => {
    return {
        change({ isDisabledSubmit = true, ...rest } = {}) {
            return merge(self, { isDisabledSubmit, ...rest });
        },
    };
};

export default types
    .model('RenameNodeFormModel', RenameNodeFormModel)
    .volatile(() => volatile)
    .views(views)
    .actions(actions);
