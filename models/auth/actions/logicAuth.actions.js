import { flow } from 'mobx-state-tree';

export default (self) => {
    return {
        signin: flow(function*(data) {
            const response = yield self.fetchSignin(data);

            if (response.error) return response;

            if (data.dontRemember) {
                self.userToken.createSession(response);
            } else {
                self.userToken.create(response);
            }
            yield self.getConfig();

            return response;
        }),

        signout: flow(function*() {
            const response = yield self.fetchSignout();

            if (response.error) return response;

            self.removeUserData();
            yield self.getConfig();

            return response;
        }),

        signoutAll: flow(function*() {
            const response = yield self.fetchSignoutAll();

            if (response.error) return response;

            self.removeUserData();
            yield self.getConfig();

            return response;
        }),

        regStep1: flow(function*(data) {
            const response = yield self.fetchScaffold(data);

            if (response.error) return response;

            return response;
        }),

        confirmEmail: flow(function*(data) {
            const response = yield self.fetchConfirmEmail(data);

            if (response.error) return response;

            return response;
        }),

        signupFB: flow(function*(data) {
            const response = yield self.fetchFBSignup(data);

            if (response.error) return response;

            self.userToken.create(response);

            yield self.getConfig();

            return response;
        }),

        signinFB: flow(function*(data) {
            const response = yield self.fetchFBSignin(data);

            if (response.error) return response;

            self.userToken.create(response);

            yield self.getConfig();

            return response;
        }),

        signupGoogle: flow(function*(data) {
            const response = yield self.fetchGoogleSignup(data);

            if (response.error) return response;

            self.userToken.create(response);

            yield self.getConfig();

            return response;
        }),

        signinGoogle: flow(function*(data) {
            const response = yield self.fetchGoogleSignin(data);

            if (response.error) return response;

            self.userToken.create(response);

            yield self.getConfig();

            return response;
        }),

        signupVK: flow(function*(data) {
            const response = yield self.fetchVKSignup(data);

            if (response.error) return response;

            self.userToken.create(response);

            yield self.getConfig();

            return response;
        }),

        signinVK: flow(function*(data) {
            const response = yield self.fetchVKSignin(data);

            if (response.error) return response;

            self.userToken.create(response);

            yield self.getConfig();

            return response;
        }),
    };
};
