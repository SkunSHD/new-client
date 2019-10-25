// Utils
import env from '_core/utils/env.utils';

const LANG = {
    current: env.DEV_MODE ? 'dev' : 'en',
    names: {
        en: 'English',
        uk: 'Українська',
        ru: 'Русский',
        // de: 'Deutsch',
        // pl: 'Polski',
        // tr: 'Türkçe',
        ...(env.DEV_MODE && { dev: 'development' }),
    },
    get all() {
        return Object.keys(this.names);
    },
};

export default LANG;
