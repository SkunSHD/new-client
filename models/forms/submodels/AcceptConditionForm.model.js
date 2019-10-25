import { types } from 'mobx-state-tree';

const AcceptConditionModel = {
    isAuthVK: types.optional(types.boolean, false),
    isAuthFacebook: types.optional(types.boolean, false),
    isAuthGoogle: types.optional(types.boolean, false),

    access_token: types.optional(types.string, ''),
    social_id: types.optional(types.string, ''),
    user_id: types.optional(types.string, ''), // social_id for VK
    app_id: types.optional(types.string, ''),
    email: types.maybeNull(types.string), // only for VK
};

const views = (self) => ({
    get hasCredentials() {
        return self.isAuthVK || self.isAuthFacebook || self.isAuthGoogle;
    },
});

export default types
    .model('AcceptConditionModel', AcceptConditionModel)
    .views(views);
