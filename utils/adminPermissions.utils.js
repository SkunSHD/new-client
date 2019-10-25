// List of available permissions for auth admin:

const ADMIN_PERMISSIONS = {
    list: {
        0: 'watchAllAdmins', // Может видеть список всех админов [0]
        1: 'createNewAdmin', // Может сделать любого пользователя админом [1]
        2: 'updateAdminProfile', // Может обновить профиль любого из админов [2]
        3: 'watchAllUsers', // Может видеть список всех пользователей и каждого из них по отдельности [3]
        4: 'updateLicense', // Может обновить лицензию любого из пользователей [4]
        5: 'sudosu', // Может авторизироваться под выбранным пользователем и зайти в его приложение [5]
        6: 'canViewVouchers', // [6]
        7: 'canEditUser', // [7]
    },

    formatted: (permissions) => {
        return permissions.reduce((acc, permission) => {
            return acc.set(ADMIN_PERMISSIONS.list[permission], permission);
        }, new Map());
    },
};

export default ADMIN_PERMISSIONS;
