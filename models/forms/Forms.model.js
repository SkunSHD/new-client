import { types, destroy } from 'mobx-state-tree';
// Models
import ChangeFirstNameFormModel from '_core/models/forms/submodels/ChangeFirstNameForm.model';
import ChangePasswordFormModel from '_core/models/forms/submodels/ChangePasswordForm.model';
import ChangePhoneStep1FormModel from '_core/models/forms/submodels/ChangePhoneStep1Form.model';
import ChangePhoneStep2FormModel from '_core/models/forms/submodels/ChangePhoneStep2Form.model';
import RecoverPasswordStep1FormModel from '_core/models/forms/submodels/RecoverPasswordStep1Form.model';
import DeleteAccountStep1FormModel from '_core/models/forms/submodels/DeleteAccountStep1Form.model';
import DeleteAccountStep2FormModel from '_core/models/forms/submodels/DeleteAccountStep2Form.model';
import SignInFormModel from '_core/models/forms/submodels/SignInForm.model';
import SignUpStep1FormModel from '_core/models/forms/submodels/SignUpStep1Form.model';
import TariffPlanFormModel from '_core/models/forms/submodels/TariffPlanForm.model';
import TariffPaymentFormModel from '_core/models/forms/submodels/TariffPaymentForm.model';
import AdminInfoFormModel from '_core/models/forms/submodels/admin/AdminInfoForm.model';
import VoucherFormModel from '_core/models/forms/submodels/VoucherForm.model';
import UpdateUserLicenseFormModel from '_core/models/forms/submodels/admin/UpdateUserLicenseForm.model';
import UpdateUserSettingsFormModel from '_core/models/forms/submodels/admin/UpdateUserSettingsForm.model';
import RebillUpdateFormModel from '_core/models/forms/submodels/RebillUpdateForm.model';
import AcceptConditionFormModel from '_core/models/forms/submodels/AcceptConditionForm.model';
import ChangeEmailFormModel from '_core/models/forms/submodels/ChangeEmailForm.model';
import ChangeFlagsFormModel from '_core/models/forms/submodels/ChangeFlagsForm.model';
import ConfirmationCodeWithPhoneForm from '_core/models/forms/submodels/ConfirmationCodeWithPhoneForm.model';
import ReceiveFilesFormModel from '_core/models/forms/submodels/ReceiveFilesForm.model';
import SharedLinkFormModel from '_core/models/forms/submodels/SharedLinkForm.model';
import CreateDirFormModel from '_core/models/forms/submodels/fs/CreateDirForm.model';
import RenameNodeFormModel from '_core/models/forms/submodels/fs/RenameNodeForm.model';
import OrderTariffFormModel from '_core/models/forms/submodels/OrderTariffForm.model';

const FormsModel = {
    changeFirstNameForm: types.maybe(ChangeFirstNameFormModel),
    changePasswordForm: types.maybe(ChangePasswordFormModel),
    changePhoneStep1Form: types.maybe(ChangePhoneStep1FormModel),
    changePhoneStep2Form: types.maybe(ChangePhoneStep2FormModel),
    recoverPasswordStep1Form: types.maybe(RecoverPasswordStep1FormModel),
    signInForm: types.maybe(SignInFormModel),
    deleteAccountStep1Form: types.maybe(DeleteAccountStep1FormModel),
    deleteAccountStep2Form: types.maybe(DeleteAccountStep2FormModel),
    signUpStep1Form: types.maybe(SignUpStep1FormModel),
    tariffPlanForm: types.maybe(TariffPlanFormModel),
    tariffPaymentForm: types.maybe(TariffPaymentFormModel),
    adminInfoForm: types.maybe(AdminInfoFormModel),
    voucherForm: types.maybe(VoucherFormModel),
    updateUserLicenseForm: types.maybe(UpdateUserLicenseFormModel),
    updateUserSettingsForm: types.maybe(UpdateUserSettingsFormModel),
    rebillUpdateForm: types.maybe(RebillUpdateFormModel),
    acceptConditionForm: types.maybe(AcceptConditionFormModel),
    changeEmailForm: types.maybe(ChangeEmailFormModel),
    changeFlagsForm: types.maybe(ChangeFlagsFormModel),
    confirmationCodeWithPhone: types.maybe(ConfirmationCodeWithPhoneForm),
    receiveFilesForm: types.maybe(ReceiveFilesFormModel),
    createDirForm: types.maybe(CreateDirFormModel),
    sharedLinkForm: types.maybe(SharedLinkFormModel),
    renameNodeForm: types.optional(RenameNodeFormModel, {}),
    orderTariffForm: types.maybe(OrderTariffFormModel),
};

// model mutations goes only in actions
const actions = (self) => {
    return {
        create({ formName, fields }) {
            if (self[formName]) {
                return self.update({
                    formName,
                    updateFields: { ...fields },
                });
            }

            self[formName] = { ...fields };
        },

        update({ formName, updateFields }) {
            const form = self[formName];

            Object.keys(updateFields).forEach((fieldName) => {
                if (form[fieldName] !== undefined)
                    form[fieldName] = updateFields[fieldName];
            });
        },

        remove() {
            Object.keys(self).forEach((form) => {
                if (self[form] !== undefined) {
                    return destroy(self[form]);
                }
            });
        },

        removeByName(formName) {
            if (self[formName] !== undefined) {
                return destroy(self[formName]);
            }
        },
    };
};

export default types.model('FormsModel', FormsModel).actions(actions);
