// Utils
import history from '_core/utils/history.utils';
import { deleteEmptyPathSections } from '_core/utils/string.utils';

export default (self) => {
    return {
        setNextPathUrl(url) {
            self.nextPathUrl = url;
        },

        clearNextPathUrl() {
            self.nextPathUrl = undefined;
        },

        goToPage({ url, search, state }) {
            history.push({
                pathname: deleteEmptyPathSections(url),
                ...(search && { search }),
                ...(state && { state }),
            });
        },

        openNewTab({ url, origin = window.origin, target = '_blank' }) {
            window.open(`${origin}${url}`, target);
        },

        setRouteName(name) {
            self.routeName = name;
        },

        setRouteUrl(pathname) {
            self.routeUrl = pathname;
        },

        setLocationState(state) {
            self.locationState = state;
        },

        updateRouteData(props) {
            self.setRouteName(props.name);
            self.setRouteUrl(props.location.pathname);
            // TODO: Check if I can remove [this.props.history.location.state || {}] everywhere
            self.setLocationState(props.location.state);
        },

        setEnvInfo(info) {
            self.envInfo = info;
        },

        goBack() {
            history.goBack();
        },

        setFexFilesCount(count) {
            self.fexFilesCount = count;
        },

        setSessionId(
            id = new Date().getTime() +
                '.' +
                Math.random()
                    .toString(36)
                    .substring(5)
        ) {
            self.sessionId = id;
        },
    };
};
