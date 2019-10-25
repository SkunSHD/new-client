export default (self) => {
    return {
        updateUsedSpaceWithWrapper(wrapper) {
            if (wrapper.status === 'paused') return;
            self.used_space = self.used_space + wrapper.file.size;
        },
        updateUsedSpaceByType(actionType, size) {
            if (size === 0) return;

            switch (actionType) {
                case 'copy':
                    self.used_space += size;
                    break;
                case 'delete':
                    self.used_space -= size;
                    break;
            }
        },
    };
};
