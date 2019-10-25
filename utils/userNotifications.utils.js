// Store
import store from '_core/store';

const userNotifications = {
    registrationNeed(nextUrl, redirectUrl) {
        if (!!nextUrl) {
            store.setNextPathUrl(nextUrl);
        }

        store.openNewTab({ url: redirectUrl });

        store.alerts.openTrigger('registrationNeed');
    },
};

export default userNotifications;
