import { types, flow } from 'mobx-state-tree';
// Store
import store from '_core/store';
// Utils
import { merge } from '_core/utils/fs.utils';
import { observable } from 'mobx/lib/mobx';

// shallow observable object
// (reacts on [volatile.user = {}], but don't on [volatile.user.name = 'Izya'])
const volatile = {
    curDirId: null,
    curDir: {},
    markedDirId: null,

    copyTarget: 'storage',

    crumbNodes: observable.box([]),
};

const views = (self) => ({
    get selectedName() {
        const { manage } = store.fs;
        if (manage.selectedCount > 1) {
            return { count: manage.selectedCount };
        } else {
            // Watch out! [oneChosenNode] getter is expensive,
            // therefore don't use destructuring for it below
            return { name: manage.oneChosenNode.name };
        }
    },
    isCopyIn(targetName) {
        return self.copyTarget === targetName;
    },
});

const actions = (self) => {
    return {
        change({ ...rest } = {}) {
            return merge(self, { ...rest });
        },
        open({ actionType = '' }) {
            store.modals.open({ id: 'ManageTreeModal', actionType });
        },
        fetchDir: flow(function*(dirId) {
            if (self.curDir.id !== undefined && self.curDir.id === dirId)
                return;

            const resp = yield store.fs.fetchTree({
                dirId,
                dirsOnly: 1,
            });

            self.crumbNodes.set(resp.breadcrumbs);
            self.change({
                curDir: resp.tree,
                curDirId: resp.tree.id,
                markedDirId: resp.tree.id,
            });
        }),
        onCrumbClick: (dir) => {
            if (dir.id === self.curDirId) return;
            self.change({ curDirId: dir.id, markedDirId: dir.id });
        },
        onTreeModalSubmit: () => {
            if (self.isCopyIn('anon')) {
                store.fs.manage.copyNodesToAnon();
            } else {
                store.fs.manageNodes({
                    targetId: self.markedDirId,
                });
            }

            self.close();
        },
        close() {
            merge(self, volatile);
            store.modals.close();
        },
    };
};

export default types
    .model()
    .volatile(() => volatile)
    .views(views)
    .actions(actions);
