// TODO: Refactor upload logic use [https://github.com/flowjs/flow.js]
// TODO: watch video [https://youtu.be/2r2yj2nGJi8]
// Mobx
import { types, flow } from 'mobx-state-tree';
import { observable, isObservable, runInAction, toJS } from 'mobx';
// Store
import store from '_core/store';
import _ from 'lodash';
// Utils
import API from '_core/utils/api.utils';
import log from '_core/utils/log.utils';
import units from '_core/utils/units.utils';
import {
    getFile,
    parseFullPath,
    setValue,
    setValues,
} from '_core/utils/fs.utils';

const UploadModel = types.model('UploadModel', {});

const getInitVolatile = () => ({
    wrappers: [],

    fulfilledWrapperIndexes: [],
    restWrapperIndexes: [],

    status: observable({
        pending: 0,
        fulfilled: 0,
        rejected: 0,
        canceled: 0,
        paused: 0,
        loading: 0,
    }),

    queue: [],
    lastDropWrapperIds: [],

    activeTab: 'pending', // ['pending', 'fulfilled']

    isCancelAll: false,
    isShowIndicator: false,
    isShowTooltip: !store.modals.videoPlayerModal.state.isOpen,

    anonWizardState: 'upload', // ['upload', 'pending', 'share']
});

const volatile = (self) => getInitVolatile();

const views = (self) => ({
    get filesLength() {
        return self.wrappers.length;
    },

    get itemsInProgressCount() {
        const { pending, loading, paused } = self.status;
        return pending + loading + paused;
    },

    get rootId() {
        return store.fs.tree.id;
    },

    get statusNames() {
        return self.deriveStatusObj(self.status);
    },
    get currentStatus() {
        return Object.keys(self.statusNames).find(
            (key) => self.statusNames[key]
        );
    },
    get notFulfilledWrappers() {
        return self.restWrapperIndexes.map(
            (restWrapperIndex) => self.wrappers[restWrapperIndex]
        );
    },
    deriveStatusObj({
        pending,
        loading,
        fulfilled,
        rejected,
        paused,
        canceled,
    }) {
        return {
            pending: !!pending,
            loading: !!loading,
            paused: !!paused,
            pendingRejected: !!pending && !!rejected,
            fulfilledRejected: !!fulfilled && !!rejected,
            rejected: !!rejected,
            canceled: !!canceled,
            fulfilled: !!fulfilled,
        };
    },
});

