import Yup from '_core/utils/yup.utils';
import ERROR from '_core/utils/error.utils';

const validateRules = {
    login: Yup.string()
        .trim()
        .max(64, 'Need less than 65 symbols'),
    phone: Yup.string()
        .trim()
        .min(7, () => ({ key: 'need_more_than_count_symbols', count: 6 }))
        .max(15, () => ({ key: 'need_less_than_count_symbols', count: 16 }))
        .matches(/\+\d*/, {
            message: 'Phone is invalid',
            excludeEmptyString: false,
        }),
    isPhoneInvalid: Yup.string()
        .trim()
        .when(['isPhoneInvalid'], (isPhoneInvalid, schema) => {
            return isPhoneInvalid
                ? schema
                      .matches(/[*]/, {
                          message: 'Phone is invalid',
                          excludeEmptyString: false,
                      })
                      .matches(/\+\d*/, {
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
                : schema.strip();
        }),
    email: Yup.string()
        .trim()
        .email('Invalid email address')
        .min(6, () => ({
            key: 'email_should_be_no_less_count_characters',
            count: 6,
        }))
        .max(64, () => ({
            key: 'email_should_be_no_longer_count_characters',
            count: 64,
        }))
        .matches(
            /^([A-Za-z0-9])+([A-Za-z0-9_.+-]{0,58})+\@+([A-Za-z0-9_.+-])+.+([A-Za-z]{2,6}$)/,
            {
                message: 'Invalid email address',
                excludeEmptyString: false,
            }
        ),
    first_name: Yup.string()
        .min(2, () => ({
            key: 'name_should_be_no_less_count_characters',
            count: 2,
        }))
        .max(64, () => ({
            key: 'name_should_be_no_longer_count_characters',
            count: 64,
        })),
    password: Yup.string()
        .min(8, () => ({
            key: 'password_should_be_no_less_count_characters',
            count: 8,
        }))
        .max(64, () => ({
            key: 'password_should_be_no_longer_count_characters',
            count: 64,
        }))
        .matches(/^[A-Za-z0-9~`!@#$%^&*()_\-+={}\[\]\|:;"'<>,.?/]+$/i, () => ({
            key: 'password_syntax_error_msg',
        })),
    code: Yup.string().required('This field is required'),
    terms: Yup.boolean().oneOf([true], 'This checkbox is required'),
    filename: Yup.string()
        .max(255, ERROR.errorsName[2409])
        .required('This field is required'),
};

export default validateRules;
