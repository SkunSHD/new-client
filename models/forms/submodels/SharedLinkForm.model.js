import { types } from 'mobx-state-tree';

const SharedLinkFormModel = {
    isAccesByLink: types.optional(types.boolean, false),
};

export default types.model('SharedLinkFormModel', SharedLinkFormModel);
