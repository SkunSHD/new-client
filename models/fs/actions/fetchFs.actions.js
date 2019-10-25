// Utils
import API from '_core/utils/api.utils';
import store from '_core/store';

export default (self) => {
    return {
        fetchTree({ dirId, dirsOnly, page, sort_by } = {}) {
            const shared = store.is.FsPage
                ? ''
                : `share/${store.fs.shared.link}/`;

            return API.get({
                url: `file/${shared}${dirId}`,
                params: {
                    dirs_only: dirsOnly,
                    page,
                    sort_by,
                },
            });
        },

        fetchSharedLink({ link, method, data }) {
            // link = (optional)
            // method = post, put, delete
            // data = {
            //     files_ids,
            //     is_on_time: isOnTime,
            //     expires_at: expiresAt,
            //     set_password: setPassword,
            //     is_anon,
            //     title,
            // };

            return API[method]({
                url: `file/share/${link}`,
                options: {
                    body: data,
                },
            });
        },
    };
};
