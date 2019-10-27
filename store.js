import { types } from 'mobx-state-tree';

const RootModel = types
    .model({
        user: types.frozen(),
    })
    .actions(self => ({
        setUser(user) {
            self.user = user;
        },
    }));

const store = RootModel.create({
    user: {},
});

export default store;


// import makeInspectable from 'mobx-devtools-mst';
// // Utils
// import LANG from './utils/lang.utils';
// import log from './utils/log.utils';
// import env from './utils/env.utils';
// Models
// import RootModel from './models/root/Root.model';

// store init
// const store = RootModel.create({
//     userToken: {},
//     users: {
//         all: {
//             anonymous: {},
//         },
//         authUserId: 'anonymous',
//     },
//     modals: {},
//     alerts: {},
//     forms: {},
//     lang: {
//         value: LANG.current,
//     },
//     fs: {
//         tree: {},
//         favs: {},
//         upload: {},
//         filter: {},
//         fuzzySearch: {},
//         sort: {},
//         shared: {},
//     },
//     envInfo: {},
//     breadcrumbs: {},
//     status: {},
//     googleServices: {
//         ads: {},
//         analytics: {},
//     },
// });

// if (env.DEBUG_STORE) log.storeChanges(store);
// log.mobxChanges();

// export default makeInspectable(store);
