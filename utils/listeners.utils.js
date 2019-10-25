const listeners = {
    add(event, func) {
        window.addEventListener(event, func);
    },
    remove(event, func) {
        window.removeEventListener(event, func);
    },
};

export default listeners;
