const {
    NODE_ENV,
    PUBLIC_URL,
    REACT_APP_PROJECT_NAME,
    REACT_APP_DEVICE,
    REACT_APP_API_URL,
    REACT_APP_ENV_MODE,
    REACT_APP_DEBUG_STORE,
    REACT_APP_RECAPTCHA_SITE_KEY,
    REACT_APP_RECAPTCHA_API_URL,
} = process.env;

export default {
    NODE_ENV: NODE_ENV,
    PUBLIC_URL: PUBLIC_URL,
    PROJECT_NAME: REACT_APP_PROJECT_NAME,
    DEVICE: REACT_APP_DEVICE,
    IS_MOBILE: REACT_APP_DEVICE === 'mobile',
    CONTAINER_HOST_ADDR:
        window.CONTAINER_HOST_ADDR === ''
            ? 'http://0.0.0.0:8000'
            : window.CONTAINER_HOST_ADDR,
    API_URL: REACT_APP_API_URL,
    MODE: REACT_APP_ENV_MODE,
    DEV_MODE: NODE_ENV === 'development',
    PROD_MODE: NODE_ENV === 'production' && REACT_APP_ENV_MODE === 'production',
    DISPLAY_GA:
        NODE_ENV === 'production' && REACT_APP_ENV_MODE === 'production',
    DISPLAY_GOOGLE_ADS: NODE_ENV === 'production',
    DEBUG_STORE: REACT_APP_DEBUG_STORE === 'true',
    RECAPTCHA_SITE_KEY: REACT_APP_RECAPTCHA_SITE_KEY,
    RECAPTCHA_API_URL: REACT_APP_RECAPTCHA_API_URL,
    FEX_URL: `${window.location.protocol}//${window.location.host}`,
};
