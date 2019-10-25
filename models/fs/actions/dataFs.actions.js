import { clone, detach } from 'mobx-state-tree';
// Store
import store from '_core/store';

export default (self) => {
    return {
        setCurrentTree(tree) {
            // if (!tree) return;
            self.tree.children.forEach((child) => detach(child));
            self.tree = tree;
        },

        setFavs(favs) {
            if (!favs) return;
            self.favs.children.forEach((child) => detach(child));
            self.favs.children = favs;
        },

        createFile(file) {
            self.tree.children.push(file);
        },

        toggleFav(nodeId, isFav) {
            const treeNode = self.getNodeById(nodeId);
            treeNode.is_favorite = isFav;

            if (isFav) {
                self.favs.children.push(clone(treeNode));
            } else {
                const favNode = self.favs.children.find(
                    ({ id }) => id === nodeId
                );

                store.modals.close(); // Need for [NodeControlsModal] into mobile
                detach(favNode);
            }
        },

        clear() {
            self.tree.children.forEach((child) => detach(child));
            self.favs.children.forEach((child) => detach(child));
            self.tree = {};
            self.favs = {};
        },
    };
};
