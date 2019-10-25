import { values, observable } from 'mobx';
import { types } from 'mobx-state-tree';
// Store
import store from '_core/store';
// Utils
import routerUrls from '_core/utils/routerUrls.utils';

const volatile = (self) => ({
    selected: observable.map(),
    actionType: '', // copy, move, delete, rename, create-dirs
    hoverNodeId: null,
    isSingle: false,
    isShiftDown: false,
    lastSelectedItem: null,
});

const views = (self) => ({
    get selectedCount() {
        return self.selected.size;
    },
    get selectedAll() {
        return values(self.selected);
    },
    get selectedDirs() {
        return self.selectedAll.filter((node) => node.is_dir);
    },
    get selectedDirIds() {
        return self.selectedDirs.map((node) => node.id);
    },
    get selectedFiles() {
        return self.selectedAll.filter((node) => !node.is_dir);
    },
    get selectedFileIds() {
        return self.selectedFiles.map((node) => node.id);
    },
    get selectedNodeIds() {
        return self.selectedAll.map((node) => node.id);
    },
    get selectedFilesSize() {
        return self.selectedFiles.reduce((acc, node) => acc + node.size, 0);
    },
    // use when gonna be one endpoint for copy of dirs and files
    get selectedNodesSize() {
        return [...self.selectedDirs, ...self.selectedFiles].reduce(
            (acc, node) => {
                return acc + node.size;
            },
            0
        );
    },
    get hasOneChosenNode() {
        return self.isSingle || self.selectedCount === 1;
    },
    get oneChosenNode() {
        return self.selectedAll[0];
    },
});

const actions = (self) => {
    return {
        onCheckboxChange(node) {
            if (self.isShiftDown) {
                const newValues = self.getNextValue(node.id);
                self.selected = observable.map(newValues);
            } else {
                if (self.selected.has(node.id)) {
                    self.selected.delete(node.id);
                } else {
                    self.selected.set(node.id, node);
                }
            }
            self.lastSelectedItem = node.id;
        },
        getNextValue: (newId) => {
            const curSelectedItems = [...self.selected.keys()];
            const newSelectedItems = self.getNewSelectedItems(newId);

            // de-dupe the array using a Set
            let resultSelectedIds = [
                ...new Set([...curSelectedItems, ...newSelectedItems]),
            ];

            // unselect case
            if (curSelectedItems.includes(newId)) {
                resultSelectedIds = resultSelectedIds.filter(
                    (item) => !newSelectedItems.includes(item)
                );
            }

            const selectedNodes = resultSelectedIds.map((selectedId) => {
                const selectedNode = store.fs.view.viewNodesAll.find(
                    (node) => node.id === selectedId
                );
                return [selectedId, selectedNode];
            });
            // [[nodeId, node], ...] - structure for map constructor
            return selectedNodes;
        },
        getNewSelectedItems: (selectedId) => {
            const items = store.fs.view.viewNodesAll.map((node) => node.id);

            const currentSelectedIndex = items.findIndex(
                (id) => id === selectedId
            );
            const lastSelectedIndex = items.findIndex(
                (id) => id === self.lastSelectedItem
            );

            return items.slice(
                Math.min(lastSelectedIndex, currentSelectedIndex),
                Math.max(lastSelectedIndex, currentSelectedIndex) + 1
            );
        },
        handleKeyUp: (e) => {
            if (e.key === 'Shift' && self.isShiftDown) {
                self.isShiftDown = false;
            }
        },
        handleKeyDown: (e) => {
            if (e.key === 'Shift' && !self.isShiftDown) {
                self.isShiftDown = true;
            }
        },
        resetSelected() {
            self.selected.clear();
            self.actionType = '';
            self.isSingle = false;
        },
        setHoverId(nodeId) {
            self.hoverNodeId = nodeId;
        },
        setSelectedNode({ node, isSingle = false }) {
            if (isSingle) self.isSingle = true;
            self.selected.set(node.id, node);
        },
        setActionType(actionType) {
            self.actionType = actionType;
        },
        dropNode: async ({ sourceId }) => {
            const targetId = self.hoverNodeId;

            // prevent folding in itself
            if (sourceId === targetId) return;
            self.actionType = 'move';

            const sourceNode = store.fs.getNodeById(sourceId);

            store.fs.manage.setSelectedNode({
                node: sourceNode,
                isSingle: self.hasOneChosenNode,
            });

            await store.fs.manageNodes({ targetId });

            store.alerts.success({
                id: 'move',
                msg: 'move',
            });
        },
        copyNodesToAnon: async () => {
            const response = await store.fs.fetchSharedLink({
                method: 'post',
                data: {
                    files_ids: self.selectedNodeIds,
                    is_anon: true,
                },
            });

            if (response.error) {
                store.alerts.error({
                    id: 'copyNodesToAnon',
                    msg: response.error,
                });
            } else {
                store.goToPage({
                    url: `${routerUrls.goTo.SharedPage}/${response.link}`,
                });

                store.alerts.success({
                    id: 'copy',
                    msg: 'copy',
                });
            }
        },
    };
};

export default types
    .model('ManageModel', {})
    .volatile(volatile)
    .views(views)
    .actions(actions);
