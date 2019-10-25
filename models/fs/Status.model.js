import { types } from 'mobx-state-tree';
import log from '_core/utils/log.utils';
import _ from 'lodash';

const StatusModel = types.model('StatusModel', {
    all: types.optional(
        types.map(
            types.enumeration(['pending', 'fulfilled', 'rejected', 'canceled'])
        ),
        {}
    ),
});

const views = (self) => ({
    fetchKey(actionObj) {
        const [[modelName, actionName]] = Object.entries(actionObj);
        return _.camelCase(`${modelName} ${actionName}`);
    },
    getFetchStatus(actionObj) {
        const fetchKey = self.fetchKey(actionObj);

        return self.all.get(fetchKey);
    },
    isFetched(actionObj) {
        const fetchStatus = self.getFetchStatus(actionObj);

        return fetchStatus === 'fulfilled';
    },
    isLoading(actionObj) {
        const fetchStatus = self.getFetchStatus(actionObj);

        return fetchStatus === 'pending';
    },
    isRejected(actionObj) {
        const fetchStatus = self.getFetchStatus(actionObj);

        return fetchStatus === 'rejected';
    },
});

const actions = (self) => {
    return {
        startFetch(fetchKey) {
            self.all.set(fetchKey, 'pending');
        },
        endFetchError(fetchKey) {
            self.all.set(fetchKey, 'rejected');
        },
        endFetchSuccess(fetchKey) {
            self.all.set(fetchKey, 'fulfilled');
        },
        track: async (actionObj, fetchFunc) => {
            const [[modelName, actionName]] = Object.entries(actionObj);
            const actionNameKebabCase = _.kebabCase(
                `${modelName} ${actionName}`
            ).toUpperCase();
            const fetchKey = self.fetchKey(actionObj);

            log.l(actionNameKebabCase);
            self.startFetch(fetchKey);

            const resp = await fetchFunc();

            if (resp.error) {
                self.endFetchError(fetchKey);
                log.l(actionNameKebabCase + '-ERROR');
            } else {
                self.endFetchSuccess(fetchKey);
                log.l(actionNameKebabCase + '-SUCCESS');
            }

            return resp;
        },
        trackLocal: async (localState, actionName, fetchFunc) => {
            const actionNameKebabCase = _.kebabCase(actionName).toUpperCase();

            log.l(actionNameKebabCase);
            localState.status = 'pending';

            const resp = await fetchFunc();

            if (resp.status) {
                localState.status = 'rejected';
                log.l(actionNameKebabCase + '-ERROR', resp);
            } else {
                localState.status = 'fulfilled';
                log.l(actionNameKebabCase + '-SUCCESS', resp);
            }

            return resp;
        },
        deleteFetchKey(actionObj) {
            self.all.delete(self.fetchKey(actionObj));
        },
    };
};

export default StatusModel.views(views).actions(actions);
