import shortid from 'shortid';
// Mobx
import { types, destroy } from 'mobx-state-tree';
import { observable, values } from 'mobx';
// Models
import AlertModel from '_core/models/alerts/Alert.model';
// Views
import alertsListViews from '_core/models/alerts/views/alertsList.views';

const AlertsModel = {
    all: types.map(AlertModel),
};

const volatile = (self) =>
    observable({
        trigger: {
            ids: {
                registrationNeed: false,
            },
        },
    });

const views = (self) => ({
    get values() {
        return values(self.all);
    },

    isShowAlert(alertId, routeName) {
        const alert = self.all.get(alertId);

        return (
            alert.showOnPages.includes('all') ||
            alert.showOnPages.includes(routeName)
        );
    },
    ...alertsListViews(self),
});

const actions = (self) => {
    return {
        create(alert) {
            if (self.all.has(alert.id)) return;

            const id = alert.id ? alert.id : shortid.generate().toString();
            const alertWithId = { ...alert, id };

            self.all.set(id, alertWithId);
        },

        remove(alertId) {
            const alert = self.all.get(alertId);

            if (!alert) return;

            destroy(alert);
        },

        openTrigger(alertId) {
            self.trigger.ids[alertId] = true;
        },

        closeTrigger(alertId) {
            self.trigger.ids[alertId] = false;
        },
    };
};

export default types
    .model('AlertsModel', AlertsModel)
    .volatile(volatile)
    .views(views)
    .actions(actions);
