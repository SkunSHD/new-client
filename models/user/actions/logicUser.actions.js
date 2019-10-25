import { flow } from 'mobx-state-tree';
import store from '_core/store';

export default (self) => {
    return {
        updateSettings: flow(function*(data) {
            return yield self.fetchSaveSettings(data);
        }),

        changePhoneStep1: flow(function*(data) {
            return yield self.fetchRequestPhoneChange(data);
        }),

        changePhoneStep2: flow(function*(data) {
            return yield self.fetchChangePhone(data);
        }),

        changePassword: flow(function*(data) {
            return yield self.fetchChangePassword(data);
        }),

        changeEmail: flow(function*(data) {
            return yield self.fetchChangeEmail(data);
        }),

        changeFlags: flow(function*(data) {
            return yield self.fetchSaveFlags(data);
        }),

        getCustomSettings: flow(function*({ dirId }) {
            if (!store.users.isAuthUser) return;
            const settings = yield self.fetchCustomSettings();
            self.settings = settings;
            const updateSetting = (settingName, curSettings) => {
                switch (settingName) {
                    case 'isGridView':
                        store.fs.view.setUserSetting({
                            isGridView: curSettings.isGridView,
                        });
                        break;
                    case 'byCategory':
                        store.fs.sort.setUserSetting({
                            byCategory: curSettings.byCategory,
                        });
                        break;
                    case 'byDirection':
                        store.fs.sort.setUserSetting({
                            byDirection: curSettings.byDirection,
                        });
                        break;
                }
            };
            const currentDirSettings = settings[dirId];
            if (currentDirSettings) {
                Object.keys(currentDirSettings).forEach((settingName) =>
                    updateSetting(settingName, currentDirSettings)
                );
            } else {
                // set defaults in case of settings for this dir don't exist
                store.fs.view.setDefaults();
                store.fs.sort.setDefaults();
            }
        }),

        setCustomSettings: flow(function*(newSettings) {
            // Case for unauth user
            if (!store.users.isAuthUser) return;

            // Merge old settings with new one
            const currentDirId = store.fs.tree.id;
            const newSettingsCurrentDir = {
                [currentDirId]: {
                    ...self.settings[currentDirId],
                    ...newSettings,
                },
            };
            const newSettingsAllDirs = {
                ...self.settings,
                ...newSettingsCurrentDir,
            };

            // Save settings to the server
            yield self.fetchSaveCustomSettings(newSettingsAllDirs);

            // Save settings locally
            self.settings = newSettingsAllDirs;
        }),

        clearCustomSettings: flow(function*() {
            yield self.fetchSaveCustomSettings();
        }),
    };
};
