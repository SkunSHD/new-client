import { setIn } from 'final-form';
import Yup from '_core/utils/yup.utils';
// Utils
import validateRules from '_core/utils/validateRules.utils';

const validationSchema = {
    signInForm: {
        isAuthByPhone: Yup.boolean(),
        isPasswordShow: Yup.boolean(),
        login: validateRules.login.when('isAuthByPhone', {
            is: false,
            then: Yup.string().required('This field is required'),
            otherwise: Yup.string().strip(),
        }),
        phone: Yup.string()
            .trim()
            .when(
                ['isAuthByPhone', 'isPhoneInvalid'],
                (isAuthByPhone, isPhoneInvalid, schema) => {
                    return isAuthByPhone
                        ? isPhoneInvalid
                            ? schema
                                  .matches(/[*]/, {
                                      message: 'Phone is invalid',
                                      excludeEmptyString: false,
                                  })
                                  .min(7, () => ({
                                      key: 'need_more_than_count_symbols',
                                      count: 6,
                                  }))
                                  .max(15, () => ({
                                      key: 'need_less_than_count_symbols',
                                      count: 16,
                                  }))
                                  .required('This field is required')
                            : schema.required('This field is required')
                        : schema.strip();
                }
            ),
        isPhoneInvalid: Yup.boolean(),
        password: validateRules.password.required('This field is required'),
        dontRemember: Yup.boolean(),
    },

    signUpStep1Form: {
        email: validateRules.email.required('This field is required'),
        first_name: validateRules.first_name.required('This field is required'),
        password: validateRules.password.required('This field is required'),
        isPasswordShow: Yup.boolean(),
        terms: validateRules.terms,
        privacy: validateRules.terms,
    },

    changeFirstNameForm: {
        first_name: Yup.string()
            .trim()
            .min(2, () => ({
                key: 'name_should_be_no_less_count_characters',
                count: 2,
            }))
            .max(64, () => ({
                key: 'name_should_be_no_longer_count_characters',
                count: 64,
            }))
            .required('This field is required'),
        rebill_is_active: Yup.boolean(),
        GDPR: validateRules.terms,
    },

    changePasswordForm: {
        password_old: validateRules.password.when('isAuthSocial', {
            is: false,
            then: Yup.string().required('This field is required'),
            otherwise: Yup.string().strip(),
        }),
        password: validateRules.password.required('This field is required'),
        confirmPassword: Yup.mixed().test(
            'match',
            'Passwords do not match',
            function() {
                return this.parent.confirmPassword === this.parent.password;
            }
        ),
        isOldPasswordShow: Yup.boolean(),
        isNewPasswordShow: Yup.boolean(),
        isConfirmPasswordShow: Yup.boolean(),
        isAuthSocial: Yup.boolean(),
    },

    changePhoneStep1Form: {
        phone: validateRules.isPhoneInvalid,
        isPhoneInvalid: Yup.boolean(),
        password: validateRules.password.required('This field is required'),
        isPasswordShow: Yup.boolean(),
    },

    changePhoneStep2Form: {
        phone: validateRules.phone.required('This field is required'),
        password: validateRules.password.required('This field is required'),
        code: validateRules.code,
        isPasswordShow: Yup.boolean(),
    },

    recoverPasswordStep1Form: {
        email: validateRules.email.required('This field is required'),
    },

    deleteAccountStep1Form: {
        password: validateRules.password.required('This field is required'),
        isPasswordShow: Yup.boolean(),
    },

    deleteAccountStep2Form: {
        password: validateRules.password.required('This field is required'),
        code: validateRules.code,
        isPasswordShow: Yup.boolean(),
    },

    voucherForm: {
        code: Yup.string()
            .min(12, () => ({ key: 'need_more_than_count_symbols', count: 11 }))
            .required('This field is required'),
    },

    rebillUpdateForm: {
        rebill_is_active: Yup.boolean(),
        GDPR: validateRules.terms,
    },

    tariffPaymentForm: {
        tariff_id: Yup.number()
            .typeError('tariff_id must be a number!')
            .required('This field is required'),
        product: Yup.number()
            .typeError('product must be a number!')
            .required('This field is required'),
        paysystem: Yup.string(),
        orderNumber: Yup.number()
            .typeError('orderNumber must be a number!')
            .required('This field is required'),
        signature: Yup.string(),
        productPrice: Yup.number()
            .typeError('productPrice must be a number!')
            .required('This field is required'),
        month: Yup.number()
            .typeError('month must be a number!')
            .required('This field is required'),
        productName: Yup.string(),
    },

    changeEmailForm: {
        oldEmail: validateRules.email.when('hasUserEmail', {
            is: true,
            then: Yup.string().required('This field is required'),
            otherwise: Yup.string().strip(),
        }),
        email: validateRules.email.required('This field is required'),
        hasUserEmail: Yup.boolean(),
    },

    changeFlagsForm: {
        subscribe: Yup.boolean(),
    },

    confirmationCodeWithPhone: {
        phone: validateRules.isPhoneInvalid,
        isPhoneInvalid: Yup.boolean(),
    },

    createDirForm: {
        name: validateRules.filename,
    },

    receiveFilesForm: {
        code: Yup.string()
            .trim()
            .min(7, () => ({ key: 'need_more_than_count_symbols', count: 6 }))
            .max(33, () => ({ key: 'need_less_than_count_symbols', count: 34 }))
            .matches(
                /(^(?=(.*[A-Za-z]){3})(?!.*[ghijquw])[A-Za-z\d]{7}$)|(\/+[a-z]+\/+(?=(.*[A-Za-z]){3})(?!.*[ghijquw])[A-Za-z\d]{7}$)|(^\d{12}$)|(\/+\d{12}$)/,
                {
                    message: 'Invalid code',
                    excludeEmptyString: false,
                }
            )
            .required('This field is required'),
    },

    sharedLinkForm: {
        isAccesByLink: Yup.boolean(),
    },

    renameNodeForm: {
        name: validateRules.filename,
    },

    orderTariffForm: {
        tariff_id: Yup.number()
            .typeError('tariff_id must be a number!')
            .required('This field is required'),
        email: validateRules.email.required('This field is required'),
    },
};

const validate = async ({ formName, values, schema }) => {
    const mergeSchema = schema.reduce((acc, name) => {
        return { ...acc, [name]: validationSchema[formName][name] };
    }, {});

    schema = Yup.object().shape(mergeSchema);

    try {
        await schema.validate(values, { abortEarly: false });
    } catch (e) {
        if (e instanceof TypeError) {
            return console.error(`validate.utils.js Error =\n`, e);
        }

        return e.inner.reduce((errors, error) => {
            return setIn(errors, error.path, error.message);
        }, {});
    }
};

export default validate;
