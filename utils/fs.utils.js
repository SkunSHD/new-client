// orig source: https://github.com/quarklemotion/html5-file-selector
import _ from 'lodash';
import { isObservable, observable } from 'mobx';

const DEFAULT_FILES_TO_IGNORE = [
    '.DS_Store', // OSX indexing file
    'Thumbs.db', // Windows indexing file
];

// map of common (mostly media types) mime types to use when the browser does not supply the mime type
const EXTENSION_TO_MIME_TYPE_MAP = {
    ogg: 'application/ogg',
    dmg: 'application/x-apple-diskimage',
    'octet-stream': 'octet-stream',
    json: 'json',
    'x-php': 'x-php',
    html: 'html',
    'epub+zip': 'epub+zip',
    'x-photoshop': 'x-photoshop',
    // ARCHIVE TYPE
    zip: 'application/zip',
    'x-7z-compressed': 'x-7z-compressed',
    gzip: 'gzip',
    // PDF TYPE
    pdf: 'application/pdf',
    // EXEL TYPE
    'vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    // WORD TYPE
    'vnd.openxmlformats-officedocument.wordprocessingml.document':
        'vnd.openxmlformats-officedocument.wordprocessingml.document',
    // PRESENTATION TYPE
    'vnd.openxmlformats-officedocument.presentationml.presentation':
        'vnd.openxmlformats-officedocument.presentationml.presentation',
    // TXT TYPE
    plain: 'plain',
    rtf: 'plain',
};

const FORMATED_EXTENSIONS_FROM_MIME_TYPE = {
    dmg: 'dmg',
    ogg: 'audio',
    'octet-stream': 'plain-file',
    json: 'plain-file',
    'x-php': 'plain-file',
    html: 'plain-file',
    'epub+zip': 'plain-file',
    'x-photoshop': 'image',
    // ARCHIVE TYPE -> SVG Name
    zip: 'archive',
    'x-7z-compressed': 'archive',
    gzip: 'archive',
    // PDF TYPE -> SVG Name
    pdf: 'pdf',
    // EXEL TYPE -> SVG Name
    'vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'excel',
    // WORD TYPE -> SVG Name
    'vnd.openxmlformats-officedocument.wordprocessingml.document': 'word',
    // PRESENTATION TYPE -> SVG Name
    'vnd.openxmlformats-officedocument.presentationml.presentation':
        'presentation',
    // TEXT TYPE -> SVG Name
    plain: 'txt',
    rtf: 'txt',
};

// mimetype by viewer
const IMAGE_MIME_TYPE = {
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    tiff: 'image/tiff',
    psd: 'application/x-photoshop',
};

const VIDEO_MIME_TYPE = {
    mp4: 'video/mp4',
    mkv: 'video/x-matroska',
    webm: 'video/webm',
    mpeg: 'video/mpeg',
    mov: 'video/quicktime',
    '3gp': 'video/3gp',
    avi: 'video/x-msvideo',
    flv: 'video/x-flv',
};

const AUDIO_MIME_TYPE = {
    mp3: 'audio/mpeg',
    flac: 'audio/flac',
    midi: 'audio/midi',
    ape: 'audio/ape',
    mpc: 'audio/musepack',
    wav: 'audio/wav',
    aiff: 'audio/aiff',
    au: 'audio/basic',
};

const PDF_MIME_TYPE = {
    pdf: 'application/pdf',
};

function shouldIgnoreFile(file) {
    return DEFAULT_FILES_TO_IGNORE.indexOf(file.name) >= 0;
}

