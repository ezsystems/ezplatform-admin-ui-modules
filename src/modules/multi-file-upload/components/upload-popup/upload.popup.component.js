import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Popup from '../../../common/popup/popup.component';
import DropAreaComponent from '../drop-area/drop.area.component';
import UploadListComponent from '../upload-list/upload.list.component';

import './css/upload.popup.component.css';

export default class UploadPopupModule extends Component {
    constructor(props) {
        super(props);

        this.state = {itemsToUpload: props.itemsToUpload};
    }

    componentWillReceiveProps(props) {
        this.setState(state => {
            const stateItems = state.itemsToUpload.filter(stateItem => !props.itemsToUpload.find(propItem => propItem.id === stateItem.id));

            return Object.assign({}, state, {itemsToUpload: [...stateItems, ...props.itemsToUpload]});
        });
    }

    /**
     * Uploads files
     *
     * @method uploadFiles
     * @param {Array} itemsToUpload
     * @memberof UploadPopupModule
     */
    uploadFiles(itemsToUpload) {
        this.setState(state => Object.assign({}, state, {itemsToUpload}));
    }

    render() {
        const listAttrs = Object.assign({}, this.props, {
            itemsToUpload: this.state.itemsToUpload
        });

        return (
            <div className="c-upload-popup">
                <Popup title={this.props.popupTitle} {...this.props} >
                    <DropAreaComponent
                        onDrop={this.uploadFiles.bind(this)}
                        maxFileSize={this.props.adminUiConfig.multiFileUpload.maxFileSize}
                        maxFileSizeMessage={this.props.maxFileSizeMessage}
                        dropActionMessage={this.props.dropActionMessage}
                        uploadBtnLabel={this.props.uploadBtnLabel}
                        preventDefaultAction={this.props.preventDefaultAction}
                        proccessUploadedFiles={this.props.proccessUploadedFiles}
                        />
                    <UploadListComponent {...listAttrs} />
                </Popup>
            </div>
        );
    }
}

UploadPopupModule.propTypes = {
    popupTitle: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    onUpload: PropTypes.func,
    onUploadEnd: PropTypes.func,
    onUploadFail: PropTypes.func,
    onItemEdit: PropTypes.func,
    onItemRemove: PropTypes.func,
    onClose: PropTypes.func,
    itemsToUpload: PropTypes.array,
    onAfterUpload: PropTypes.func.isRequired,
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
    uploadBtnLabel: PropTypes.string.isRequired,
    dropActionMessage: PropTypes.string.isRequired,
    maxFileSizeMessage: PropTypes.string.isRequired,
    uploadedItemsListTitle: PropTypes.string.isRequired,
    preventDefaultAction: PropTypes.func.isRequired,
    proccessUploadedFiles: PropTypes.func.isRequired
};

UploadPopupModule.defaultProps = {
    visible: true,
    itemsToUpload: []
};
