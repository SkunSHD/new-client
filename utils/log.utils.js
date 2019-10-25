import { onPatch, onSnapshot, addMiddleware } from 'mobx-state-tree';
import { spy } from 'mobx';
// Utils
import env from '_core/utils/env.utils';

const logUtils = {
    highlightMessage: ({ message, isDefault = false, args = [] }) => {
        if (!env.DEV_MODE) return;

        if (message.match('@reaction') && !message.match('silent'))
            return console.log('%c' + message, 'color: orange', ...args);
        if (message.match('-WARNING'))
            return console.log('%c ' + message, 'color: darkred', ...args);
        if (message.match('-ERROR'))
            return console.log('%c ' + message, 'color: darkred', ...args);
        if (message.match('-SUCCESS'))
            return console.log('%c ' + message, 'color: green', ...args);
        if (message.match('-ABORT'))
            return console.log('%c ' + message, 'color: purple', ...args);
        if (isDefault) console.log(`%c ${message}`, 'color: blue', ...args);
    },
    l: (message, ...args) => {
        if (!env.DEV_MODE) return;

        return logUtils.highlightMessage({ message, args, isDefault: true });
    },
    mobxChanges: () => {
        if (!env.DEV_MODE) return;

        spy((event) => {
            if (event.type === 'action') {
                logUtils.highlightMessage({ message: event.name });
            }
        });
    },
    storeChanges: (store) => {
        addMiddleware(store, (call, next) => {
            switch (call.type) {
                case 'action':
                    console.log(
                        `%c ${call.type}`,
                        'background: green; color: white',
                        call.name,
                        call
                    );
                    break;
                default:
                    console.log(
                        `%c ${call.type}`,
                        'background: black; color: white',
                        call.name
                    );
                    break;
            }
            return next(call);
        });
        // @SOURCE: https://github.com/mobxjs/mobx-state-tree/blob/master/API.md#onpatch
        onPatch(store, (patch) => {
            let color = 'color: gray;';
            switch (patch.op) {
                case 'add':
                    color = 'color: green;';
                    break;
                case 'replace':
                    color = 'color: darkorange;';
                    break;
                case 'remove':
                    color = 'color: darkred;';
                    break;
                default:
                    color = 'color: black';
                    break;
            }
            console.groupCollapsed(
                `%c🦄🌈 [@action: ${patch.op} ${patch.path}]`,
                color
            );
            console.log(patch);
            console.groupEnd(
                `%c🦄🌈 [@action: ${patch.op} ${patch.path}]`,
                color
            );
        });
        onSnapshot(store, (snapshot) => console.log('snapshot: ', snapshot));
    },
};

export default logUtils;
