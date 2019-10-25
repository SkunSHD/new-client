import { types } from 'mobx-state-tree';

const SharedLinkChild = {
    id: types.number,
    link: types.string,
    title: types.string,
    is_one_time: types.boolean,
    expires_at: types.maybeNull(types.number),
};

export default types.model('SharedLinkChild', SharedLinkChild);
