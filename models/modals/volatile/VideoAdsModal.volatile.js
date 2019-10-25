import { flow, types } from 'mobx-state-tree';
// Store
import store from '_core/store';
// Utils
import env from '_core/utils/env.utils';

const volatile = {
    storageTag: 'videoAds',
    adsType: '', // ['upload', 'download']
};

const views = (self) => ({});

const actions = (self) => {
    return {
        open: flow(function*({ adsType = 'download' } = {}) {
            if (
                !store.googleServices.ads.isEnable ||
                sessionStorage.getItem(self.storageTag)
            )
                return;

            sessionStorage.setItem(self.storageTag, 1);
            self.adsType = adsType;

            store.modals.open({ id: 'VideoAdsModal' });

            yield new Promise((resolve) => setTimeout(resolve, 5000));
        }),
    };
};

export default types
    .model()
    .volatile(() => volatile)
    .views(views)
    .actions(actions);
