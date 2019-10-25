import { getModifiedUserData } from '_core/utils/userDataValidation';

export default (self) => {
    return {
        createUser({ anonymous, user, billing, admin, storage }) {
            if (anonymous) {
                return self.all.set('anonymous', {
                    ...anonymous,
                    ...{ licenses: [{ value: 0 }] },
                });
            }

            const userId = (
                (user && user.id) ||
                (billing && billing.id) ||
                (admin && admin.id)
            ).toString();

            const data = {
                ...(user && getModifiedUserData(user)),
                ...(billing && { ...billing }),
                ...(admin && { ...admin }),
                ...(storage && { ...storage }),
            };

            if (self.isExistUser(userId)) {
                // Case when users list loaded then load admins list or conversely
                return self.getExistUser(userId).update(data);
            }

            self.all.set(userId, data);
        },

        setAuthUserId(id) {
            self.authUserId = id.toString();
        },

        remove() {
            self.all.delete(self.authUserId);
            self.setAuthUserId('anonymous');
        },
    };
};
