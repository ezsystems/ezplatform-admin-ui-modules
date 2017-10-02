import React, { Component } from 'react';
import PropTypes from 'prop-types';

import UploadPopupComponent from './components/upload-popup/upload.popup.component';

import IconComponent from './components/icon/icon.component';
import { UPLOAD } from './components/icon/icons.constants.json';

import { createFileStruct, publishFile, deleteFile, checkCanUpload } from './services/multi.file.upload.service';

import './css/multi.file.upload.module.css';

export default class MultiFileUploadModule extends Component {
    constructor(props) {
        super(props);

        let popupVisible = true;

        if (props.asButton) {
            popupVisible = false;
        }

        this.state = {
            popupVisible,
            itemsToUpload: props.itemsToUpload
        };
    }

    hidePopup() {
        this.setState(state => Object.assign({}, state, {popupVisible: false}));

        if (typeof this.props.onPopupClose === 'function') {
            this.props.onPopupClose();
        }
    }

    showUploadPopup(itemsToUpload) {
        this.setState(state => Object.assign({}, state, {
            popupVisible: true,
            itemsToUpload
        }));
    }

    renderPopup() {
        if (!this.state.popupVisible) {
            return null;
        }

        return <UploadPopupComponent 
            visible={true} 
            onClose={this.hidePopup.bind(this)}
            itemsToUpload={this.state.itemsToUpload}
            {...this.props} />;
    }

    renderBtn() {
        if (!this.props.asButton) {
            return null;
        }

        return (
            <div className="m-mfu__btn--upload" onClick={this.showUploadPopup.bind(this)}>
                <IconComponent icon={UPLOAD} height={20} />
                Upload sub-items
            </div>
        );
    }

    render() {
        return (
            <div className="m-mfu">
                {this.renderBtn()}
                {this.renderPopup()}
            </div>
        );
    }
}

MultiFileUploadModule.propTypes = {
    onAfterUpload: PropTypes.func.isRequired,
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
    checkCanUpload: PropTypes.func,
    createFileStruct: PropTypes.func,
    publishFile: PropTypes.func,
    deleteFile: PropTypes.func,
    onPopupClose: PropTypes.func,
    itemsToUpload: PropTypes.array,
    asButton: PropTypes.bool,
    uploadBtnLabel: PropTypes.string,
    popupTitle: PropTypes.string,
    dropActionMessage: PropTypes.string,
    maxFileSizeMessage: PropTypes.string,
    uploadedItemsListTitle: PropTypes.string
};

MultiFileUploadModule.defaultProps = {
    createFileStruct,
    publishFile,
    deleteFile,
    checkCanUpload,
    itemsToUpload: [],
    asButton: false,
    uploadBtnLabel: 'Upload sub-items',
    popupTitle: 'Multi-file upload',
    dropActionMessage: 'Drag and drop your files on browser window or upload them',
    maxFileSizeMessage: 'Max file size:',
    uploadedItemsListTitle: 'Uploaded'
};