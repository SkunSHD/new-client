import { types } from 'mobx-state-tree';

const tariffPlanFormModel = {
    tariffPlan: types.maybeNull(types.number),
    tariffName: types.maybeNull(types.string),
};

export default types.model('tariffPlanFormModel', tariffPlanFormModel);
