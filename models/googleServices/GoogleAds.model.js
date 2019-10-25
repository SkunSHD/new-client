import { types } from 'mobx-state-tree';
// Utils
import env from '_core/utils/env.utils';
import { $ } from '_core/utils/dom.utils';

const volatile = (self) => {
    return {
        scriptPromise: null,
        isEnable: false,
    };
};

const actions = (self) => {
    return {
        enable(isEnable) {
            if (!env.DISPLAY_GOOGLE_ADS || self.isEnable === isEnable) return;

            self.isEnable = isEnable;
        },
        addScript() {
            const adScript = document.createElement('script');
            self.scriptPromise = new Promise(
                (resolve) => (adScript.onload = resolve)
            );
            adScript.id = 'google-ads-sdk';
            adScript.src =
                '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
            adScript.async = true;
            document.body.appendChild(adScript);
        },
        removeScript() {
            document.body.removeChild($('#google-ads-sdk'));
        },
        push() {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        },
    };
};

export default types
    .model('GoogleAdsModel')
    .volatile(volatile)
    .actions(actions);
