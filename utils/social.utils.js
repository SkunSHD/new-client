const SOCIAL = {
    facebook: {
        authId: '405483686589276',
        promoPage: 'https://www.facebook.com/FEX.CLOUD/',
    },
    google: {
        authId:
            '479925466080-drk1rvnv24r6t69gn3fbm717c952ru9m.apps.googleusercontent.com',
    },
    vk: {
        authId: '6424722',
        whiteListCountries: ['ru', 'kz', 'by'],
        promoPage: 'https://vk.com/fex_network',
    },
    telegram: {
        promoPage: 'https://t.me/FEXNETWORK',
    },
    instagram: {
        promoPage: 'https://www.instagram.com/fex_net/',
    },

    isAllowed(socialName, country) {
        return SOCIAL[socialName].whiteListCountries.includes(
            country && country.toLowerCase()
        );
    },
};

export default SOCIAL;
