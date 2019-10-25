const FORM = {
    ignoreFieldsName: [
        'isOldPasswordShow',
        'isNewPasswordShow',
        'isConfirmPasswordShow',
        'isPasswordShow',
    ],
    ignoreFields: (form) => {
        const formDirtyFields = Object.keys(form.getState().dirtyFields).reduce(
            (acc, item) => {
                return [...acc, FORM.ignoreFieldsName.indexOf(item)];
            },
            []
        );

        const formDirtyIgnoreFields = Object.keys(FORM.ignoreFieldsName).reduce(
            (acc, item) => {
                return [
                    ...acc,
                    form.getState().dirtyFields[FORM.ignoreFieldsName[item]],
                ];
            },
            []
        );

        if (!!formDirtyFields.find((element) => element === -1)) {
            return false;
        } else {
            return formDirtyIgnoreFields.find((element) => element);
        }
    },
};

export function emitSubmit(formName) {
    // { cancelable: true } required for Firefox
    // https://github.com/facebook/react/issues/12639#issuecomment-382519193
    document
        .getElementById(formName)
        .dispatchEvent(new Event('submit', { cancelable: true }));
}

export default FORM;
