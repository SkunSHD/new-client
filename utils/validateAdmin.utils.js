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
    adminInfoForm: {
        watchAllAdmins: Yup.boolean(),
        createNewAdmin: Yup.boolean(),
        updateAdminProfile: Yup.boolean(),
        watchAllUsers: Yup.boolean(),
        updateLicense: Yup.boolean(),
        sudosu: Yup.boolean(),
        canViewVouchers: Yup.boolean(),
        canEditUser: Yup.boolean(),
    },
    updateUserLicenseForm: {
        paid_till: Yup.number()
            .positive()
            .typeError('Paid till must be a date!')
            .required('This field is required'),
    },
    updateUserSettingsForm: {
        first_name: validateRules.first_name,
        email: validateRules.email,
        phone: Yup.string()
            .trim()
            .matches(/\+\d{7,15}/, {
                message: 'Min 7; Max 15; Phone is invalid',
                excludeEmptyString: true,
            }),
        password: Yup.string().matches(
            /^[A-Za-z0-9~`!@#$%^&*()_\-+={}\[\]\|:;"'<>,.?/]{8,64}$/,
            {
                message:
                    'Min 8; Max 64; Only latins characters, numbers and symbols ~`!@#$%^&*()_-+={}[]|:;"\'<>,.?/]',
                excludeEmptyString: true,
            }
        ),
        isPasswordShow: Yup.boolean(),
    },
};

const validateAdmin = async ({ formName, values, schema }) => {
    const mergeSchema = schema.reduce((acc, name) => {
        return { ...acc, [name]: validationSchema[formName][name] };
    }, {});

    schema = Yup.object().shape(mergeSchema);

    try {
        await schema.validate(values, { abortEarly: false });
    } catch (e) {
        if (e instanceof TypeError) {
            return console.error(`validateAdmin.utils.js Error =\n`, e);
        }

        return e.inner.reduce((errors, error) => {
            return setIn(errors, error.path, error.message);
        }, {});
    }
};

export default validateAdmin;
