import { types } from 'mobx-state-tree';
// Utils
import units from '_core/utils/units.utils';
// Actions
import dataActions from '_core/models/storage/actions/dataStorage.actions';
import fetchActions from '_core/models/storage/actions/fetchStorage.actions';
import logicActions from '_core/models/storage/actions/logicStorage.actions';

const StorageModel = {
    total_space: types.optional(types.number, 0),
    used_space: types.maybeNull(types.number),
};

const views = (self) => {
    return {
        get usedSpaceInBytes() {
            return !!self.used_space ? self.used_space : 0;
        },
        get totalSpaceWithUnits() {
            return units.getSizeAndUnit(self.total_space);
        },
        get usedSpaceWithUnits() {
            return units.getSizeAndUnit(self.usedSpaceInBytes);
        },
        get totalSpaceInBytes() {
            return self.total_space;
        },
        get storageUsage() {
            return (self.usedSpaceInBytes / self.total_space) * 100;
        },
    };
};

// model mutations goes only in actions
const actions = (self) => {
    return {
        ...dataActions(self),
        ...fetchActions(self),
        ...logicActions(self),
    };
};

export default types
    .model('StorageModel', StorageModel)
    .views(views)
    .actions(actions);
