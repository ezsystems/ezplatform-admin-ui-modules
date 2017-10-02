import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ProgressBarComponent from '../progress-bar/progress.bar.component';
import IconComponent from '../icon/icon.component';
import { fileSizeToString } from '../../helpers/text.helper';
import { 
    FILE_DEFAULT, 
    FILE_PDF,
    FILE_VIDEO,
    FILE_IMAGE,
    CIRCLE_CLOSE, 
    EDIT, 
    TRASH 
} from '../icon/icons.constants.json';

import './css/upload.item.component.css';

export default class UploadItemComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uploading: false,
            uploaded: false,
            disallowed: false,
            disallowedType: false,
            disallowedSize: false,
            aborted: false,
            failed: false,
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

        console.log('componentDidMount', adminUiConfig, parentInfo);

        if (!checkCanUpload(data.file, parentInfo, adminUiConfig.multiFileUpload, {
                fileTypeNotAllowedCallback: this.handleFileTypeNotAllowed.bind(this), 
                fileSizeNotAllowedCallback: this.handleFileSizeNotAllowed.bind(this)
            })) {
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

    initPublishFile(restInfo, struct) {
        this.props.publishFile({
            struct,
            token: restInfo.token,
            siteaccess: restInfo.siteaccess
        }, {
            upload: {
                onabort: this.handleUploadAbort.bind(this),
                onerror: this.handleUploadError.bind(this),
                onload: this.handleUploadLoad.bind(this),
                onprogress: this.handleUploadProgress.bind(this)
            },
            onloadstart: this.handleLoadStart.bind(this),
            onerror: this.handleUploadError.bind(this),
        }, this.handleUploadEnd.bind(this));
    }

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

    handleUploadAbort() { 
        this.setState(state => Object.assign({}, state, {
            uploading: false,
            disallowed: false,
            uploaded: false,
            aborted: true,
            failed: false
        }));
    }

    handleUploadError() { 
        this.setState(state => Object.assign({}, state, {
            uploading: false,
            disallowed: state.disallowed,
            uploaded: false,
            aborted: state.aborted,
            failed: true
        }));
    }

    handleUploadLoad() {
        this.setState(state => Object.assign({}, state, {
            uploading: false,
            disallowed: false,
            uploaded: true,
            aborted: false,
            failed: false
        }));
    }

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

    handleUploadEnd() {        
        this.setState(state => {
            const struct = JSON.parse(state.xhr.response);

            this.props.onAfterUpload(Object.assign({}, this.props.data, {struct}));
            
            return Object.assign({}, state, {struct});
        });
    }

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

    renderSuccessMessage() {
        const {uploaded, aborted, disallowed, failed, uploading} = this.state;
        const isSuccess = uploaded && !aborted && !disallowed && !failed && !uploading;

        return isSuccess ? <div className="c-upload-list-item__message--success">Uploaded</div> : null;
    }

    renderAbortMessage() {
        const {uploaded, aborted, disallowed, uploading} = this.state;
        const isAbort = !uploaded && aborted && !disallowed && !uploading;

        if (!isAbort) {
            return null;
        }

        if (typeof this.props.onAfterAbort === 'function') {
            this.props.onAfterAbort(this.props.data);
        }
        
        return <div className="c-upload-list-item__message--abort">Aborted</div>;
    }

    abortUploading() {
        this.state.xhr.abort();
    }

    editContent() {
        console.log('editContent');
    }

    deleteFile() {
        this.props.deleteFile(this.props.adminUiConfig, this.state.struct, this.handleFileDeleted.bind(this));
    }

    handleFileDeleted() {
        this.props.onAfterDelete(this.props.data);
    }

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

    detectFileType() {
        const filetype = this.props.data.file.type;

        if (filetype.includes('/pdf')) {
            return FILE_PDF;
        } else if (filetype.includes('video/')) {
            return FILE_VIDEO;
        } else if (filetype.includes('image/')) {
            return FILE_IMAGE;
        }

        return FILE_DEFAULT;
    }

    render() {
        return (
            <div className="c-upload-list-item">
                <div className="c-upload-list-item__icon">
                    <IconComponent icon={this.detectFileType()} height={20} />
                </div>
                <div className="c-upload-list-item__name">{this.props.data.file.name}</div>
                <div className="c-upload-list-item__info">
                    {this.renderErrorMessage()}
                    {this.renderSuccessMessage()}
                    {this.renderAbortMessage()}
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
    onItemRemove: PropTypes.func,
    onItemEdit: PropTypes.func,
    onCancelUpload: PropTypes.func,
    onAfterUpload: PropTypes.func.isRequired,
    onAfterAbort: PropTypes.func.isRequired,
    onAfterDelete: PropTypes.func.isRequired,
    isUploaded: PropTypes.bool.isRequired,
    createFileStruct: PropTypes.func,
    publishFile: PropTypes.func,
    deleteFile: PropTypes.func,
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
    isUploaded: false,
    onAfterUpload: () => true,
    onAfterAbort: () => true,
    onAfterDelete: () => true,
};