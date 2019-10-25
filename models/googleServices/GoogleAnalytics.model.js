import { types } from 'mobx-state-tree';
import ReactGA from 'react-ga';
import gtag, { install } from 'ga-gtag';
// Mobx
import { reaction } from 'mobx';
// Store
import store from '_core/store';
// Utils
import env from '_core/utils/env.utils';
import GA from '_core/utils/ga.utils';

if (env.DISPLAY_GA) {
    // Init GA
    ReactGA.initialize(GA.id, { debug: false });
    // Init gtag
    install(GA.id);
}

const volatile = (self) => ({});

const actions = (self) => {
    return {
        listenPageChange() {
            if (env.DISPLAY_GA) {
                reaction(
                    () => store.routeUrl,
                    (routeUrl) => GA.trackPage(routeUrl),
                    {
                        name: '@reaction: GoogleAnalyticsModel -> trackPage',
                        fireImmediately: true,
                    }
                );
            }
        },
    };
};

export default types
    .model('GoogleAnalyticsModel')
    .volatile(volatile)
    .actions(actions);
