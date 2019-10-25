import React from 'react';
import shortid from 'shortid';
// Components
import T from '_core/components/elements/T';

// List of available error codes:

const ERROR = {
    errorsName: {
        404: 'Please try again in a few minutes',

        // sign in errors
        rateLimitError:
            'Please try again in a few minutes or contact our support',

        // social response errors
        vkError: 'VK send error',
        fbError: 'Facebook send error',
        googleError: 'Google send error',

        errorVideoConvert: 'Video is preparing, please wait',
        copyToClipboardError: 'Link was not copied',

        // storage errors
        413: 'File is too big',

        // API errors
        1006: 'This field is required',
        1007: 'Incorrect phone number',
        1009: 'Phone number already taken',
        1012: 'Wrong verification code',
        1013: 'Empty username',
        1019: 'Username already registered',
        1020: 'Wrong email format',
        1022: 'This field is required',
        1024: 'Wrong login or password',
        1025: 'Password is too short',
        1026: 'Password is too big',
        1027: 'Password the same as the username',
        1030: 'Wrong password', // Invalid current password
        1032: 'There is no such user',
        1036: 'First name too long',
        1037: 'Email too long',
        1038: 'Email already taken',
        1039: 'Please try again later',
        1042: 'Wrong voucher',
        1043: 'This voucher was already used',
        1044: 'This voucher has expired',
        1054: 'Wrong password',
        1055: 'The user has not permission',
        1056: 'Invalid form',
        1057: 'This field can not be empty',
        1058: 'Username is too long',
        1059: 'This field is required', // Directory or file name cannot be empty
        1091: 'User is not registered',
        1092: 'User is already registered',
        1093: 'File name is too long',
        1094: 'Invalid file size',
        1095: 'Not enough storage space',
        2001: 'Token missed',
        2002: 'Invalid token',
        2003: 'Expired token',
        2004: 'Token malformed',
        2005: 'You did not sign in', // Social ID isn't corresponding
        2006: 'You did not sign in', // Social status code is incorrect
        2101: 'You did not sign in', // FB token missed
        2201: 'You did not sign in', // VK token missed
        2202: 'You did not sign in', // VK response with error
        2301: 'You did not sign in', // Google token missed
        2402: 'No files available by this link.',
        2403: 'An error occurred, try once again or contact our support',
        2405: 'Folder name is too long',
        2406: 'No such file name',
        2407: 'Folder name already taken',
        2408: 'File name already taken',
        2409: 'Invalid folder name length',
        2410: 'Subfolders depth exceeded',
        2414: 'Link expired',
        2417: 'Please try again in a few minutes', // ANONYM_UPLOAD_ROOT_DOESNT_EXIST
        2425: 'Place in favorite files has ended',
    },
    formatErrors: (errors) => {
        if (errors.form) {
            return Object.keys(errors.form).reduce(
                (acc, fieldName) => {
                    const fieldErrors = errors.form[fieldName];
                    const currentError =
                        fieldErrors.length === 1 ? fieldErrors : fieldErrors[0];

                    return {
                        ...acc,
                        [fieldName]: ERROR.errorsName[currentError],
                    };
                },
                { error: '' }
            );
        } else if (errors.code) {
            return { error: ERROR.errorsName[errors.code] };
        } else if (ERROR.errorsName[errors]) {
            return { error: ERROR.errorsName[errors] };
        }

        return { error: errors };
    },
    renderErrors: (errors) => {
        if (!!ERROR.formatErrors(errors)) {
            return Object.keys(ERROR.formatErrors(errors)).reduce(
                (acc, fieldName) => {
                    return [
                        ...acc,
                        <span key={shortid.generate().toString()}>
                            <T>{ERROR.formatErrors(errors)[fieldName]}</T>
                        </span>,
                    ];
                },
                []
            );
        }
    },
};

export default ERROR;

export function customFormErrors(key, count) {
    switch (key) {
        case 'password_should_be_no_less_count_characters':
            return (
                <T i18nKey={key} count={count}>
                    Password should be no less {{ count }} character
                </T>
            );
        case 'password_should_be_no_longer_count_characters':
            return (
                <T i18nKey={key} count={count}>
                    Password should be no longer {{ count }} character
                </T>
            );
        case 'email_should_be_no_less_count_characters':
            return (
                <T i18nKey={key} count={count}>
                    Email should be no less {{ count }} character
                </T>
            );
        case 'email_should_be_no_longer_count_characters':
            return (
                <T i18nKey={key} count={count}>
                    Email should be no longer {{ count }} character
                </T>
            );
        case 'name_should_be_no_less_count_characters':
            return (
                <T i18nKey={key} count={count}>
                    Name should be no less {{ count }} character
                </T>
            );
        case 'name_should_be_no_longer_count_characters':
            return (
                <T i18nKey={key} count={count}>
                    Name should be no longer {{ count }} character
                </T>
            );
        case 'need_less_than_count_symbols':
            return (
                <T i18nKey={key} count={count}>
                    Need less than {{ count }} symbol
                </T>
            );
        case 'need_more_than_count_symbols':
            return (
                <T i18nKey={key} count={count}>
                    Need more than {{ count }} symbol
                </T>
            );
        case 'password_syntax_error_msg':
            return (
                <span>
                    <T i18nKey={key}>
                        Password must have only latins characters,
                        <br />
                        numbers and symbols
                    </T>
                    {' ~`!@#$%^&*()_-+={}[]|:;"\'<>,.?/]'}
                </span>
            );
        default:
            return 'No such error msg yet';
    }
}
