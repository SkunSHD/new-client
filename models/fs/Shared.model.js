import { types, flow } from 'mobx-state-tree';
import store from '_core/store';
// Utils
import env from '_core/utils/env.utils';
import log from '_core/utils/log.utils';
import API from '_core/utils/api.utils';
import routerUrls from '_core/utils/routerUrls.utils';
import history from '_core/utils/history.utils';
import { setValues, updateIfNotUndef } from '_core/utils/fs.utils';

const SharedModel = types
    .model('Shared', {
        anonToken: types.maybe(types.string),
        expires_at: types.maybeNull(types.number),
        link: types.maybe(types.string),
        permission: types.maybe(types.number),
        title: types.optional(types.string, 'Anonymous folder'),
        update_password: types.maybe(types.boolean),
        isOnlyFileShared: types.optional(types.boolean, false),
    })
    .views((self) => ({
        get hasLink() {
            return !!self.link;
        },
        get hasAnonToken() {
            return !!self.anonToken;
        },
        get fullLink() {
            return `${env.FEX_URL}${routerUrls.goTo.SharedPage}/${self.link}`;
        },
        get isSharedByAnon() {
            return !!self.expires_at;
        },
    }))
    .actions((self) => ({
        saveToStorage: flow(function*({ files_ids = [] } = {}) {
            if (!files_ids.length) {
                store.fs.tree.children.forEach((child) =>
                    files_ids.push(child.id)
                );
            }

            const resp = yield API.post({
                url: `file/copy`,
                options: {
                    body: {
                        files_ids,
                    },
                },
            });

            if (resp.error) {
                store.alerts.error({
                    id: 'copyAnonDir',
                    msg: resp.error,
                });
            } else {
                store.goToPage({
                    url: `${routerUrls.goTo.FsPage}/${resp.id}`,
                });
            }

            return resp;
        }),
        refreshAnonToken: flow(function*() {
            const anonToken = yield API.get({
                url: 'anonymous/upload-token',
            });

            if (!anonToken.token) {
                return log.l('REFRESH-ANON-TOKEN-ERROR');
            }

            self.anonToken = anonToken.token;
            return anonToken;
        }),
        changeDir(dirId) {
            history.push({
                pathname: '',
                state: {
                    dirId,
                },
            });
        },
        setSharedLink(sharedLink) {
            if (self.link || self.link === sharedLink) return;
            log.l('SET-SHARED-LINK-SUCCESS');
            self.link = sharedLink;
        },
        updateSharedModel(newSharedData) {
            if (!newSharedData) return;
            log.l('UPDATE-SHARED-MODEL-SUCCESS', newSharedData);
            updateIfNotUndef(self, newSharedData);
        },
        clear() {
            setValues(self, {
                link: '',
                expires_at: null,
                anonToken: '',
                title: 'Anonymous folder',
            });
        },
    }));

export default SharedModel;
