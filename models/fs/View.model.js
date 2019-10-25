import { types } from 'mobx-state-tree';
import store from '_core/store';
// Utils
import env from '_core/utils/env.utils';
import { update } from '_core/utils/fs.utils';

const listState = {
    isGridView: false,
    rowHeight: 72,
};

const gridState = {
    isGridView: true,
    rowHeightDir: env.IS_MOBILE ? 64 : 60,
    rowHeightFile: env.IS_MOBILE ? 224 : 260,
    dirsPerRow: env.IS_MOBILE ? 2 : 3,
    filesPerRow: env.IS_MOBILE ? 2 : 6,
};

const volatile = (self) => ({
    ...listState,
    isCanDrag: true,
});

const views = (self) => ({
    get viewNodesAll() {
        return store.fs.filter.nodes;
    },
    get viewNodes() {
        return self.viewNodesAll.reduce(
            (acc, node) =>
                acc[node.is_dir ? 'dirs' : 'files'].push(node) && acc,
            { dirs: [], files: [] }
        );
    },
    get dirCount() {
        return self.viewNodes.dirs.length;
    },
    get firstRowWithFilesIndex() {
        return Math.ceil(self.dirCount / self.dirsPerRow);
    },
    get rowCount() {
        if (self.isGridView) {
            return self.gridIndexMap.length;
        } else {
            return self.viewNodesAll.length;
        }
    },
    get gridIndexMap() {
        const { viewNodes, dirsPerRow, filesPerRow, dirCount } = self;

        const dirIndexMap = this.createIndexMap(viewNodes.dirs, dirsPerRow);
        const fileIndexMap = this.createIndexMap(
            viewNodes.files,
            filesPerRow,
            dirCount
        );
        return [...dirIndexMap, ...fileIndexMap];
    },
    createIndexMap(nodes, itemsPerRow, deltaNodeInd = 0) {
        const rows = [];
        const rowCount = Math.ceil(nodes.length / itemsPerRow);

        // rows
        for (let rowInd = 0; rowInd < rowCount; rowInd++) {
            const row = [];
            const fromNodeInd = rowInd * itemsPerRow;
            const toNodeInd = Math.min(fromNodeInd + itemsPerRow, nodes.length);

            // cols
            for (
                let curNodeInd = fromNodeInd;
                curNodeInd < toNodeInd;
                curNodeInd++
            ) {
                row.push(curNodeInd + deltaNodeInd);
            }

            // last row
            if (rowInd + 1 === rowCount) {
                // add empty nodes
                const emptyNodesCount = itemsPerRow - row.length;
                for (
                    let emptyNode = 0;
                    emptyNode < emptyNodesCount;
                    emptyNode++
                ) {
                    row.push(null);
                }
            }

            rows.push(row);
        }
        return rows;
    },
    isDirRow(rowIndex) {
        return rowIndex < self.firstRowWithFilesIndex;
    },
    isLastDirRow(rowIndex) {
        return rowIndex === self.firstRowWithFilesIndex - 1;
    },
    isAdShow(nodeIndex) {
        if (!store.googleServices.ads.isEnable || self.isGridView) return false;

        const nodesCount = self.viewNodesAll.length;

        // show ad after first
        if (nodesCount === 1) return true;
        // show ad after second
        if (nodesCount >= 2 && nodeIndex === 1) return true;
        // show ad after each tenth
        if (nodesCount > 10 && nodeIndex === nodesCount - 1) return true;
    },
    rowHeightFunc({ index: rowIndex }) {
        if (self.isGridView) {
            if (self.isDirRow(rowIndex)) {
                const additionalHeight =
                    self.isLastDirRow(rowIndex) && !env.IS_MOBILE ? 8 : 0;
                return self.rowHeightDir + additionalHeight;
            } else {
                return self.rowHeightFile;
            }
        } else {
            return (
                self.rowHeight +
                (self.isAdShow(rowIndex) ? (env.IS_MOBILE ? 72 : 90) : 0)
            );
        }
    },
});

const actions = (self) => ({
    toggleView: ({ withSettingsSet = true }) => {
        const newViewState = self.isGridView ? listState : gridState;
        update(newViewState, self);
        // check to prevent loop
        if (withSettingsSet) {
            store.users.currentAuthUser.setCustomSettings({
                isGridView: self.isGridView,
            });
        }
    },

    setIsCanDrag(newValue) {
        self.isCanDrag = newValue;
    },

    setUserSetting({ isGridView }) {
        if (isGridView !== self.isGridView) {
            self.toggleView({ withSettingsSet: false });
        }
    },

    setDefaults() {
        if (self.isGridView) {
            self.toggleView({ withSettingsSet: false });
        }
    },
});

export default types
    .model('View', {})
    .volatile(volatile)
    .views(views)
    .actions(actions);
