import { types, getParent } from 'mobx-state-tree';
import Fuse from 'fuse.js';
// Utils
import log from '_core/utils/log.utils';

const FuzzySearchModel = {
    queryText: types.optional(types.string, ''),
};

const views = (self) => {
    const FsModel = getParent(self);
    return {
        get nodes() {
            if (self.queryText.trim() === '') return FsModel.filter.treeNodes;

            const fuse = new Fuse(FsModel.filter.treeNodes, self.config);
            return fuse.search(self.queryText);
        },
        get isEmpty() {
            return !self.nodes.length;
        },
    };
};

const actions = (self) => ({
    setQueryText(text) {
        log.l('SET-QUERY-TEXT', text);
        self.queryText = text;
    },
});

const volatile = (self) => {
    return {
        config: {
            shouldSort: true,
            threshold: 0.5,
            location: 0,
            distance: 100,
            minMatchCharLength: 1,
            maxPatternLength: 32,
            keys: ['name'],
        },
    };
};

export default types
    .model('FuzzySearchModel', FuzzySearchModel)
    .volatile(volatile)
    .views(views)
    .actions(actions);
