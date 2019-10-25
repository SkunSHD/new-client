import { types } from 'mobx-state-tree';
// Actions
import dataActions from '_core/models/userToken/actions/dataUserToken.actions';
import fetchActions from '_core/models/userToken/actions/fetchUserToken.actions';
import logicActions from '_core/models/userToken/actions/logicUserToken.actions';

const UserTokenModel = {
    refresh_token: types.maybeNull(types.string),
    token: types.maybeNull(types.string),
};

// model mutations goes only in actions
const actions = (self) => {
    return {
        ...dataActions(self),
        ...fetchActions(self),
        ...logicActions(self),
    };
};

const views = (self) => {
    return {
        get authClientToken() {
            return (
                self.token ||
                self.session ||
                localStorage.getItem('token') ||
                ''
            );
        },

        get session() {
            return sessionStorage.getItem('token');
        },

        get authClientRefreshToken() {
            return (
                self.refresh_token ||
                self.sessionRefreshToken ||
                localStorage.getItem('refreshToken')
            );
        },

        get sessionRefreshToken() {
            return sessionStorage.getItem('refreshToken');
        },

        get sessionSudosuToken() {
            return sessionStorage.getItem('sudosuToken');
        },

        get sessionSudosuRefreshToken() {
            return sessionStorage.getItem('sudosuRefreshToken');
        },

        get all() {
            return {
                token: self.sessionSudosuToken || self.authClientToken,
                refresh_token:
                    self.sessionSudosuRefreshToken ||
                    self.authClientRefreshToken,
            };
        },
    };
};

export default types
    .model('UserTokenModel', UserTokenModel)
    .views(views)
    .actions(actions);
