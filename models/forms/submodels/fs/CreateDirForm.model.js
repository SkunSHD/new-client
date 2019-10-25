import { types } from 'mobx-state-tree';

const CreateDirFormModel = {
    name: types.string,
};

export default types.model('CreateDirFormModel', CreateDirFormModel);
