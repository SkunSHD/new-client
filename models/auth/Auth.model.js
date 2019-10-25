import { types } from 'mobx-state-tree';
// Actions
import dataActions from '_core/models/auth/actions/dataAuth.actions';
import fetchActions from '_core/models/auth/actions/fetchAuth.actions';
import logicActions from '_core/models/auth/actions/logicAuth.actions';

const AuthModel = {};

// model mutations goes only in actions
const actions = (self) => {
    return {
        ...dataActions(self),
        ...fetchActions(self),
        ...logicActions(self),
    };
};

export default types.model('AuthModel', AuthModel).actions(actions);
