const phoneNumbers = ['+380631111111'];

const emailTemplate = (userId) => `test${userId}@fex.net`;

export const isEmailValid = (email, userId) => email !== emailTemplate(userId);

export const isPhoneValid = (phone) => !phoneNumbers.includes(phone);

export const getModifiedUserData = (user) => {
    const modifiedData = {};

    if (!isEmailValid(user.email, user.id)) {
        modifiedData.email = null;
        modifiedData.has_email = false;
    }
    if (!isPhoneValid(user.phone)) {
        modifiedData.phone = null;
    }

    return { ...user, ...modifiedData };
};
