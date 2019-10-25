import { types } from 'mobx-state-tree';
// Actions
import dataActions from '_core/models/root/actions/dataRoot.actions';
import fetchActions from '_core/models/root/actions/fetchRoot.actions';
import logicActions from '_core/models/root/actions/logicRoot.actions';
// Models
import AuthModel from '_core/models/auth/Auth.model';
import UserTokenModel from '_core/models/userToken/UserToken.model';
import UsersModel from '_core/models/users/Users.model';
import FormsModel from '_core/models/forms/Forms.model';
import LangModel from '_core/models/lang/Lang.model';
import ModalsModel from '_core/models/modals/Modals.model';
import AlertsModel from '_core/models/alerts/Alerts.model';
import FsModel from '_core/models/fs/Fs.model';
import EnvInfoModel from '_core/models/EnvInfo/EnvInfo.model';
import StatusModel from '_core/models/fs/Status.model';
import BreadcrumbsModel from '_core/models/breadcrumbs/volatile/Breadcrumbs.volatile';
import GoogleServicesModel from '_core/models/googleServices/GoogleServices.model';

const RootModel = types.model({
    userToken: UserTokenModel,
    users: UsersModel,
    forms: FormsModel,
    lang: LangModel,
    modals: ModalsModel,
    alerts: AlertsModel,
    nextPathUrl: types.maybe(types.string),
    routeName: types.maybe(types.string),
    routeUrl: types.maybe(types.string),
    fs: FsModel,
    status: StatusModel,
    breadcrumbs: BreadcrumbsModel,
    envInfo: types.maybe(EnvInfoModel),
    googleServices: GoogleServicesModel,
});

const volatile = (self) => {
    return {
        is: new Proxy(
            {},
            {
                get(target, key) {
                    return self.routeName === key;
                },
            }
        ),

        locationState: {},
        fexFilesCount: 1365249930,
        sessionId: null,
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
    .compose(
        AuthModel,
        RootModel
    )
    .volatile(volatile)
    .actions(actions);
