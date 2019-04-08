import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TooltipPopup from '../../../common/tooltip-popup/tooltip.popup.component';
import DropAreaComponent from '../drop-area/drop.area.component';
import UploadListComponent from '../upload-list/upload.list.component';

import './css/upload.popup.component.css';

export default class UploadPopupModule extends Component {
    constructor(props) {
        super(props);

        this.state = { itemsToUpload: props.itemsToUpload };
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.setState((state) => {
            const stateItems = state.itemsToUpload.filter(
                (stateItem) => !props.itemsToUpload.find((propItem) => propItem.id === stateItem.id)
            );

            return { itemsToUpload: [...stateItems, ...props.itemsToUpload] };
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
        this.setState((state) => Object.assign({}, state, { itemsToUpload }));
    }

    render() {
        const listAttrs = Object.assign({}, this.props, {
            itemsToUpload: this.state.itemsToUpload,
        });
        const title = Translator.trans(/*@Desc("Multi-file upload")*/ 'upload_popup.title', {}, 'multi_file_upload');

        return (
            <div className="c-upload-popup">
                <TooltipPopup title={title} {...this.props}>
                    <DropAreaComponent
                        onDrop={this.uploadFiles.bind(this)}
                        maxFileSize={this.props.adminUiConfig.multiFileUpload.maxFileSize}
                        preventDefaultAction={this.props.preventDefaultAction}
                        processUploadedFiles={this.props.processUploadedFiles}
                    />
                    <UploadListComponent {...listAttrs} />
                </TooltipPopup>
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
            maxFileSize: PropTypes.number.isRequired,
        }).isRequired,
        token: PropTypes.string.isRequired,
        siteaccess: PropTypes.string.isRequired,
    }).isRequired,
    parentInfo: PropTypes.shape({
        contentTypeIdentifier: PropTypes.string.isRequired,
        contentTypeId: PropTypes.number.isRequired,
        locationPath: PropTypes.string.isRequired,
        language: PropTypes.string.isRequired,
    }).isRequired,
    preventDefaultAction: PropTypes.func.isRequired,
    processUploadedFiles: PropTypes.func.isRequired,
    currentLanguage: PropTypes.string,
};

UploadPopupModule.defaultProps = {
    visible: true,
    itemsToUpload: [],
    currentLanguage: '',
};
