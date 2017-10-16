import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ProgressBarComponent from '../progress-bar/progress.bar.component';
import { fileSizeToString } from '../../helpers/text.helper';
import IconComponent from '../../../common/icon/icon.component';
import { FILE } from '../../../common/icon/defs/file.json';
import { FILE_PDF } from '../../../common/icon/defs/file-pdf.json';
import { FILE_VIDEO } from '../../../common/icon/defs/file-video.json';
import { FILE_IMAGE } from '../../../common/icon/defs/file-image.json';
import { CIRCLE_CLOSE } from '../../../common/icon/defs/circle-close.json';
import { EDIT } from '../../../common/icon/defs/edit.json';
import { TRASH } from '../../../common/icon/defs/trash.json';

import './css/upload.item.component.css';

export default class UploadItemComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uploading: false,
            uploaded: props.isUploaded,
            disallowed: false,
            disallowedType: false,
            disallowedSize: false,
            aborted: false,
            failed: false,
            deleted: false,
            progress: 0,
            xhr: null,
            struct: props.data.struct || null,
            totalSize: fileSizeToString(props.data.file.size),
            uploadedSize: '0'
        };
    }

    componentDidMount() {
        const {
            data,
            adminUiConfig,
            parentInfo,
            createFileStruct,
            isUploaded,
            checkCanUpload,
        } = this.props;

        if (isUploaded) {
            return;
        }

        const config = adminUiConfig.multiFileUpload;
        const callbacks = {
            fileTypeNotAllowedCallback: this.handleFileTypeNotAllowed.bind(this),
            fileSizeNotAllowedCallback: this.handleFileSizeNotAllowed.bind(this)
        };

        if (!checkCanUpload(data.file, parentInfo, config, callbacks)) {
            this.setState(state => Object.assign({}, state, {
                uploading: false,
                disallowed: true,
                uploaded: false,
                aborted: false,
                failed: true
            }));

            return;
        }

        createFileStruct(data.file, {
            parentInfo,
            config: adminUiConfig,
        }).then(this.initPublishFile.bind(this, adminUiConfig));
    }

    /**
     * Initializes file-based content publishing
     *
     * @method initPublishFile
     * @param {Object} restInfo config object containing token and siteaccess properties
     * @param {Object} struct
     * @memberof UploadItemComponent
     */
    initPublishFile({token, siteaccess}, struct) {
        this.props.publishFile(
            {struct, token, siteaccess},
            {
                upload: {
                    onabort: this.handleUploadAbort.bind(this),
                    onerror: this.handleUploadError.bind(this),
                    onload: this.handleUploadLoad.bind(this),
                    onprogress: this.handleUploadProgress.bind(this)
                },
                onloadstart: this.handleLoadStart.bind(this),
                onerror: this.handleUploadError.bind(this),
            },
            this.handleUploadEnd.bind(this));
    }

    /**
     * Handles the case when a file cannot be upload because of file type
     *
     * @method handleFileTypeNotAllowed
     * @memberof UploadItemComponent
     */
    handleFileTypeNotAllowed() {
        this.setState(state => Object.assign({}, state, {
            uploading: false,
            disallowed: true,
            disallowedType: true,
            disallowedSize: false,
            uploaded: false,
            aborted: false,
            failed: true
        }));
    }

    /**
     * Handles the case when a file cannot be upload because of file size
     *
     * @method handleFileSizeNotAllowed
     * @memberof UploadItemComponent
     */
    handleFileSizeNotAllowed() {
        this.setState(state => Object.assign({}, state, {
            uploading: false,
            disallowed: true,
            disallowedType: false,
            disallowedSize: true,
            uploaded: false,
            aborted: false,
            failed: true
        }));
    }

    /**
     * Handles the upload load start event
     *
     * @method handleLoadStart
     * @param {Event} event
     * @memberof UploadItemComponent
     */
    handleLoadStart(event) {
        this.setState(state => Object.assign({}, state, {
            uploading: true,
            disallowed: false,
            uploaded: false,
            aborted: false,
            failed: false,
            xhr: event.target
        }));
    }

    /**
     * Handles the upload abort event
     *
     * @method handleUploadAbort
     * @memberof UploadItemComponent
     */
    handleUploadAbort() {
        this.setState(state => Object.assign({}, state, {
            uploading: false,
            disallowed: false,
            uploaded: false,
            aborted: true,
            failed: false
        }));
    }

    /**
     * Handles the upload error event
     *
     * @method handleUploadError
     * @memberof UploadItemComponent
     */
    handleUploadError() {
        this.setState(state => Object.assign({}, state, {
            uploading: false,
            disallowed: state.disallowed,
            uploaded: false,
            aborted: state.aborted,
            failed: true
        }));
    }

    /**
     * Handles the upload load event
     *
     * @method handleUploadLoad
     * @memberof UploadItemComponent
     */
    handleUploadLoad() {
        this.setState(state => Object.assign({}, state, {
            uploading: false,
            disallowed: false,
            uploaded: true,
            aborted: false,
            failed: false
        }));
    }

    /**
     * Handles the upload progress event
     *
     * @method handleUploadProgress
     * @param {Event} event
     * @memberof UploadItemComponent
     */
    handleUploadProgress(event) {
        const fraction = event.loaded / event.total;
        const progress = parseInt(fraction * 100, 10);

        this.setState(state => Object.assign({}, state, {
            uploadedSize: fileSizeToString(fraction * parseInt(this.props.data.file.size, 10)),
            uploading: true,
            disallowed: false,
            uploaded: false,
            aborted: false,
            failed: false,
            progress
        }))
    }

    /**
     * Handles the upload end event
     *
     * @method handleUploadEnd
     * @memberof UploadItemComponent
     */
    handleUploadEnd() {
        this.setState(state => {
            const struct = JSON.parse(state.xhr.response);

            this.props.onAfterUpload(Object.assign({}, this.props.data, {struct}));

            return Object.assign({}, state, {
                struct,
                uploading: false,
                disallowed: false,
                uploaded: true,
                aborted: false,
                failed: false,
            });
        });
    }

    /**
     * Aborts file upload
     *
     * @method abortUploading
     * @memberof UploadItemComponent
     */
    abortUploading() {
        this.state.xhr.abort();
        this.props.onAfterAbort(this.props.data);
    }

    /**
     * Redirects to content edit
     *
     * @method editContent
     * @memberof UploadItemComponent
     */
    editContent() {
        console.log('to:do:editContent');
    }

    /**
     * Deletes a file
     *
     * @method deleteFile
     * @memberof UploadItemComponent
     */
    deleteFile() {
        this.setState(state => Object.assign({}, state, {deleted: true}));
        this.props.deleteFile(this.props.adminUiConfig, this.state.struct, this.handleFileDeleted.bind(this));
    }

    /**
     * Handles the file deleted event
     *
     * @method handleFileDeleted
     * @memberof UploadItemComponent
     */
    handleFileDeleted() {
        this.props.onAfterDelete(this.props.data);
    }

    /**
     * Detects a file type of uploaded file
     *
     * @method detectFileType
     * @memberof UploadItemComponent
     * @returns {String}
     */
    detectFileType() {
        const filetype = this.props.data.file.type;

        if (filetype.includes('/pdf')) {
            return FILE_PDF;
        } else if (filetype.includes('video/')) {
            return FILE_VIDEO;
        } else if (filetype.includes('image/')) {
            return FILE_IMAGE;
        }

        return FILE;
    }

        /**
     * Renders a progress bar
     *
     * @method renderProgressBar
     * @memberof UploadItemComponent
     * @returns {null|Element}
     */
    renderProgressBar() {
        const {uploaded, aborted, progress, totalSize, uploadedSize} = this.state;

        if (this.props.isUploaded || uploaded || aborted) {
            return null;
        }

        return <ProgressBarComponent
            progress={progress}
            uploaded={uploadedSize}
            total={totalSize} />;
    }

    /**
     * Renders an error message
     *
     * @method renderErrorMessage
     * @memberof UploadItemComponent
     * @returns {null|Element}
     */
    renderErrorMessage() {
        const {uploaded, aborted, disallowed, disallowedType, disallowedSize, failed, uploading} = this.state;
        const isError = !uploaded && !aborted && !disallowed && failed && !uploading;
        let msg = 'Cannot upload file';

        if (disallowedType) {
            msg = 'File type is not allowed';
        }

        if (disallowedSize) {
            msg = 'File size is not allowed';
        }

        return isError ? <div className="c-upload-list-item__message--error">{ msg }</div> : null;
    }

    /**
     * Renders an error message
     *
     * @method renderErrorMessage
     * @memberof UploadItemComponent
     * @returns {null|Element}
     */
    renderSuccessMessage() {
        const {uploaded, aborted, disallowed, failed, uploading} = this.state;
        const isSuccess = uploaded && !aborted && !disallowed && !failed && !uploading;

        return isSuccess ? <div className="c-upload-list-item__message--success">Uploaded</div> : null;
    }

    /**
     * Renders an abort upload button
     *
     * @method renderAbortBtn
     * @memberof UploadItemComponent
     * @returns {null|Element}
     */
    renderAbortBtn() {
        const {uploaded, aborted, disallowed, failed, uploading} = this.state;
        const canAbort = !uploaded && !aborted && !disallowed && !failed && uploading;

        if (!canAbort) {
            return null;
        }

        return (
            <div className="c-upload-list-item__action--abort" onClick={this.abortUploading.bind(this)} title="Abort">
                <IconComponent icon={CIRCLE_CLOSE} height={20} />
            </div>
        );
    }

    /**
     * Renders an edit content button
     *
     * @method renderEditBtn
     * @memberof UploadItemComponent
     * @returns {null|Element}
     */
    renderEditBtn() {
        const {uploaded, aborted, disallowed, failed, uploading} = this.state;
        const canEdit = this.props.isUploaded || (uploaded && !aborted && !disallowed && !failed && !uploading);

        if (!canEdit) {
            return null;
        }

        return (
            <div className="c-upload-list-item__action--edit" onClick={this.editContent.bind(this)} title="Edit">
                <IconComponent icon={EDIT} height={20} />
            </div>
        );
    }

    /**
     * Renders an delete content button
     *
     * @method renderDeleteBtn
     * @memberof UploadItemComponent
     * @returns {null|Element}
     */
    renderDeleteBtn() {
        const {uploaded, aborted, disallowed, failed, uploading} = this.state;
        const canDelete = this.props.isUploaded || (uploaded && !aborted && !disallowed && !failed && !uploading);

        if (!canDelete) {
            return null;
        }

        return (
            <div className="c-upload-list-item__action--delete" onClick={this.deleteFile.bind(this)} title="Delete">
                <IconComponent icon={TRASH} height={20} />
            </div>
        );
    }

    render() {
        if (this.state.deleted) {
            return null;
        }

        return (
            <div className="c-upload-list-item">
                <div className="c-upload-list-item__icon">
                    <IconComponent icon={this.detectFileType()} height={30} width={20} />
                </div>
                <div className="c-upload-list-item__meta">
                    <div className="c-upload-list-item__name">{this.props.data.file.name}</div>
                    <div className="c-upload-list-item__size">{this.state.uploaded ? this.state.totalSize : ''}</div>
                </div>
                <div className="c-upload-list-item__info">
                    {this.renderErrorMessage()}
                    {this.renderSuccessMessage()}
                    {this.renderProgressBar()}
                </div>
                <div className="c-upload-list-item__actions">
                    {this.renderAbortBtn()}
                    {this.renderEditBtn()}
                    {this.renderDeleteBtn()}
                </div>
            </div>
        );
    }
}

