import makeInspectable from 'mobx-devtools-mst';
// Utils
import LANG from '_core/utils/lang.utils';
import log from '_core/utils/log.utils';
import env from '_core/utils/env.utils';
// Models
import RootModel from '_core/models/root/Root.model';

// store init
const store = RootModel.create({
    userToken: {},
    users: {
        all: {
            anonymous: {},
        },
        authUserId: 'anonymous',
    },
    modals: {},
    alerts: {},
    forms: {},
    lang: {
        value: LANG.current,
    },
    fs: {
        tree: {},
        favs: {},
        upload: {},
        filter: {},
        fuzzySearch: {},
        sort: {},
        shared: {},
    },
    envInfo: {},
    breadcrumbs: {},
    status: {},
    googleServices: {
        ads: {},
        analytics: {},
    },
});

if (env.DEBUG_STORE) log.storeChanges(store);
log.mobxChanges();

export default makeInspectable(store);
