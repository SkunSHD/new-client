import { types } from 'mobx-state-tree';
import i18n from 'i18next';

const LangModel = {
    value: types.string,
};

const volatile = (self) => {
    return {
        t(translate = '', lang = self.value, params = '') {
            return i18n.getFixedT(lang)(translate, params);
        },
    };
};

// model mutations goes only in actions
const actions = (self) => {
    return {
        set(lang) {
            self.value = lang;
        },

        change(lang) {
            if (lang === self.value) return;

            i18n.changeLanguage(lang, (err, t) => {
                if (err)
                    return console.log('something went wrong loading', err);
                self.set(lang);
                // t('key'); // -> same as i18n.t
            });
        },
    };
};

export default types
    .model('LangModel', LangModel)
    .volatile(volatile)
    .actions(actions);