UploadItemComponent.propTypes = {
    data: PropTypes.object.isRequired,
    onAfterUpload: PropTypes.func.isRequired,
    onAfterAbort: PropTypes.func.isRequired,
    onAfterDelete: PropTypes.func.isRequired,
    isUploaded: PropTypes.bool.isRequired,
    createFileStruct: PropTypes.func.isRequired,
    publishFile: PropTypes.func.isRequired,
    deleteFile: PropTypes.func.isRequired,
    checkCanUpload: PropTypes.func.isRequired,
    adminUiConfig: PropTypes.shape({
        multiFileUpload: PropTypes.shape({
            defaultMappings: PropTypes.arrayOf(PropTypes.object).isRequired,
            fallbackContentType: PropTypes.object.isRequired,
            locationMappings: PropTypes.arrayOf(PropTypes.object).isRequired,
            maxFileSize: PropTypes.number.isRequired
        }).isRequired,
        token: PropTypes.string.isRequired,
        siteaccess: PropTypes.string.isRequired
    }).isRequired,
    parentInfo: PropTypes.shape({
        contentTypeIdentifier: PropTypes.string.isRequired,
        contentTypeId: PropTypes.number.isRequired,
        locationPath: PropTypes.string.isRequired,
        language: PropTypes.string.isRequired
    }).isRequired,
};

UploadItemComponent.defaultProps = {
    isUploaded: false
};