export function getPath(path) {
    if (path && path.match(/\//g).length > 1) {
        return path.substring(0, path.lastIndexOf('/'));
    } else {
        return '/';
    }
}

function traverseDirectory(entry, emptyDirList) {
    const reader = entry.createReader();

    return new Promise((resolveDirectory) => {
        const currentDirNodes = [];
        const errorHandler = () => {};

        function readEntries() {
            reader.readEntries((batchEntries) => {
                const filteredBatchEntries = batchEntries.filter(
                    (entry) => !shouldIgnoreFile(entry)
                );

                if (!filteredBatchEntries.length) {
                    // currentDir reading end
                    if (!currentDirNodes.length) {
                        emptyDirList.push(entry.fullPath);
                    }
                    resolveDirectory(Promise.all(currentDirNodes));
                } else {
                    // read currentDir
                    currentDirNodes.push(
                        Promise.all(
                            filteredBatchEntries.reduce(
                                (acc, filteredBatchEntry) => {
                                    if (filteredBatchEntry.isDirectory) {
                                        acc.push(
                                            traverseDirectory(
                                                filteredBatchEntry,
                                                emptyDirList
                                            )
                                        );
                                    } else {
                                        acc.push(
                                            Promise.resolve(filteredBatchEntry)
                                        );
                                    }

                                    return acc;
                                },
                                []
                            )
                        )
                    );
                    // Calling readEntries() again for the same dir, according to spec
                    readEntries();
                }
            }, errorHandler);
        }
        // currentDir reading start
        readEntries();
    });
}

// package the file in an object that includes the fullPath from the file entry
// that would otherwise be lost
function packageFile(file, entry) {
    const fullPath = entry
        ? entry.fullPath
        : `/${file.webkitRelativePath ? file.webkitRelativePath : file.name}`;

    return {
        fileObject: file, // raw File content
        fullPath,
        path: getPath(fullPath),
        isNested: fullPath.match(/\//g).length > 1,
        lastModified: file.lastModified,
        lastModifiedDate: file.lastModifiedDate,
        name: file.name,
        size: file.size,
        type: file.type,
    };
}

export function getDataTransferEntries(dataTransfer) {
    const promises = [];
    const emptyDirList = [];

    [].slice.call(dataTransfer.items).forEach((listItem) => {
        if (typeof listItem.webkitGetAsEntry === 'function') {
            const entry = listItem.webkitGetAsEntry();
            if (entry) {
                if (entry.isDirectory) {
                    promises.push(traverseDirectory(entry, emptyDirList));
                } else {
                    promises.push(entry);
                }
            }
        } else {
            // TODO: Find out this case
            alert('Tell me (Dan) how to reproduce this case, pls!');
            promises.push(listItem);
        }
    });

    promises.push(Promise.resolve({ emptyDirList }));

    return Promise.all(promises);
}

/**
 * This function should be called from the onDrop event from your drag/drop dropzone.
 *
 * Returns: an promise of Directory/File entries, that includes all dropped items.
 */
export function getDroppedEntries(event) {
    const dataTransfer = event.dataTransfer;
    if (dataTransfer && dataTransfer.items) {
        return getDataTransferEntries(dataTransfer);
    }
    alert(
        'No items in [getDroppedEntries]! Tell me (Dan) how to reproduce this case, pls!'
    );
}

/**
 * This function should be called from the HTML5 file selector input field onChange event handler.
 *
 * Returns: an array of Directory/File entries, that includes all dropped items.
 */
export function getSelectedFiles(event) {
    // debugger
    const dataTransfer = event.dataTransfer;
    const files = [];
    const dragDropFileList = dataTransfer && dataTransfer.files;
    if (dragDropFileList)
        alert('Tell me (Dan) how to reproduce this case, pls!');
    const inputFieldFileList = event.target && event.target.files;
    const fileList = dragDropFileList || inputFieldFileList || [];
    // convert the FileList to a simple array of File objects
    for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (shouldIgnoreFile(file)) continue;
        files.push(packageFile(file));
    }
    return files;
}

/* Functions below are not related with main-upload-flow */

export function getFile(entry) {
    return new Promise((resolve) => {
        entry.file((file) => {
            resolve(packageFile(file, entry));
        });
    });
}

export function getFileType(mimetype = '') {
    const fileExt = mimetype.split('/').pop();
    if (EXTENSION_TO_MIME_TYPE_MAP[fileExt]) {
        return FORMATED_EXTENSIONS_FROM_MIME_TYPE[fileExt];
    }

    return mimetype.split('/').shift();
}

export function getFileExtension(filename) {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

export function withoutExtension(filename) {
    return filename.substr(0, filename.lastIndexOf('.')) || filename;
}

// TODO: not using yet
export function mapAllFilePathsTree(node, currPath = '', result = {}) {
    for (let file of node.files) {
        const fileFullPath = currPath + '/' + file.name;
        Object.assign(result, { [fileFullPath]: file.id });
    }
    for (let dir of node.dirs) {
        const newCurrPath = currPath + '/' + dir.name;
        mapAllFilePathsTree(dir, newCurrPath, result);
    }
    return result;
}

export function parseFullPath(path) {
    const parsedPath = path.replace(/^\//, '');
    const pathList = parsedPath.split('/');

    const parsedPathList = pathList.reduce((acc, str, ind) => {
        const prev = acc[ind - 1] || '';
        acc.push(prev + '/' + str);
        return acc;
    }, []);

    return parsedPathList.reduce((acc, curPath, ind, arr) => {
        const dirName = curPath.replace(/^.*\//, '');
        const prevPath = arr[ind - 1];
        acc.push({
            curPath,
            prevPath,
            dirName,
        });
        return acc;
    }, []);
}

export function merge(curState, newState) {
    for (let newStateKey of Object.keys(newState)) {
        const newStateVal = newState[newStateKey];
        // prevent setting the same value
        if (curState[newStateKey] && curState[newStateKey] === newStateVal)
            continue;
        curState[newStateKey] = newStateVal;
    }
    return curState;
}

export function setValues(obj, data) {
    for (let dataKey of Object.keys(data)) {
        setValue(obj, dataKey, data[dataKey]);
    }
}
export function setValue(obj, key, value) {
    if (obj[key] && typeof obj[key] === 'object' && 'set' in obj[key]) {
        obj[key].set(value);
    } else {
        obj[key] = value;
    }
}

export function isFileForImagesGallery(mimetype) {
    return Object.keys(IMAGE_MIME_TYPE)
        .map((mime) => mimetype === IMAGE_MIME_TYPE[mime])
        .find((item) => item);
}

export function isFileForVideoPlayer(mimetype) {
    return Object.keys(VIDEO_MIME_TYPE)
        .map((mime) => mimetype === VIDEO_MIME_TYPE[mime])
        .find((item) => item);
}

export function isFileForAudioPlayer(mimetype) {
    return Object.keys(AUDIO_MIME_TYPE)
        .map((mime) => mimetype === AUDIO_MIME_TYPE[mime])
        .find((item) => item);
}

export function isFileForPDFViewer(mimetype) {
    return Object.keys(PDF_MIME_TYPE)
        .map((mime) => mimetype === PDF_MIME_TYPE[mime])
        .find((item) => item);
}

export function update(source, target) {
    Object.keys(source).forEach(
        (sourceKey) => (target[sourceKey] = source[sourceKey])
    );
}

export function updateIfNotUndef(data, newData) {
    Object.keys(data).forEach((dataKey) => {
        if (
            newData[dataKey] !== undefined &&
            newData[dataKey] !== data[dataKey]
        ) {
            data[dataKey] = newData[dataKey];
        }
    });
}
