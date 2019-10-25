// Utils
import env from '_core/utils/env.utils';

const routerUrls = {
    client: {
        // Auth/UnAuth urls
        SharedPage: '/s',
        TariffPlanPage: '/tariff-plan',
        VoucherPage: '/voucher',
        AcceptConditionPage: '/accept-condition',
        TermsAndConditionsPage: '/terms',
        TermsAndConditionsBlankPage: '/blank/terms',
        TermsAndConditionsPrevPage: '/terms-1',
        PrivacyPolicyPage: '/privacy-policy',
        PrivacyPolicyBlankPage: '/blank/privacy-policy',
        PrivacyPolicyPrevPage: '/privacy-policy-1',
        FaqPage: '/faq',
        SupportPage: '/support',
        SmartTvPage: '/smart-tv',
        TerminalsPage: '/terminals',

        // UnAuth urls
        HomePage: '/',
        AnonPage: '/a',
        SignInPage: '/login',
        SignUpPage: '/registration',
        ConfirmRegPage: '/confirm',
        RecoverPasswordPage: '/recover-password',
        ConfirmRecoverPasswordPage: '/recover',

        // Auth urls
        FsPage: '/files',
        AccountPage: '/account',
        TariffPaymentPage: '/tariff-payment',
        PaySuccessPage: '/pay-success',
        PayFailedPage: '/pay-failed',

        // Landings urls
        // Auth/UnAuth urls
        ProstoPromoLanding: '/prosto-promo',
        AdmixerPromoPage: '/admixer-promo',

        // UnAuth urls
        RegisterPromoLanding: '/register-promo',

        // Auth urls
        TariffsPromoLanding: '/tariffs-promo',

        // Hook urls
        afterSignIn: '/files',
        afterSignOut: '/login',
    },

    admin: {
        // Auth/Unauth urls
        HomePage: '/sa',

        // Unauth urls
        SignInPage: '/sa/login',

        // Auth urls
        AccountPage: '/sa/account',
        AdminsListPage: '/sa/admins',
        UserInfoPage: '/sa/user',
        UsersListPage: '/sa/users',
        OrderTariffListPage: '/sa/order-tariff',

        // Hook urls
        afterSignIn: '/sa/users',
        afterSignOut: '/sa/login',
    },

    get goTo() {
        return env.PROJECT_NAME === 'client'
            ? routerUrls.client
            : routerUrls.admin;
    },
};

export default routerUrls;
