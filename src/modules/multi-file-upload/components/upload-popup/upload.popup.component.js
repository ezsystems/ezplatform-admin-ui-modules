import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Popup from '../popup/popup.component';
import DropAreaComponent from '../drop-area/drop.area.component';
import UploadListComponent from '../upload-list/upload.list.component';

import './css/upload.popup.component.css';

export default class UploadPopupModule extends Component {
    constructor(props) {
        super(props);

        this.state = {itemsToUpload: props.itemsToUpload};
    }

    uploadFiles(itemsToUpload) {
        this.setState(state => Object.assign({}, state, {itemsToUpload}))
    }

    render() {
        return (
            <div className="c-upload-popup">
                <Popup {...this.props}>
                    <DropAreaComponent 
                        onDrop={this.uploadFiles.bind(this)} 
                        maxFileSize={this.props.adminUiConfig.multiFileUpload.maxFileSize} />
                    <UploadListComponent {...this.props} itemsToUpload={this.state.itemsToUpload} />
                </Popup>
            </div>
        );
    }
}

UploadPopupModule.propTypes = {
    title: PropTypes.string,
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
};

UploadPopupModule.defaultProps = {
    title: 'Multi-file upload',
    visible: true,
    onAfterUpload: () => true,
    itemsToUpload: []
};