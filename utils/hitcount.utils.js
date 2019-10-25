function hitLoad(src) {
    var scripts = document.getElementsByTagName('script');
    var hitScript = document.createElement('script');
    hitScript.onload = hitScript.onerror = function() {
        if (hitScript.parentNode) {
            hitScript.parentNode.removeChild(hitScript);
        }
    };
    hitScript.async = true;
    hitScript.src = src;
    scripts[0].parentNode.insertBefore(hitScript, scripts[0]);
}

export function hitCount(site_id = 7) {
    var cookies_enabled = '';
    document.cookie = 'b=b';
    if (document.cookie) cookies_enabled = '&c=1';

    hitLoad(
        '//c.hit.ua/hit?' +
            'i=' +
            site_id +
            '&g=0&x=3&s=1' +
            cookies_enabled +
            '&t=' +
            new Date().getTimezoneOffset() +
            (window.self != window.top ? '&f=1' : '') +
            (navigator.javaEnabled() ? '&j=1' : '') +
            (typeof window.screen != 'undefined'
                ? '&w=' +
                  window.screen.width +
                  '&h=' +
                  window.screen.height +
                  '&d=' +
                  (window.screen.colorDepth
                      ? window.screen.colorDepth
                      : window.screen.pixelDepth)
                : '') +
            '&r=' +
            escape(document.referrer) +
            '&u=' +
            escape(window.location.href) +
            '&' +
            Math.random()
    );
}
