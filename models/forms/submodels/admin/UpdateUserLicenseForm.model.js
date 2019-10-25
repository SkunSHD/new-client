import { types } from 'mobx-state-tree';

const UpdateUserLicenseFormModel = {
    paid_till: types.maybeNull(types.number),
};

export default types.model(
    'UpdateUserLicenseFormModel',
    UpdateUserLicenseFormModel
);
