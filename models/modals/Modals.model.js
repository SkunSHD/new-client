import { types } from 'mobx-state-tree';
// Store
import store from '_core/store';
// Models
import ManageTreeModalVolatile from '_core/models/modals/volatile/ManageTreeModal.volatile';
import GalleryModalVolatile from '_core/models/modals/volatile/GalleryModal.volatile';
import VideoPlayerModalVolatile from '_core/models/modals/volatile/VideoPlayerModal.volatile';
import AudioPlayerModalVolatile from '_core/models/modals/volatile/AudioPlayerModal.volatile';
import RenameNodeModalVolatile from '_core/models/modals/volatile/RenameNodeModal.volatile';
import DeleteAccountModalVolatile from '_core/models/modals/volatile/DeleteAccountModal.volatile';
import ChangeFirstNameModalVolatile from '_core/models/modals/volatile/ChangeFirstNameModal.volatile';
import ChangePasswordModalVolatile from '_core/models/modals/volatile/ChangePasswordModal.volatile';
import ChangeEmailModalVolatile from '_core/models/modals/volatile/ChangeEmailModal.volatile';
import ChangePhoneModalVolatile from '_core/models/modals/volatile/ChangePhoneModal.volatile';
import CreateDirModalVolatile from '_core/models/modals/volatile/CreateDirModal.volatile';
import AuthModalVolatile from '_core/models/modals/volatile/AuthModal.volatile';
import PDFModalVolatile from '_core/models/modals/volatile/PDFModal.volatile';
import VideoAdsModalVolatile from '_core/models/modals/volatile/VideoAdsModal.volatile';
import SharedModalVolatile from '_core/models/modals/volatile/SharedModal.volatile';
// Mobile
import AccountWarningInfoModalVolatile from '_core/models/modals/volatile/AccountWarningInfoModal.volatile';

const ModalsModel = {
    openedId: types.optional(types.string, ''),

    manageTreeModal: types.optional(ManageTreeModalVolatile, {}),
    galleryModal: types.optional(GalleryModalVolatile, {}),
    videoPlayerModal: types.optional(VideoPlayerModalVolatile, {}),
    audioPlayerModal: types.optional(AudioPlayerModalVolatile, {}),
    renameNodeModal: types.optional(RenameNodeModalVolatile, {}),
    deleteAccountModal: types.optional(DeleteAccountModalVolatile, {}),
    changeFirstNameModal: types.optional(ChangeFirstNameModalVolatile, {}),
    changePasswordModal: types.optional(ChangePasswordModalVolatile, {}),
    changeEmailModal: types.optional(ChangeEmailModalVolatile, {}),
    changePhoneModal: types.optional(ChangePhoneModalVolatile, {}),
    createDirModal: types.optional(CreateDirModalVolatile, {}),
    authModal: types.optional(AuthModalVolatile, {}),
    pdfModal: types.optional(PDFModalVolatile, {}),
    videoAdsModal: types.optional(VideoAdsModalVolatile, {}),
    sharedModal: types.optional(SharedModalVolatile, {}),
    // Mobile
    accountWarningInfoModal: types.optional(
        AccountWarningInfoModalVolatile,
        {}
    ),
};

const views = (self) => ({
    get hasOpened() {
        return self.openedId !== '';
    },
});

const actions = (self) => ({
    open({ id, actionType = '' }) {
        if (!!actionType) store.fs.manage.setActionType(actionType);

        self.openedId = id;
    },
    close: () => {
        self.openedId = '';

        store.fs.manage.resetSelected();
    },
});

export default types
    .model('ModalsModel', ModalsModel)
    .views(views)
    .actions(actions);
