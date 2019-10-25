import React from 'react';
// Store
import store from '_core/store';
// Utils
import ERROR from '_core/utils/error.utils';
import { success, warning } from '_core/utils/alerts.utils';
// Components
import T from '_core/components/elements/T';
import Spinner from '_core/components/elements/Spinner';

export default (self) => {
    return {
        success({ id = '', msg = '' }) {
            store.alerts.create({
                id: `${id.toString()}Success`,
                theme: 'success',
                place: 'header',
                body: <T>{success[msg]}</T>,
            });
        },

        warning({ id = '', msg = '' }) {
            store.alerts.create({
                id: `${id.toString()}Warning`,
                theme: 'warning',
                place: 'header',
                body: <T>{warning[msg]}</T>,
            });
        },

        error({ id = '', msg = '' }) {
            store.alerts.create({
                id: `${id.toString()}Error`,
                theme: 'error',
                place: 'header',
                body: <T>{ERROR.renderErrors(msg)}</T>,
            });
        },

        downloadAllFilesStart: (
            msg = 'Downloading your files, please relax'
        ) => {
            return self.create({
                id: 'downloadAllFiles',
                theme: 'warning',
                place: 'header',
                timer: 0,
                closable: false,
                body: (
                    <div className="flex flex_align_center">
                        <span className="margin_right_10">
                            <T>{msg}</T>
                        </span>
                        <Spinner classMod="spinner_size_s" />
                    </div>
                ),
            });
        },

        uploadStart: (msg = 'Uploading your files, please relax') => {
            return self.create({
                id: 'readFilesForUpload',
                theme: 'warning',
                place: 'header',
                timer: 0,
                closable: false,
                body: (
                    <div className="flex flex_align_center">
                        <span className="margin_right_10">
                            <T>{msg}</T>
                        </span>
                        <Spinner classMod="spinner_size_s" />
                    </div>
                ),
            });
        },

        uploadEnd: (status) => {
            let theme, bodyStatus;
            switch (status) {
                case 'canceled':
                case 'rejected':
                case 'fulfilledRejected':
                    bodyStatus = theme = 'error';
                    break;
                case 'paused':
                case 'pendingRejected':
                    theme = 'warning';
                    bodyStatus = 'paused';
                    break;
                case 'fulfilled':
                    bodyStatus = theme = 'success';
                    break;
            }

            store.alerts.create({
                id: 'uploadEnd',
                theme,
                place: 'header',
                body: <T>Upload {bodyStatus}</T>,
            });
        },
    };
};
