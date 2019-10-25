import { types } from 'mobx-state-tree';
// Actions
import dataActions from '_core/models/user/actions/dataUser.actions';
import fetchActions from '_core/models/user/actions/fetchUser.actions';
import logicActions from '_core/models/user/actions/logicUser.actions';
// Models
import BillingModel from '_core/models/billing/Billing.model';
import AdminModel from '_core/models/admin/Admin.model';
import StorageModel from '_core/models/storage/Storage.model';

const UserModel = types.model({
    GDPR: types.maybe(types.boolean),
    country: types.maybeNull(types.string),
    created_at: types.maybe(types.number),
    email: types.maybeNull(types.string),
    social_network: types.maybeNull(types.string),
    first_name: types.maybeNull(types.string),
    flags: types.maybe(types.number),
    has_email: types.maybe(types.boolean),
    has_password: types.maybe(types.boolean),
    id: types.maybe(types.number),
    phone: types.maybeNull(types.string),
    priv: types.maybe(types.number),
    username: types.maybeNull(types.string),
});

const volatile = (self) => {
    return {
        // represents settings we keep on the server
        settings: {},
    };
};

const views = (self) => {
    return {};
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
    .compose(
        BillingModel,
        AdminModel,
        UserModel,
        StorageModel
    )
    .volatile(volatile)
    .views(views)
    .actions(actions);