const actions = (self) => {
    return {
        resetVolatileState() {
            setValues(self, {
                wrappers: [],
                fulfilledWrapperIndexes: [],
                restWrapperIndexes: [],
                status: observable({
                    pending: 0,
                    fulfilled: 0,
                    rejected: 0,
                    canceled: 0,
                    paused: 0,
                    loading: 0,
                }),
                queue: [],
                lastDropWrapperIds: [],

                activeTab: 'pending',

                isCancelAll: false,
                isShowIndicator: false,
                isShowTooltip: !store.modals.videoPlayerModal.state.isOpen,

                anonWizardState: 'upload',
            });
        },
        uploadDroppedEntries: async (entries, emptyDirList, uploadRootId) => {
            if (
                self.hasExceedNestEntry(entries) ||
                self.hasExceedNestEmptyDir(emptyDirList)
            ) {
                return store.alerts.error({
                    id: 'subfoldersDepthExceeded',
                    msg: 2410,
                });
            }

            const dirIdsCache = observable({
                // dirPath: dirId;
            });

            const dirPromises = observable({
                // dirPath: createDirActionPromise;
            });

            await self.createEmptyDirs(emptyDirList, dirIdsCache, uploadRootId);

            if (!entries.length) return;

            const entryWrapperIds = self.createWrappers({
                uploadItemName: 'entry',
                uploadItems: entries,
                uploadRootId,
                dirIdsCache,
                dirPromises,
            });
            self.addRestWrapperIndexes(entryWrapperIds);

            self.addEntriesInQueue(entryWrapperIds);

            self.startQueueUpload(entryWrapperIds);

            self.status.pending += entries.length;
        },
        uploadSelectedFiles(files, uploadRootId) {
            if (self.hasExceedNestEntry(files)) {
                return store.alerts.error({
                    id: 'subfoldersDepthExceeded',
                    msg: 2410,
                });
            }

            if (!files.length) return;

            const dirIdsCache = observable({
                // dirPath: dirId;
            });
            const dirPromises = observable({
                // dirPath: createDirActionPromise;
            });

            const entryWrapperIds = self.createWrappers({
                uploadItemName: 'file',
                uploadItems: files,
                uploadRootId,
                dirIdsCache,
                dirPromises,
            });

            self.addRestWrapperIndexes(entryWrapperIds);

            self.addEntriesInQueue(entryWrapperIds, uploadRootId);

            self.startQueueUpload(entryWrapperIds);

            self.status.pending += files.length;
        },
        makeAbortable: (wrapper) => {
            wrapper.abortController = new AbortController();
        },
        makeObservable(entryWrapperId) {
            const wrapper = self.wrappers[entryWrapperId];
            if (!isObservable(wrapper)) {
                self.wrappers[entryWrapperId] = observable(wrapper);
            }
            return self.wrappers[entryWrapperId];
        },
        addEntriesInQueue: async (entryWrapperIds) => {
            entryWrapperIds.forEach((entryWrapperId) => {
                const uploadFlow = async () => {
                    const wrapper = self.makeObservable(entryWrapperId);
                    self.makeAbortable(wrapper);
                    try {
                        if (self.isCancelAll) return;
                        if (['canceled', 'paused'].includes(wrapper.status))
                            return;
                        self.onStartLoad(wrapper);
                        await self.readAndSetFile(wrapper);
                        await self.createDirTree(wrapper);
                        await self.uploadFile(wrapper);
                    } catch (e) {
                        console.log('---> ---> upload flow error: ', e);
                        self.onRejectLoad(wrapper);
                        throw e;
                    }
                };
                self.queue.push(uploadFlow);
            });
        },
        readAndSetFile: async (wrapper) => {
            if (wrapper.filePromise) {
                await wrapper.filePromise;
            }
            if (!_.isEmpty(wrapper.file)) return;
            wrapper.file = await getFile(wrapper.entry);
        },
        startReadAndSetFileForHeader: async (wrapper) => {
            if (!_.isEmpty(wrapper.file)) return;
            wrapper.filePromise = getFile(wrapper.entry);
            wrapper.file = await wrapper.filePromise;
        },
        createWrappers({
            uploadItemName,
            uploadItems,
            uploadRootId,
            dirIdsCache,
            dirPromises,
        }) {
            // console.time('create wrappers & add wrappers');
            const wrappersLength = self.wrappers.length;

            const newWrapperIds = uploadItems.map((uploadItem, index) => {
                const newWrapper = {
                    // [file:] or [entry:]
                    [uploadItemName]: uploadItem,
                    id: wrappersLength + index,
                    // [directoryId] will change if file is nested
                    directoryId: uploadRootId,
                    dirIdsCache,
                    dirPromises,
                    abortController: null,
                    status: 'pending',
                    progress: {
                        percent: 0,
                        time: 0,
                        startTime: 0,
                    },
                };

                self.wrappers.push(newWrapper);
                return newWrapper.id;
            });
            // console.timeEnd('create wrappers & add wrappers');

            return newWrapperIds;
        },
        uploadFile: flow(function*(wrapper) {
            const { storageValidationLink } = yield self.apiUploadValidation(
                wrapper
            );

            // resume or start
            const {
                storageUploadLink,
                chunkSize,
                offset,
            } = yield self.storageUploadValidation({
                wrapper,
                storageValidationLink,
            });

            self.setStorageUploadLink(wrapper, storageUploadLink);

            // upload file
            const uploadResp = yield self.startUpload({
                storageUploadLink,
                chunkSize,
                offset,
                wrapper,
            });

            self.addLoadedFileInTree(wrapper);

            store.users.currentAuthUser.updateUsedSpaceWithWrapper(wrapper);

            // object here is indecator that upload went ok
            return uploadResp;
        }),
        createEmptyDirs: async (emptyDirList, dirIdsCache, uploadRootId) => {
            if (!emptyDirList.length) return;
            for (let emptyDirFullPath of emptyDirList) {
                const pathMap = parseFullPath(emptyDirFullPath);
                for (let pathMapItem of pathMap) {
                    const { prevPath, dirName, curPath } = pathMapItem;
                    // cache check
                    if (dirIdsCache[curPath]) continue;

                    // request
                    const actionName = store.fs.shared.hasAnonToken
                        ? 'createDirAnon'
                        : 'createDir';
                    const resp = await store.fs.tree[actionName]({
                        name: dirName,
                        parentId: dirIdsCache[prevPath] || uploadRootId,
                    });

                    if (resp.error) {
                        return store.alerts.error({
                            id: actionName,
                            msg: resp.error,
                        });
                    }

                    const [createdDir] = resp.data;
                    dirIdsCache[curPath] = createdDir.id;
                }
            }
        },
        createDirTree: flow(function*(wrapper) {
            if (!wrapper.file.isNested) return;
            if (['paused', 'canceled'].includes(wrapper.status)) return;

            const { file, dirIdsCache, dirPromises } = wrapper;
            const { path } = file;
            log.l('CREATE-DIR-TREE', path);
            const pathMap = parseFullPath(path);

            if (dirIdsCache[path]) {
                log.l(`CREATE-DIR-TREE-SUCCESS`, `'${path}' from CACHE`);
                self.setDirectoryId(wrapper, dirIdsCache[path]);
            } else {
                while (pathMap.length) {
                    const { prevPath, dirName, curPath } = pathMap.shift();
                    if (dirIdsCache[curPath]) continue;

                    if (dirPromises[curPath]) {
                        // same folder case
                        yield dirPromises[curPath];
                    } else {
                        const actionName = store.is.AnonPage
                            ? 'createDirAnon'
                            : 'createDir';
                        const promise = store.fs.tree[actionName]({
                            name: dirName,
                            parentId:
                                dirIdsCache[prevPath] || wrapper.directoryId,
                        });

                        dirPromises[curPath] = promise;
                        const resp = yield promise;

                        if (resp.error) {
                            store.alerts.error({
                                id: actionName,
                                msg: resp.error,
                            });
                            delete dirPromises[curPath];
                            throw Error('CREATE-DIR-TREE-ERROR');
                        }

                        const [createdDir] = resp.data;
                        dirIdsCache[curPath] = createdDir.id;
                    }
                }
                log.l(`CREATE-DIR-TREE-SUCCESS`, path);
                self.setDirectoryId(wrapper, dirIdsCache[path]);
            }
        }),
        addLoadedFileInTree(wrapper) {
            const { directoryId, uploadedFileData } = wrapper;
            if (directoryId !== self.rootId) return;
            if (['pending', 'paused', 'canceled'].includes(wrapper.status))
                return;
            store.fs.createFile(toJS(uploadedFileData));
        },
        apiUploadValidation: flow(function*(wrapper) {
            log.l('API-UPLOAD-VALIDATION');
            const { directoryId, file, abortController } = wrapper;
            const { size, name } = file;

            const respApi = yield API.post({
                url: store.is.AnonPage ? 'anonymous/file' : 'file/upload',
                options: {
                    body: {
                        directory_id: directoryId === 0 ? null : directoryId,
                        size,
                        name,
                    },
                },
                signal: abortController.signal,
            });

            if (respApi.error) {
                log.l('API-UPLOAD-VALIDATION-ERROR', respApi);
                store.alerts.error({
                    id: 'uploadError',
                    msg: respApi.error,
                });

                const withoutRetry = [
                    'maximum file size for anonymous user exceeded',
                    'maximum file size for registered user exceeded',
                ].includes(respApi.error);
                throw Error(withoutRetry ? 'NO_RETRY' : respApi.error);
            }

            const {
                location: storageValidationLink,
                anon_upload_root_id: anonRootId,
                anon_upload_link: sharedLink,
            } = respApi;

            if (!storageValidationLink) {
                log.l('API-UPLOAD-STORAGE-ERROR', respApi);
                store.alerts.error({
                    id: 'uploadError',
                    msg: respApi.error,
                });
                throw Error('API-UPLOAD-STORAGE-ERROR');
            }

            // upload in empty AnonPage
            if (store.is.AnonPage) {
                store.fs.shared.setSharedLink(sharedLink);
            }
            log.l('API-UPLOAD-VALIDATION-SUCCESS');
            return { storageValidationLink };
        }),
        storageUploadValidation: flow(function*({
            wrapper,
            storageValidationLink,
        }) {
            log.l('STORAGE-UPLOAD-VALIDATION');
            const { file, abortController } = wrapper;
            const { size, name } = file;

            if (size > units.BYTES_IN_GB * 100) {
                log.l('STORAGE-UPLOAD-VALIDATION-ERROR', 'more than 100 Gb');
                throw Error('NO_RETRY: Reached 100 gb limit');
            }

            if (wrapper.storageUploadLink) {
                const headResponse = yield API.head({
                    endpoint: wrapper.storageUploadLink,
                    headersOpts: {
                        'Fsp-Version': '1.0.0',
                    },
                    signal: abortController.signal,
                });

                const chunkSize = +headResponse.headers.get('fsp-chunk-size');
                const offset = +headResponse.headers.get('fsp-offset');
                return {
                    storageUploadLink: wrapper.storageUploadLink,
                    chunkSize,
                    offset,
                };
            }

            const respStorage = yield API.post({
                endpoint: storageValidationLink,
                headersOpts: {
                    'Fsp-Size': size,
                    'Fsp-Version': '1.0.0',
                    'Fsp-FileName': encodeURI(name),
                },
                signal: abortController.signal,
            });
            if (respStorage.error) {
                log.l('STORAGE-UPLOAD-VALIDATION-ERROR', respStorage);
                throw Error('STORAGE-UPLOAD-VALIDATION-ERROR');
            }

            const storageUploadLink = respStorage.headers.get('Location');

            const chunkSize = +respStorage.headers.get('fsp-chunk-size');
            const offset = +respStorage.headers.get('fsp-offset');

            log.l('STORAGE-UPLOAD-VALIDATION-SUCCESS', storageUploadLink);
            return { storageUploadLink, chunkSize, offset };
        }),
        startUpload: flow(function*({
            storageUploadLink,
            chunkSize,
            offset,
            wrapper,
        } = {}) {
            log.l(
                'START-UPLOAD',
                wrapper.entry ? wrapper.entry.name : wrapper.file.name
            );
            let patchResp;
            const { file, abortController } = wrapper;
            const { fileObject, size, name } = file;
            const delay = API.getDelay();
            const isBreak = () =>
                ['paused', 'rejected', 'canceled'].includes(wrapper.status) ||
                self.isCancelAll;

            while (offset < size && !isBreak()) {
                // offline check
                if (API.isOffline) {
                    if (delay.isMoreAttempt) {
                        yield delay.pause;
                        continue;
                    } else {
                        log.l('UPLOAD-CHUNK-ERROR');
                        throw Error(
                            'UPLOAD-CHUNK-ERROR',
                            'no internet connection'
                        );
                    }
                }

                const cutEnd = offset + chunkSize;

                patchResp = yield API.patch({
                    endpoint: storageUploadLink,
                    options: {
                        body: fileObject.slice(offset, cutEnd),
                        withHeadersInResponse: true,
                    },
                    headersOpts: {
                        'Content-Type': 'application/offset+octet-stream',
                        'Fsp-Version': '1.0.0',
                        'Fsp-Offset': offset,
                        'Fsp-FileName': encodeURI(name),
                    },
                    signal: abortController.signal,
                });

                if (patchResp.error) {
                    log.l('UPLOAD-FILE-PATCH-ERROR');
                    // current error structure:
                    // { code: number, name: string, message: string }
                    // if you rethrow this error the structure will be
                    // { message: string }
                    throw Error(patchResp.error);
                }

                // setting new values from response for the next iteration
                offset = +patchResp.headers.get('fsp-offset');
                chunkSize = +patchResp.headers.get('fsp-chunk-size');

                self.onProgressLoad(wrapper, offset, chunkSize);

                // Last chank
                if (offset === size) {
                    // Didn't recive file from server
                    if (_.isEmpty(patchResp)) {
                        log.l('UPLOAD-FILE-LAST-PATCH-ERROR');
                        throw Error(
                            "Didn't get file from server in the end of upload"
                        );
                    } else {
                        self.onSuccessLoad(wrapper, patchResp);
                        log.l('START-UPLOAD-SUCCESS');
                    }
                }
            }
            return patchResp;
        }),
        setStorageUploadLink(wrapper, storageUploadLink) {
            log.l('SET-UPLOAD-STORAGE-LINK-SUCCESS');
            wrapper.storageUploadLink = storageUploadLink;
        },
        onSuccessLoad(wrapper, patchResp) {
            if (self.isCancelAll) return; // ??
            log.l('END-UPLOAD-SUCCESS');
            self.updateRestWrappersIndexes(wrapper);
            self.status[wrapper.status] -= 1;
            self.status.fulfilled += 1;

            wrapper.progress.percent = 100;
            wrapper.status = 'fulfilled';
            wrapper.uploadedFileData = patchResp;
            wrapper.fileObject = null;

            self.fulfilledWrapperIndexes.push(wrapper.id);
        },
        onCancelLoad(wrapper) {
            if (self.isCancelAll) return;
            log.l('UPLOAD-FILE-CANCEL');
            if (wrapper.abortController) wrapper.abortController.abort();
            self.status[wrapper.status] -= 1;
            self.status.canceled += 1;
            wrapper.status = 'canceled';
        },
        onRejectLoad(wrapper) {
            if (self.isCancelAll) return;
            log.l('UPLOAD-FILE-REJECT');
            if (wrapper.abortController) wrapper.abortController.abort();
            self.status[wrapper.status] -= 1;
            self.status.rejected += 1;
            wrapper.status = 'rejected';
        },
        onProgressLoad(wrapper, offset, chunkSize) {
            const { size } = wrapper.file;
            // percent
            wrapper.progress.percent = +((offset / size) * 100).toFixed(0);

            // time
            const endTime = Date.now();
            const chankLoadTime = (endTime - wrapper.progress.startTime) / 1000;
            const chunksLeft = (size - offset) / chunkSize;
            wrapper.progress.time = chunksLeft * chankLoadTime;
            // next chank time measurments
            wrapper.progress.startTime = Date.now();
        },
        onStartLoad(wrapper) {
            if (self.isCancelAll) return;
            log.l('START-UPLOAD-SUCCESS');
            self.status[wrapper.status] -= 1;
            self.status.loading += 1;
            wrapper.status = 'loading';
            wrapper.progress.startTime = Date.now();
        },
        onPauseLoad(wrappers) {
            for (let wrapper of wrappers) {
                if (wrapper.abortController) wrapper.abortController.abort();
                self.status[wrapper.status] -= 1;
                self.status.paused += 1;
                wrapper.status = 'paused';
            }
            log.l('PAUSE-UPLOAD-SUCCESS');
        },
        onResumeLoad(wrappers) {
            for (let wrapper of wrappers) {
                self.status[wrapper.status] -= 1;
                self.status.pending += 1;
                wrapper.status = 'pending';
            }
            log.l('RESUME-UPLOAD-SUCCESS');
            const resumeWrapperIds = wrappers.map((wrapper) => wrapper.id);
            self.addEntriesInQueue(resumeWrapperIds);
            self.startQueueUpload(resumeWrapperIds);
        },
        retryAll: () => {
            log.l('UPLOAD-RETRY-ALL');

            const rejectedWrappers = self.restWrapperIndexes.reduce(
                (acc, wrapperId) => {
                    const currentWrapper = self.wrappers[wrapperId];
                    if (
                        currentWrapper !== null &&
                        ['rejected', 'canceled'].includes(currentWrapper.status)
                    ) {
                        acc.push(currentWrapper);
                    }

                    return acc;
                },
                []
            );

            self.onResumeLoad(rejectedWrappers);
        },
        cancelAll: async () => {
            const {
                pending,
                loading,
                paused,
                rejected,
                canceled,
            } = self.status;
            if (pending + loading + paused + canceled === 0) return;
            log.l('UPLOAD-CANCEL-ALL');

            self.isCancelAll = true;
            self.queue.length = 0;

            setValues(self.status, {
                canceled: canceled + pending + loading + paused + rejected,
                loading: 0,
                pending: 0,
                paused: 0,
                rejected: 0,
            });

            self.restWrapperIndexes.forEach((wrapperId) => {
                const wrapper = self.wrappers[wrapperId];
                if (wrapper === null) return;
                if (wrapper.abortController) wrapper.abortController.abort();
                setValue(wrapper, 'status', 'canceled');
            });

            self.isCancelAll = false;
        },

        addRestWrapperIndexes(newWrapperIds) {
            if (self.restWrapperIndexes.length === 0) {
                return (self.restWrapperIndexes = newWrapperIds);
            }
            Array.prototype.push.apply(self.restWrapperIndexes, newWrapperIds);
        },
        updateRestWrappersIndexes(wrapper) {
            const updatingWrapperIndex = self.restWrapperIndexes.indexOf(
                wrapper.id
            );
            self.restWrapperIndexes.splice(updatingWrapperIndex, 1);
        },
        withRetry: async ({ fetchFunc, retriesCount }) => {
            const delay = API.getDelay({ delayValues: [5000, 15000, 30000] });
            for (let i = 0; i <= retriesCount; i++) {
                console.log(
                    `---> ---> Upload ${i}, time ${new Date().getSeconds()} sec`
                );
                try {
                    return await fetchFunc();
                } catch (err) {
                    if (err.message.includes('NO_RETRY')) throw err;
                    await delay.pause;
                    const isLastAttempt = i + 1 > retriesCount;
                    if (isLastAttempt) throw err;
                }
            }
        },
        startQueueUpload(transactionUploadWrapperIds, threadsCount = 2) {
            const transactionUploadWrapperIdsCloned = transactionUploadWrapperIds.slice();

            const requestsCount = self.queue.length;
            if (requestsCount < threadsCount) threadsCount = requestsCount;

            const startRequest = async (transactionUploadWrapperIds) => {
                if (store.fs.upload.isCancelAll) return;

                await store.modals.videoAdsModal.open();

                const uploadRequestFromQueue = self.queue.shift();
                try {
                    await self.withRetry({
                        fetchFunc: uploadRequestFromQueue,
                        retriesCount: 3,
                    });
                } catch (err) {
                    if (!err.message.includes('NO_RETRY')) {
                        console.log(
                            `---> ---> Upload 3 failed, time ${new Date().getSeconds()} sec, No more retries`
                        );
                        // const wrapper = self.wrappers[uploadRequestFromQueue.entryWrapperId];
                        // self.onRejectLoad(wrapper);
                    }
                }

                if (self.queue.length) {
                    // take next request from queue and start it
                    startRequest(transactionUploadWrapperIds);
                } else if (store.fs.upload.status.loading === 0) {
                    self.showFinishUploadAlertDebounced(
                        transactionUploadWrapperIds
                    );
                }
            };

            for (let i = 0; i < threadsCount; i++) {
                if (self.status.loading < threadsCount) {
                    startRequest(transactionUploadWrapperIdsCloned);
                }
            }
        },
        setDirectoryId(wrapper, directoryId) {
            wrapper.directoryId = directoryId;
        },
        pauseAll() {
            self.onPauseLoad(self.notFulfilledWrappers);
        },
        resumeAll() {
            self.onResumeLoad(self.notFulfilledWrappers);
        },
        showFinishUploadAlertDebounced: (transactionUploadWrapperIds) => {
            if (!self.wrappers.length) return;
            const transactionUploadWrappers = transactionUploadWrapperIds.map(
                (wrapperId) => self.wrappers[wrapperId]
            );

            const processedWrappersStatusObj = transactionUploadWrappers.reduce(
                (acc, processedWrapper) => {
                    acc[processedWrapper.status] += 1;
                    return acc;
                },
                {
                    pending: 0,
                    fulfilled: 0,
                    rejected: 0,
                    paused: 0,
                    loading: 0,
                    canceled: 0,
                }
            );

            const derivedStatusObj = self.deriveStatusObj(
                processedWrappersStatusObj
            );
            const currentStatus = Object.keys(derivedStatusObj).find(
                (key) => derivedStatusObj[key]
            );
            store.alerts.uploadEnd(currentStatus);
        },
        setIsShowIndicator(value) {
            self.isShowIndicator = value;
        },
        setIsShowTooltip(value) {
            self.isShowTooltip = value;
        },
        setActiveTab(activeTab) {
            self.activeTab = activeTab;
        },
        setAnonWizardState: flow(function*(state) {
            switch (state) {
                case 'loading':
                case 'pending':
                case 'paused':
                case 'pendingRejected':
                    self.anonWizardState = 'pending';
                    break;
                case 'fulfilledRejected':
                case 'fulfilled':
                    yield new Promise((resolve) => setTimeout(resolve, 5000));
                    self.anonWizardState = 'share';
                    break;
                default:
                    self.anonWizardState = 'upload';
            }
        }),
        hasExceedNestEntry(entries) {
            const currentDirNestLevel =
                store.breadcrumbs.nodes.get().length - 1;

            return entries.some(({ fullPath }) => {
                const entryDirNestLevel = fullPath.match(/\//g).length - 1;
                return currentDirNestLevel + entryDirNestLevel > 31;
            });
        },
        hasExceedNestEmptyDir(emptyDirs) {
            const currentDirNestLevel =
                store.breadcrumbs.nodes.get().length - 1;

            return emptyDirs.some((emptyDirPath) => {
                // not [fullPath] !!! (no extra slash)
                const emptyDirNestLevel = emptyDirPath.match(/\//g).length - 1;
                return currentDirNestLevel + emptyDirNestLevel > 30;
            });
        },
        clearStatus() {
            Object.keys(self.status).forEach(
                (statusName) => (self.status[statusName] = 0)
            );
        },
        clear() {
            console.group('clearUploadModel');
            const initVolatile = getInitVolatile();

            Object.keys(self).forEach((propName) => {
                self[propName] = initVolatile[propName];
            });
            console.groupEnd('clearUploadModel');
        },
    };
};

export default UploadModel.volatile(volatile)
    .views(views)
    .actions(actions);
