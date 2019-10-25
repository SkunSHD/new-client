import { types } from 'mobx-state-tree';

const ReceiveFilesFormModel = {
    code: types.optional(types.string, ''),
};

export default types.model('ReceiveFilesFormModel', ReceiveFilesFormModel);
