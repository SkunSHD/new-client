export default (self) => {
    return {
        removeUserData() {
            self.modals.audioPlayerModal.change(); //remove AudioPlayer (MainLayout)
            self.userToken.remove();
            self.users.remove();
            self.forms.remove();
        },
    };
};
