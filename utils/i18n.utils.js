import i18n from 'i18next';
import FetchBackend from 'i18next-fetch-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { reactI18nextModule } from 'react-i18next';
// Utils
import env from '_core/utils/env.utils';
import LANG from '_core/utils/lang.utils';

// https://github.com/perrin4869/i18next-fetch-backend#ie--10-support
FetchBackend.type = 'backend';

i18n.use(FetchBackend)
    .use(LanguageDetector)
    .use(reactI18nextModule) // if not using I18nextProvider
    .init({
        ...(env.DEV_MODE && { lng: 'dev' }),
        fallbackLng: LANG.current,
        initImmediate: false, // wait for XHR load resources
        load: 'currentOnly',
        whitelist: LANG.all,

        // have a common namespace used around the full app
        ns: ['translations'],
        defaultNS: 'translations',

        saveMissing: false,
        saveMissingPlurals: false,
        debug: false,

        // https://www.i18next.com/principles/fallback#key-fallback
        // allow keys to be phrases having `:`, `.`
        nsSeparator: false,
        keySeparator: false,

        interpolation: {
            escapeValue: false, // not needed for react!!
            formatSeparator: ',',
        },

        react: {
            wait: true,
        },

        backend: {
            loadPath: `${env.PUBLIC_URL}/locales/{{lng}}/{{ns}}.json`,
        },
    });

if (env.DEV_MODE) {
    i18n.on('missingKey', (lngs, namespace, key, res) => {
        //save only singular form (one key for singular and plural)
        //plural form create in Lokalise with option
        fetch(
            'http://localhost:3035/save_data_for_lokalise?key_name=' +
                key +
                '&translation=' +
                res +
                '&project_name=' +
                env.PROJECT_NAME,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            }
        )
            .then(function(response) {
                return response;
            })
            .catch(function(e) {
                return { error: e };
            });
    });
}

export default i18n;
