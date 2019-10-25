import { flow } from 'mobx-state-tree';

export default (self) => {
    return {
        refreshToken: flow(function*(data) {
            const response = yield self.fetchRefreshToken(data);

            if (response.error) return response;

            if (!!self.session) {
                self.createSession(response);
            } else {
                self.create(response);
            }

            return response;
        }),
    };
};
