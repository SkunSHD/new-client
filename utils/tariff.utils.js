// Store
import store from '_core/store';
// Utils
import env from '_core/utils/env.utils';
import API from '_core/utils/api.utils';

const TARIFF = {
    TB: 1024,
    BytesInGB: 1073741824,

    DAYS_IN_MONTH: 30,
    DAYS_IN_YEAR: 365,

    // ident product in fariffs (only 0 for WEB)
    FEX_PLUS: 0,

    paySystems: {
        PORTMONE: {
            id: 0,
            payee_id: env.PROD_MODE ? 12438 : 1185,
            url: 'https://www.portmone.com.ua/gateway/',
            defaultCurrency: 'UAH', // only UAH
            urlPaySuccess: `${API.url({
                urlPrefix: '',
            })}/billing/success/portmone`,
            urlPayFailed: `${API.url({
                urlPrefix: '',
            })}/billing/failed/portmone`,
        },
        ACCENTPAY: {
            id: 1,
            project_id: env.PROD_MODE ? 583 : 581,
            url: 'https://paymentpage.ecommpay.com/payment',
            defaultCurrency: 'USD', // USD and other fiat currency
            urlPaySuccess: `${env.FEX_URL}/pay-success`,
            urlPayFailed: `${env.FEX_URL}/pay-failed`,
        },
        COIN_PAYMENTS: {
            id: 2,
            merchant: 'e2dfca5ee794ce6071f613af35f4dccd',
            url: 'https://www.coinpayments.net/index.php',
            defaultCurrency: 'BTC', // BTC and ETC (ETC is convert BTC in redirect page)
            urlPaySuccess: `${env.FEX_URL}/pay-success`,
            urlPayFailed: `${env.FEX_URL}/pay-failed`,
        },
        UNITPAY: {
            id: 3,
            publicKey: '144381-d397c',
            project_id: env.PROD_MODE ? 144381 : 0,
            url: 'https://unitpay.ru/pay/144381-d397c',
            defaultCurrency: 'USD', // USD and other fiat currency
            urlPaySuccess: `${env.FEX_URL}/pay-success`,
            urlPayFailed: `${env.FEX_URL}/pay-failed`,
        },
    },

    convertGBToBytes: (GB) => {
        return +(GB * TARIFF.BytesInGB);
    },

    convertBytesToGB: (bytes, decimals) => {
        return +(bytes / TARIFF.BytesInGB).toFixed(decimals ? decimals : 0);
    },

    getUnits: (i) => {
        const units = [
            store.lang.t('Bytes'),
            store.lang.t('KB'),
            store.lang.t('MB'),
            store.lang.t('GB'),
            store.lang.t('TB'),
            store.lang.t('PB'),
            store.lang.t('EB'),
            store.lang.t('ZB'),
            store.lang.t('YB'),
        ];
        return units[i];
    },

    convertBytes: (bytes, decimals) => {
        if (bytes === 0) return `0 ${TARIFF.getUnits(0)}`;

        const dm = decimals <= 0 ? 0 : decimals || 2;
        const i = Math.floor(Math.log(bytes) / Math.log(TARIFF.TB));

        return `${parseFloat(
            (bytes / Math.pow(TARIFF.TB, i)).toFixed(dm)
        )} ${TARIFF.getUnits(i)}`;
    },

    getUnit: (value, customLang) => {
        return value < TARIFF.TB
            ? store.lang.t('GB', customLang)
            : store.lang.t('TB', customLang);
    },

    getSize: (value) => (value < TARIFF.TB ? value : value / TARIFF.TB),

    getPriceWithDiscount: (priceWithoutDiscount, discount) => {
        return priceWithoutDiscount - discount;
    },

    getCostPerDay: (price, period) => (price / period).toFixed(2),

    getCostPerMonth: (price, period) =>
        (price / TARIFF.getPeriodInMonth(period)).toFixed(2),

    getPeriodInMonth: (period) => parseInt(period / TARIFF.DAYS_IN_MONTH),

    getSizeAndUnit: (value) => {
        return `${TARIFF.getSize(value)} ${TARIFF.getUnit(value)}`;
    },

    getProductName: (name) => {
        return (
            name +
            ' ' +
            TARIFF.getSize(store.forms.tariffPlanForm.tariffPlan) +
            ' ' +
            TARIFF.getUnit(store.forms.tariffPlanForm.tariffPlan, 'en')
        ).toUpperCase();
    },

    getPaySystemName(id) {
        return Object.keys(this.paySystems).find((paySystem) => {
            return this.paySystems[paySystem].id === id;
        });
    },

    getColor: ({ value, isTrial = false, isExpired = false }) => {
        if (isTrial) return '787E83';
        if (isExpired) return 'FA5658';

        switch (value) {
            case 16:
                return 'info';
            case 128:
                return 'success-secondary';
            case 512:
                return 'primary';
            case 1024:
                return 'warning';
            case (2048, 3072):
                return 'error-secondary';
            default:
                return '';
        }
    },
};

export default TARIFF;
