import { observable } from 'mobx';
import { types } from 'mobx-state-tree';

const Breadcrumbs = types.model({});

const volatile = (self) => {
    return {
        nodes: observable.box([]),
    };
};

const views = (self) => {
    return {
        get currFullPath() {
            const nodes = self.nodes.get();
            return nodes
                .slice(1)
                .reduce((acc, node) => acc + '/' + node.name, '');
        },
        getBreadcrumbById(breadcrumbById) {
            return self.nodes.get().find((node) => node.id === breadcrumbById);
        },
    };
};

// model mutations goes only in actions
const actions = (self) => {
    return {
        initBreadcrumbs() {
            self.nodes.set([
                {
                    id: null,
                    parent_id: null,
                    name: 'Anonymous folder',
                },
            ]);
        },
        setBreadcrumbs(newBreadcrumbs) {
            self.nodes.set(newBreadcrumbs);
        },
        clear() {
            self.nodes.set([]);
        },
        renameBreadcrumbById(breadcrumbId, newBreadcrumbName) {
            const breadcrumb = self.getBreadcrumbById(breadcrumbId);
            if (breadcrumb && breadcrumb.name !== newBreadcrumbName) {
                breadcrumb.name = newBreadcrumbName;
            }
        },
        renameRootCrumb(newName) {
            const [rootCrumb] = self.nodes.get();
            rootCrumb.name = newName;
        },
    };
};

export default Breadcrumbs.volatile(volatile)
    .views(views)
    .actions(actions);
