// Store
import store from '_core/store';

const units = {
    step: 1024,
    BYTES_IN_GB: 1073741824,

    convertBytesToGb: (bytes, decimals) => {
        return +(bytes / units.BYTES_IN_GB).toFixed(decimals ? decimals : 0);
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
        if (bytes === 0) return `0 ${units.getUnits(0)}`;

        const dm = decimals <= 0 ? 0 : decimals || 2;
        const i = Math.floor(Math.log(bytes) / Math.log(units.step));

        return `${parseFloat(
            (bytes / Math.pow(units.step, i)).toFixed(dm)
        )} ${units.getUnits(i)}`;
    },

    getSizeAndUnit: (value) => {
        return units.convertBytes(value);
    },

    // getUnit: (value) => {
    //     return value < units.step ? store.lang.t('GB') : store.lang.t('TB');
    // },
    //
    // getSize: (value) => {
    //     return value < units.step
    //         ? value
    //         : units.convertBytesToGb(value) / units.step;
    // },

    // convertGbToBytes: (GB) => {
    //     return +(GB * units.BYTES_IN_GB);
    // },
};

export default units;
