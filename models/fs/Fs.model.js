import { types, flow, destroy } from 'mobx-state-tree';
// Models
import FilterModel from '_core/models/fs/Filter.model';
import FuzzySearchModel from '_core/models/fs/FuzzySearch.model';
import SortModel from '_core/models/fs/Sort.model';
import ChildModel from '_core/models/fs/Child.model';
import UploadModel from '_core/models/fs/Upload.model';
import SharedModel from '_core/models/fs/Shared.model';
import ManageModel from '_core/models/fs/Manage.model';
import ViewModel from '_core/models/fs/View.model';
// Store
import store from '_core/store';
// Utils
import API from '_core/utils/api.utils';
import log from '_core/utils/log.utils';
// Actions
import dataActions from '_core/models/fs/actions/dataFs.actions';
import fetchActions from '_core/models/fs/actions/fetchFs.actions';
import logicActions from '_core/models/fs/actions/logicFs.actions';

const FsModel = types.model('FsModel', {
    tree: ChildModel,
    favs: ChildModel,
    upload: UploadModel,
    filter: FilterModel,
    fuzzySearch: FuzzySearchModel,
    sort: SortModel,
    shared: SharedModel,

    manage: types.optional(ManageModel, {}),
    view: types.optional(ViewModel, {}),
});

const views = (self) => ({
    getNodeById(targetDirId) {
        const traverseTree = (child) => {
            if (child.id === targetDirId) return child;
            return child.children.find((child) => child.id === targetDirId);
        };

        const treeNode = traverseTree(self.tree);
        if (treeNode) return treeNode;

        const favsNode = traverseTree(self.favs);
        if (favsNode) return favsNode;
    },
    getTreeAndFavNodesById(targetDirIds) {
        const traverseTree = (child) => {
            if (targetDirIds.includes(child.id)) return child;
            return child.children.filter((child) =>
                targetDirIds.includes(child.id)
            );
        };

        return [...traverseTree(self.tree), ...traverseTree(self.favs)];
    },
    getRequestMethod(actionType) {
        switch (actionType) {
            case 'move':
            case 'rename':
            case 'removeFavorite':
            case 'addFavorite':
                return 'put';
            case 'create-dirs':
            case 'copy':
                return 'post';
            case 'delete':
                return 'delete';
            default:
                log.l('GET-REQUEST-METHOD-ERROR', actionType);
        }
    },
    getRequestUrl(actionType, targetId) {
        const convertToUpdateType = ['rename', 'removeFavorite', 'addFavorite'];
        const parsedActionType = convertToUpdateType.includes(actionType)
            ? 'update'
            : actionType;

        if (store.is.AnonPage && actionType === 'create-dirs') {
            return `anonymous/directory/${targetId}`;
        } else {
            return `file/${parsedActionType}/${targetId}`;
        }
    },
    get isInRoot() {
        return self.tree.parent_id === null;
    },
});

const actions = (self) => {
    return {
        getFullPath: flow(function*(dirId) {
            log.l('GET-BREADCRUMBS');
            const resp = yield API.get({
                url: `directory/breadcrumbs/${dirId}`,
            });
            log.l(`GET-BREADCRUMBS-${resp.error ? 'ERROR' : 'SUCCESS'}`);

            return resp;
        }),
        getFullPathAnon: flow(function*(dirId) {
            log.l('GET-BREADCRUMBS-ANON', dirId);
            const resp = yield API.get({
                url: `share/${self.shared.link}/graph`,
                params: {
                    directory_id: dirId,
                },
            });
            log.l('GET-BREADCRUMBS-ANON-SUCCESS');
            return resp;
        }),
        manageNodes: flow(function*({ targetId, ...body } = {}) {
            const {
                selectedNodeIds,
                actionType,
                selectedFilesSize,
            } = self.manage;
            log.l(`${actionType}-NODES`);

            const response = yield API[self.getRequestMethod(actionType)]({
                url: self.getRequestUrl(actionType, targetId),
                options: {
                    body: {
                        ...(Object.keys(body).length
                            ? body
                            : { files_ids: selectedNodeIds }),
                    },
                },
            });

            if (response.error) {
                log.l(`${actionType}-NODES-ERROR`, response);

                store.alerts.error({
                    id: actionType,
                    msg: response.error,
                });

                return response;
            }

            log.l(`${actionType}-NODES-SUCCESS`, response);

            self.updateTree({
                files_ids: selectedNodeIds,
                actionType,
                targetId,
                response,
                ...body,
            });

            store.users.currentAuthUser.updateUsedSpaceByType(
                actionType,
                selectedFilesSize
            );

            // Clear selected nodes
            if (['copy', 'move', 'delete'].includes(actionType)) {
                self.manage.resetSelected();
            }

            store.alerts.success({
                id: actionType,
                msg: actionType,
            });

            return response;
        }),
        updateTree({
            actionType,
            targetId,
            files_ids,
            name,
            is_favorite,
            response,
        }) {
            switch (actionType) {
                case 'move':
                case 'delete':
                    self.getTreeAndFavNodesById(files_ids).forEach(destroy);
                    break;
                case 'rename':
                    self.getTreeAndFavNodesById([targetId]).forEach(
                        (node) => (node.name = name)
                    );
                    break;
                case 'removeFavorite':
                case 'addFavorite':
                    self.toggleFav(targetId, is_favorite);
                    break;
                case 'create-dirs':
                    const {
                        data,
                        anon_upload_root_id,
                        anon_upload_link,
                    } = response;

                    if (store.is.AnonPage) {
                        self.shared.setSharedLink(anon_upload_link);
                    }

                    const [createdDir] = data;
                    self.tree.children.push(createdDir);
                    break;
            }
        },
        getTree: flow(function*({ dirId, dirsOnly } = {}) {
            const treeFirstPageResp = yield self.fetchTree({
                dirId,
                dirsOnly,
                // page: 1,
                // sort_by: 'created_at',
            });

            if (treeFirstPageResp.error) {
                if ([400, 403].includes(treeFirstPageResp.error.status)) {
                    store.modals.open({ id: 'NoFilesAvailableModal' });
                } else {
                    store.alerts.error({
                        id: 'ServerProblem',
                        msg: 2403,
                    });
                }

                return treeFirstPageResp;
            } else {
                yield store.users.currentAuthUser.getCustomSettings({ dirId });
                // yield store.users.currentAuthUser.clearCustomSettings()
                self.setTreeData(treeFirstPageResp);
            }

            return treeFirstPageResp;
        }),
        setTreeData({ tree, favs, breadcrumbs, shared_link }) {
            self.setCurrentTree(tree);
            self.setFavs(favs);
            store.breadcrumbs.setBreadcrumbs(breadcrumbs);
            self.shared.updateSharedModel(shared_link);
        },
        setRootId(rootId, from) {
            log.l('SET-ROOT-ID-SUCCESS', 'from: ', from);
            self.tree.id = rootId;
        },
        ...dataActions(self),
        ...fetchActions(self),
        ...logicActions(self),
    };
};

export default FsModel.views(views).actions(actions);
