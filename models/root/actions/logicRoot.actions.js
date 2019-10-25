import { flow } from 'mobx-state-tree';

export default (self) => {
    return {
        getConfig: flow(function*() {
            if (!!self.userToken.all.token) {
                const responseConfig = yield self.fetchConfig();

                if (responseConfig.error) return responseConfig.error;

                const { user, info, ...rest } = responseConfig;

                self.setEnvInfo(info);
                self.users.setAuthUserId(user.id);
                self.users.createUser({ user, ...rest });
                self.userToken.saveToStore(self.userToken.all);

                return responseConfig;
            } else {
                const responseConfigAnonymous = yield self.users.fetchConfigAnon();

                if (responseConfigAnonymous.error) {
                    return responseConfigAnonymous.error;
                }

                const { anonymous, info } = responseConfigAnonymous;

                self.setEnvInfo(info);
                self.users.createUser({ anonymous });
                return responseConfigAnonymous;
            }
        }),

        getFexFilesCount: flow(function*() {
            const response = yield self.fetchFexFilesCount();

            if (response.error) return response;

            self.setFexFilesCount(response.files_count);
        }),
    };
};
