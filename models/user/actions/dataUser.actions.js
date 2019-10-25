export default (self) => {
    return {
        update(updateFields) {
            Object.keys(updateFields).forEach((fieldName) => {
                self[fieldName] = updateFields[fieldName];
            });
        },
    };
};
