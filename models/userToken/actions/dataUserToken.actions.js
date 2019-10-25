import { setValues } from '_core/utils/fs.utils';

export default (self) => {
    return {
        create(data) {
            self.saveToStore(data);
            self.setToken(data);
        },

        createSession(data) {
            self.saveToStore(data);
            self.setSessionToken(data);
        },

        saveToStore(updateFields) {
            setValues(self, updateFields);
        },

        setToken(data) {
            localStorage.setItem('token', data.token);
            self.setRefreshToken(data.refresh_token);
        },

        setSessionToken(data) {
            sessionStorage.setItem('token', data.token);
            self.setSessionRefreshToken(data.refresh_token);
        },

        setRefreshToken(refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        },

        setSessionRefreshToken(refreshToken) {
            sessionStorage.setItem('refreshToken', refreshToken);
        },

        setSessionSudosuToken(token) {
            sessionStorage.setItem('sudosuToken', token);
        },

        setSessionSudosuRefreshToken(refreshToken) {
            sessionStorage.setItem('sudosuRefreshToken', refreshToken);
        },

        remove() {
            self.refresh_token = null;
            self.token = null;

            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');

            sessionStorage.removeItem('token');
            sessionStorage.removeItem('refreshToken');
        },

        removeSudosuTokens() {
            sessionStorage.removeItem('sudosuToken');
            sessionStorage.removeItem('sudosuRefreshToken');
        },
    };
};
