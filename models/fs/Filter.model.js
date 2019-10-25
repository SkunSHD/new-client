import { types, getParent } from 'mobx-state-tree';
import log from '_core/utils/log.utils';
// Utils
import {
    getFileType,
    isFileForImagesGallery,
    isFileForAudioPlayer,
    isFileForVideoPlayer,
} from '_core/utils/fs.utils';
import array from '_core/utils/array.utils';

const FilterModel = {
    byCategory: types.optional(
        types.enumeration([
            'all',
            'search',
            'document',
            'image',
            'video',
            'audio',
            'favorite',
        ]),
        'all'
    ),
};

const views = (self) => {
    const FsModel = getParent(self);
    const { make: sort } = FsModel.sort;

    return {
        get isSearch() {
            return self.byCategory === 'search';
        },

        get isFavorite() {
            return self.byCategory === 'favorite';
        },

        get isStorageEmpty() {
            return !self.treeNodes.length;
        },

        get isSearchEmpty() {
            return self.isSearch && FsModel.fuzzySearch.isEmpty;
        },

        get isFavoriteEmpty() {
            return !self.favNodes.length;
        },

        get allTypesInCurrentDir() {
            const allTypes = FsModel.tree.files.map((file) =>
                getFileType(file.mimetype)
            );
            return array.uniqueItems(allTypes);
        },

        get activeTypeByCategory() {
            const activeTab = self.tabs.find((tab) => tab.isActive);

            return activeTab.type;
        },

        get filesByCategory() {
            return FsModel.tree.files.filter((file) => {
                return self.activeTypeByCategory.some((type) => {
                    return type.includes(getFileType(file.mimetype));
                });
            });
        },

        get files() {
            if (['all', 'search', 'favorite'].includes(self.byCategory)) {
                return sort(FsModel.tree.files);
            }

            return sort(self.filesByCategory);
        },

        get dirs() {
            return ['all', 'search', 'favorite'].includes(self.byCategory)
                ? sort(FsModel.tree.dirs, true)
                : [];
        },

        get treeNodes() {
            return self.dirs.concat(self.files);
        },

        get favFiles() {
            return sort(FsModel.favs.files);
        },

        get favDirs() {
            return sort(FsModel.favs.dirs, true);
        },

        get favNodes() {
            return self.favDirs.concat(self.favFiles);
        },

        get nodes() {
            switch (self.byCategory) {
                case 'search':
                    return FsModel.fuzzySearch.nodes;
                case 'favorite':
                    return self.favNodes;
                default:
                    return self.treeNodes;
            }
        },

        get images() {
            return self.files.filter((file) => {
                return isFileForImagesGallery(file.mimetype);
            });
        },

        get audios() {
            return self.files.filter((file) => {
                return isFileForAudioPlayer(file.mimetype);
            });
        },

        get galleryItems() {
            switch (self.byCategory) {
                case 'search':
                    return self.filterGalleryItems(FsModel.fuzzySearch.nodes);
                case 'favorite':
                    return self.filterGalleryItems(self.favNodes);
                default:
                    return self.filterGalleryItems(self.treeNodes);
            }
        },

        get hasVisibleTabByType() {
            return self.tabs.some(
                (tab) => tab.category !== 'all' && tab.isVisible
            );
        },

        get renderTabs() {
            if (!self.hasVisibleTabByType) return [];

            return self.tabs.filter((tab) => tab.isVisible);
        },

        isVisibleTab(itemType) {
            return self.allTypesInCurrentDir.some((dirType) => {
                return itemType.includes(dirType);
            });
        },

        filterGalleryItems(nodes) {
            return nodes.filter((file) => {
                return (
                    isFileForImagesGallery(file.mimetype) ||
                    isFileForVideoPlayer(file.mimetype)
                );
            });
        },
    };
};

const actions = (self) => ({
    changeCategory(name) {
        if (self.byCategory === name) return;

        const logName = name.toUpperCase();
        log.l(`CHANGE-FILTER-CATEGORY-TO-${logName}-SUCCESS`);
        self.byCategory = name;
    },
});

const volatile = (self) => {
    return {
        tabs: [
            {
                get isVisible() {
                    return true;
                },
                get isActive() {
                    return self.byCategory === 'all';
                },
                onClick: () => self.changeCategory('all'),
                category: 'all',
                type: null,
                icon: 'all-files-default',
                label: 'All files',
            },
            {
                get isVisible() {
                    return self.isVisibleTab(this.type);
                },
                get isActive() {
                    return self.byCategory === 'document';
                },
                onClick: () => self.changeCategory('document'),
                category: 'document',
                type: ['pdf', 'plain-file', 'word', 'excel', 'txt'],
                icon: 'docs',
                label: 'Documents',
            },
            {
                get isVisible() {
                    return self.isVisibleTab(this.type);
                },
                get isActive() {
                    return self.byCategory === 'image';
                },
                onClick: () => self.changeCategory('image'),
                category: 'image',
                type: ['image'],
                icon: 'picture',
                label: 'Images',
            },
            {
                get isVisible() {
                    return self.isVisibleTab(this.type);
                },
                get isActive() {
                    return self.byCategory === 'video';
                },
                onClick: () => self.changeCategory('video'),
                category: 'video',
                type: ['video'],
                icon: 'video-type',
                label: 'Video',
            },
            {
                get isVisible() {
                    return self.isVisibleTab(this.type);
                },
                get isActive() {
                    return self.byCategory === 'audio';
                },
                onClick: () => self.changeCategory('audio'),
                category: 'audio',
                type: ['audio'],
                icon: 'music',
                label: 'Audio',
            },
            {
                get isVisible() {
                    return !self.isFavoriteEmpty;
                },
                get isActive() {
                    return self.byCategory === 'favorite';
                },
                onClick: () => self.changeCategory('favorite'),
                category: 'favorite',
                type: null,
                icon: 'favorite',
                label: 'Favorite',
            },
        ],
    };
};

export default types
    .model('FilterModel', FilterModel)
    .volatile(volatile)
    .views(views)
    .actions(actions);
