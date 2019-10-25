export function $(selector) {
    if (typeof window !== 'undefined') {
        return document.querySelectorAll(selector)[0];
    }
}

export function toggleClass(
    selector = '.layout',
    toggleClass = 'layout_state_lock-scroll'
) {
    if (typeof window !== 'undefined') {
        document.querySelector(selector).classList.toggle(toggleClass);
    }
}

export function scrollTo(element = document.body, to = 0) {
    if (typeof window !== 'undefined') {
        window.scrollTo(element, to);
    }
}
