import { types } from 'mobx-state-tree';

const AdminModel = {
    permissions: types.maybe(types.array(types.number)),
};

export default types.model('AdminModel', AdminModel);
