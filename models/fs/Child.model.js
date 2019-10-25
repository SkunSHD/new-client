import { types, flow, onPatch } from 'mobx-state-tree';
// Utils
import env from '_core/utils/env.utils';
import log from '_core/utils/log.utils';
import API from '_core/utils/api.utils';
import routerUrls from '_core/utils/routerUrls.utils';
// Store
import store from '_core/store';
// Models
import SharedLinkChild from '_core/models/fs/SharedLinkChild.model';

const ChildModel = types
    .model('ChildModel', {
        // dir and file props:
        id: types.optional(types.identifierNumber, 0),
        parent_id: types.maybeNull(types.number),
        is_dir: types.maybe(types.boolean),
        is_public: types.maybe(types.boolean),
        is_favorite: types.maybeNull(types.boolean),
        name: types.maybe(types.string),
        shared_links: types.array(types.maybe(SharedLinkChild)),
        updated_at: types.maybe(types.number),
        created_at: types.maybe(types.number),

        // dir specific props:
        has_children: types.maybe(types.boolean),
        children: types.optional(types.array(types.late(() => ChildModel)), []),
        // files_count: types.maybeNull(types.number), - don't have
        // files_size: types.number, - don't have

        // file specific props:
        size: types.maybe(types.number),
        mimetype: types.maybe(types.string),
        download_url: types.maybeNull(types.string),
        play_url: types.maybeNull(types.string),
        preview_url: types.maybeNull(types.string),
        // "crc32": types.string, - don't using
    })
    .views((self) => ({
        get isEmpty() {
            return !self.files.length && !self.dirs.length;
        },
        get files() {
            return self.children.filter((child) => !child.is_dir);
        },
        get dirs() {
            return self.children.filter((child) => child.is_dir);
        },
        get hasSharedLink() {
            return !!self.shared_links.length;
        },
        get sharedLink() {
            const [firstSharedEntry = {}] = self.shared_links;
            return firstSharedEntry.link;
        },
        get sharedLinkFull() {
            return `${env.FEX_URL}${routerUrls.goTo.SharedPage}/${
                self.sharedLink
            }`;
        },
        get childrenIds() {
            return self.children.map((child) => child.id);
        },
        sizePreview(previewUrl, width, height) {
            return `${previewUrl}/${width ? width : 0}x${height ? height : 0}`;
        },
    }))
    .actions((self) => {
        return {
            fetchCreateDir({ name, parentId } = {}) {
                return API.post({
                    url: `file/create-dirs/${parentId}`,
                    options: {
                        body: {
                            names: [name],
                        },
                    },
                });
            },
            // TODO: StRef. Using only when uploading in [createDirTree]
            // delete [createDir] when gonna be written create-dirs-tree-using-fullPath
            createDir: flow(function*({ name, parentId } = {}) {
                const resp = yield self.fetchCreateDir({ name, parentId });
                if (resp.error) {
                    log.l('CREATE-DIR-ERROR', resp);
                    return resp;
                }
                log.l('CREATE-DIR-SUCCESS', resp);
                const [createdDir] = resp.data;
                if (createdDir && createdDir.parent_id === self.id) {
                    self.children.push(...resp.data);
                }

                return resp;
            }),
            // TODO: StRef. Using only when uploading in [createDirTree]
            fetchCreateDirAnon: flow(function*({ name, parentId } = {}) {
                return yield API.post({
                    url: `anonymous/directory/${parentId}`,
                    options: {
                        body: {
                            names: [name],
                        },
                    },
                });
            }),
            // TODO: StRef. Using only when uploading in [createDirTree]
            createDirAnon: flow(function*({ name, parentId = self.id } = {}) {
                const resp = yield self.fetchCreateDirAnon({ name, parentId });

                if (resp.error) {
                    log.l('CREATE-DIR-ANON-ERROR', resp);
                    return resp;
                }
                log.l('CREATE-DIR-ANON-SUCCESS', 'parentId:', parentId);

                if (!store.fs.shared.link) {
                    store.fs.shared.setSharedLink(resp.anon_upload_link);
                }

                if (resp.data && store.fs.tree.id === parentId) {
                    self.children.push(...resp.data);
                }

                return resp;
            }),
            downloadZip: flow(function*({ fileIds = self.childrenIds } = {}) {
                let zipName = store.is.SharedPage
                    ? store.fs.shared.title
                    : 'FEX.NET-download';
                // [special case for one folder]
                if (fileIds.length === 1) {
                    zipName = self.children.find(
                        (child) => child.id === fileIds[0]
                    ).name;
                }

                store.alerts.downloadAllFilesStart();

                const resp = yield API.post({
                    url: 'file/zip',
                    params: {
                        filename: zipName,
                    },
                    options: {
                        body: {
                            files_ids: fileIds,
                        },
                    },
                });

                store.alerts.remove('downloadAllFiles');

                if (resp.error) {
                    store.alerts.error({
                        id: 'downloadAllFiles',
                        msg: 2403,
                    });

                    return resp;
                }
                window.location.assign(resp.location);
                return resp;
            }),
            createSharedLink: flow(function*() {
                log.l('CREATE-SHARED-LINK');

                const resp = yield store.fs.fetchSharedLink({
                    method: 'post',
                    data: {
                        files_ids: [self.id],
                        title: self.name,
                    },
                });

                if (resp.error) {
                    log.l('CREATE-SHARED-LINK-ERROR', resp);
                } else {
                    log.l('CREATE-SHARED-LINK-SUCCESS', resp);
                    self.shared_links.push(resp);
                }

                return resp;
            }),
            updateSharedLink: flow(function*({ link, title }) {
                log.l('UPDATE-SHARED-LINK');

                const resp = yield store.fs.fetchSharedLink({
                    method: 'put',
                    link,
                    data: {
                        title,
                    },
                });

                if (resp.error) {
                    log.l('UPDATE-SHARED-LINK-ERROR', resp);
                } else {
                    log.l('UPDATE-SHARED-LINK-SUCCESS', resp);
                    // self.shared.updateSharedModel(resp);
                }
                return resp;
            }),
            deleteSharedLink: flow(function*() {
                log.l('DELETE-SHARED-LINK');
                const [currentLink] = self.shared_links;

                const resp = yield store.fs.fetchSharedLink({
                    method: 'delete',
                    link: currentLink.link,
                    data: {
                        files_ids: [self.id],
                        title: self.name,
                    },
                });

                if (resp.error) {
                    log.l('DELETE-SHARED-LINK-ERROR', resp);
                } else {
                    log.l('DELETE-SHARED-LINK-SUCCESS', resp);
                    self.shared_links = [];
                }

                return resp;
            }),
            // TODO: Move in separate file?
            afterCreate() {
                onPatch(self, (patch) => {
                    switch (patch.path) {
                        case '/name':
                            store.breadcrumbs.renameBreadcrumbById(
                                self.id,
                                patch.value
                            );
                            break;
                    }
                });
            },
        };
    });

export default ChildModel;
