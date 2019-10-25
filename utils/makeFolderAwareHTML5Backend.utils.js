import { getDroppedEntries } from '_core/utils/fs.utils';

export default function makeFolderAwareHTML5Backend(HTML5Backend) {
    return function(manager) {
        const backend = HTML5Backend(manager);
        const orig = backend.handleTopDropCapture;

        backend.handleTopDropCapture = function(event) {
            orig.call(backend, event);
            // [if] prevents from trigger func below in case of [inner drag&drop]
            if (backend.currentNativeSource) {
                // [getDroppedEntries] takes nested files from native event
                backend.currentNativeSource.item.entries = getDroppedEntries(
                    event
                );
            }
        };
        return backend;
    };
}
