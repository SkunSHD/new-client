import { observable } from 'mobx';
import { types } from 'mobx-state-tree';

const volatile = (self) =>
    observable({
        state: {
            isOpen: false,
            startNode: {},
        },
        isReset: false,
        audioRef: null,
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
        resetPlayList({
            isReset = false,
            startNode = self.state.startNode,
        } = {}) {
            self.isReset = isReset;
            self.state.startNode = startNode;
        },
        setAudioRef(audioRef = null) {
            self.audioRef = audioRef;
        },
    };
};

export default types
    .model()
    .volatile(volatile)
    .views(views)
    .actions(actions);
