import ReactGA from 'react-ga';
import gtag from 'ga-gtag';
// Utils
import env from '_core/utils/env.utils';
import store from '_core/store';

const GA = {
    id: 'UA-134700492-1',
    event: (name = '', options = {}) => {
        if (!env.DISPLAY_GA) return;
        gtag('event', name, options);
    },
    userType() {
        const { isAuthUser, isTrial } = store.users;
        if (!isAuthUser) return 'anonymous';
        if (isTrial) return 'trial';
        return 'premium';
    },
    config(service) {
        if (!store.users.isAuthUser)
            return {
                dimension2: store.sessionId,
                dimension3: GA.userType(),
            };

        const dimensions = {
            dimension1: store.users.currentAuthUser.id,
            dimension2: store.sessionId,
            dimension3: GA.userType(),
        };

        if (service === 'gtag') {
            return {
                user_id: store.users.currentAuthUser.id,
                ...dimensions,
            };
        } else {
            return {
                userId: store.users.currentAuthUser.id,
                ...dimensions,
            };
        }
    },
    trackPage(page, options) {
        ReactGA.ga('send', 'pageview', page, {
            ...options,
            ...GA.config(),
        });

        gtag('config', GA.id, {
            ...GA.config('gtag'),
        });
    },
};

export default GA;
