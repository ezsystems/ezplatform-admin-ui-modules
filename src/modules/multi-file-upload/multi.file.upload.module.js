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

        this._itemsUploaded = [];

        if (!props.itemsToUpload || !props.itemsToUpload.length) {
            popupVisible = false;
        }

        this.state = {
            popupVisible,
            itemsToUpload: props.itemsToUpload,
            allowDropOnWindow: true
        };
    }

    componentDidMount() {
        this.manageDropEvent();
    }

    componentDidUpdate() {
        this.manageDropEvent();
    }

    /**
     * Attaches `drop` and `dragover` events handlers on window
     *
     * @method manageDropEvent
     * @memberof MultiFileUploadModule
     */
    manageDropEvent() {
        if (!this.state.popupVisible && !this.state.itemsToUpload.length) {
            this._handleDropOnWindow = this.handleDropOnWindow.bind(this);

            window.addEventListener('drop', this._handleDropOnWindow, false);
            window.addEventListener('dragover', this.preventDefaultAction, false);
        }
    }

    /**
     * Hides multi file upload popup
     *
     * @method hidePopup
     * @memberof MultiFileUploadModule
     */
    hidePopup() {
        this.setState(state => Object.assign({}, state, {popupVisible: false}));

        if (typeof this.props.onPopupClose === 'function') {
            this.props.onPopupClose(this._itemsUploaded);
        }
    }

    /**
     * Displays multi file upload popup
     *
     * @method showUploadPopup
     * @param {Array} itemsToUpload
     * @memberof MultiFileUploadModule
     */
    showUploadPopup(itemsToUpload) {
        this.setState(state => Object.assign({}, state, {
            popupVisible: true,
            itemsToUpload
        }));
    }

    /**
     * Keeps information about uploaded files.
     * We want to avoid component rerendering so it's stored in an object instance property.
     *
     * @method handleAfterUpload
     * @param {Array} itemsUploaded
     * @memberof MultiFileUploadModule
     */
    handleAfterUpload(itemsUploaded) {
        this._itemsUploaded = itemsUploaded;
    }

    /**
     * Handles dropping on window.
     * When file/files are dropped onto window the `drop` and `dragover` event handlers are removed.
     *
     * @method handleDropOnWindow
     * @param {Event} event
     * @memberof MultiFileUploadModule
     */
    handleDropOnWindow(event) {
        this.preventDefaultAction(event);

        if (!this.state.allowDropOnWindow) {
            return;
        }

        window.removeEventListener('drop', this._handleDropOnWindow, false);
        window.removeEventListener('dragover', this.preventDefaultAction, false);

        this.setState(state => {
            return Object.assign({}, state, {
                itemsToUpload: this.proccessUploadedFiles(event) || state.itemsToUpload,
                popupVisible: true,
                allowDropOnWindow: false
            });
        });
    }

    /**
     * Processes uploaded files and generates an unique file id
     *
     * @param {Event} event
     * @returns {undefined|Array}
     * @memberof MultiFileUploadModule
     */
    proccessUploadedFiles(event) {
        let target;

        if (event.nativeEvent) {
            target = event.nativeEvent.dataTransfer || event.nativeEvent.target;
        } else {
            target = event.dataTransfer;
        }

        if (!target) {
            return;
        }

        return [...target.files].map(file => ({
            id: (Math.floor(Math.random() * Date.now())),
            file
        }));
    }

    /**
     * Prevents default event actions
     *
     * @method preventDefaultAction
     * @param {Event} event
     * @memberof MultiFileUploadModule
     */
    preventDefaultAction(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    /**
     * Renders multi file upload button,
     * that allows to open multi file upload popup.
     *
     * @method renderBtn
     * @returns {null|Element}
     * @memberof MultiFileUploadModule
     */
    renderBtn() {
        if (!this.props.withUploadButton) {
            return null;
        }

        return (
            <div className="m-mfu__btn--upload" onClick={this.showUploadPopup.bind(this, [])}>
                <IconComponent icon={UPLOAD} height={20} />
                {this.props.uploadBtnLabel}
            </div>
        );
    }

    /**
     * Renders a popup
     *
     * @method renderPopup
     * @returns {null|Element}
     * @memberof MultiFileUploadModule
     */
    renderPopup() {
        if (!this.state.popupVisible) {
            return null;
        }

        const attrs = Object.assign({}, this.props, {
            visible: true,
            onClose: this.hidePopup.bind(this),
            itemsToUpload: this.state.itemsToUpload,
            onAfterUpload: this.handleAfterUpload.bind(this),
            preventDefaultAction: this.preventDefaultAction,
            proccessUploadedFiles: this.proccessUploadedFiles
        })

        return <UploadPopupComponent {...attrs} />;
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
    uploadedItemsListTitle: PropTypes.string,
    withUploadButton: PropTypes.bool
};

MultiFileUploadModule.defaultProps = {
    createFileStruct,
    publishFile,
    deleteFile,
    checkCanUpload,
    itemsToUpload: [],
    withUploadButton: true,
    uploadBtnLabel: 'Upload sub-items',
    popupTitle: 'Multi-file upload',
    dropActionMessage: 'Drag and drop your files on browser window or upload them',
    maxFileSizeMessage: 'Max file size:',
    uploadedItemsListTitle: 'Uploaded'
};
