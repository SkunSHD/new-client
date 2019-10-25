const withPermissions = (permissions) => {
    return (Component) => {
        Component.permissions = {
            onlyForAuth: false,
            onlyForUnAuth: false,
            redirectPath: '/files',
            ...permissions,
        };
        return Component;
    };
};

export default withPermissions;
