import { observable } from 'mobx';
import { types } from 'mobx-state-tree';

const volatile = (self) =>
    observable({
        state: {
            isOpen: false,
            startNode: {},
        },
        galleryState: {
            id: null,
            name: '',
            downloadUrl: '',
            playUrl: '',
            isVideo: false,
        },
        printRef: null,
        videoRef: null,
        galleryRef: null,
    });

const views = (self) => ({});

const actions = (self) => {
    return {
        change({ isOpen = false, startNode = {} } = {}) {
            self.state = {
                isOpen,
                startNode,
            };
        },
        setGalleryState({
            id = null,
            name = '',
            downloadUrl = '',
            playUrl = '',
            isVideo = false,
        } = {}) {
            self.galleryState = {
                id,
                name,
                downloadUrl,
                playUrl,
                isVideo,
            };
        },
        setPrintRef(printRef = null) {
            self.printRef = printRef;
        },
        setVideoRef(videoRef = null) {
            self.videoRef = videoRef;
        },
        setGalleryRef(galleryRef = null) {
            self.galleryRef = galleryRef;
        },
    };
};

export default types
    .model()
    .volatile(volatile)
    .views(views)
    .actions(actions);
