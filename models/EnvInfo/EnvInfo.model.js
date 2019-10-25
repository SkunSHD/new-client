import { types } from 'mobx-state-tree';

const EnvInfoModel = {
    branch: types.maybe(types.string),
    built: types.maybe(types.string),
    db: types.maybe(types.string),
    revision: types.maybe(types.string),
    tag: types.maybeNull(types.string),
};

export default types.model('EnvInfoModel', EnvInfoModel);
