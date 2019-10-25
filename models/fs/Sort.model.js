import { types } from 'mobx-state-tree';
import _ from 'lodash';
// Utils
import env from '_core/utils/env.utils';
import log from '_core/utils/log.utils';
// Store
import store from '_core/store';

const SortModel = {
    byCategory: types.optional(
        types.enumeration(['created_at', 'name', 'size']),
        'created_at'
    ),
    byDirection: types.optional(types.enumeration(['asc', 'desc']), 'desc'),
};

const views = (self) => {
    return {
        get activeDirection() {
            return self.listByDirection.find((order) => order.isActive);
        },

        get activeCategory() {
            return self.listByCategory.find((menuItem) => menuItem.isActive);
        },

        get menuItemsByCategory() {
            if (env.DEVICE === 'mobile') {
                return self.listByCategory;
            }

            return self.listByCategory.filter((menuItem) => !menuItem.isActive);
        },

        make(nodes, isDir = false) {
            const nextCategory =
                isDir && self.byCategory === 'size'
                    ? 'files_size'
                    : self.byCategory;

            return _.orderBy(
                nodes,
                (node) => {
                    if (nextCategory === 'name') {
                        if (Number(node.name)) {
                            return Number(node.name);
                        }

                        return node.name.toLowerCase();
                    }

                    return node[nextCategory];
                },
                [self.byDirection]
            );
        },
    };
};

const actions = (self) => ({
    changeCategory({ name, withSettingsSet = true }) {
        const logName = name.toUpperCase();
        log.l(`CHANGE-SORT-CATEGORY-TO-${logName}-SUCCESS`);
        self.byCategory = name;
        // check to prevent loop
        if (withSettingsSet) {
            store.users.currentAuthUser.setCustomSettings({ byCategory: name });
        }
    },

    changeDirection({ name, withSettingsSet = true }) {
        const logName = name.toUpperCase();
        log.l(`CHANGE-SORT-DIRECTION-TO-${logName}-SUCCESS`);
        self.byDirection = name;
        // check to prevent loop
        if (withSettingsSet) {
            store.users.currentAuthUser.setCustomSettings({
                byDirection: name,
            });
        }
    },

    setUserSetting({ byDirection, byCategory }) {
        if (byCategory && byCategory !== self.byCategory) {
            self.changeCategory({ name: byCategory, withSettingsSet: false });
        }
        if (byDirection && byDirection !== self.byDirection) {
            self.changeDirection({ name: byDirection, withSettingsSet: false });
        }
    },

    setDefaults() {
        const byCategoryDefault = 'created_at';
        const byDirectionDefault = 'desc';
        if (self.byCategory !== byCategoryDefault) {
            self.changeCategory({
                name: byCategoryDefault,
                withSettingsSet: false,
            });
        }
        if (self.byDirection !== byDirectionDefault) {
            self.changeDirection({
                name: byDirectionDefault,
                withSettingsSet: false,
            });
        }
    },
});

const volatile = (self) => {
    return {
        listByCategory: [
            {
                get isActive() {
                    return self.byCategory === 'created_at';
                },
                onClick: () => self.changeCategory({ name: 'created_at' }),
                key: 'creation-date',
                label: 'By creation date',
            },
            {
                get isActive() {
                    return self.byCategory === 'name';
                },
                onClick: () => self.changeCategory({ name: 'name' }),
                key: 'name',
                label: 'By name',
            },
            {
                get isActive() {
                    return self.byCategory === 'size';
                },
                onClick: () => self.changeCategory({ name: 'size' }),
                key: 'size',
                label: 'By size',
            },
        ],

        listByDirection: [
            {
                get isActive() {
                    return self.byDirection === 'asc';
                },
                onClick: () => self.changeDirection({ name: 'desc' }),
                key: 'asc',
                icon: 'sort-asc',
                label: 'Descending', // Display mirror name for mobile
            },
            {
                get isActive() {
                    return self.byDirection === 'desc';
                },
                onClick: () => self.changeDirection({ name: 'asc' }),
                key: 'desc',
                icon: 'sort-desc',
                label: 'Ascending', // Display mirror name for mobile
            },
        ],
    };
};

export default types
    .model('SortModel', SortModel)
    .volatile(volatile)
    .views(views)
    .actions(actions);
