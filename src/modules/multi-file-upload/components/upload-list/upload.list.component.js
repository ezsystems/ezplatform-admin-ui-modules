import React, { Component } from 'react';
import PropTypes from 'prop-types';

import UploadItemComponent from './upload.item.component';

import './css/upload.list.component.css';

export default class UploadListComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            itemsToUpload: props.itemsToUpload,
            items: []
        };
    }

    handleAfterUpload(item) {
        this.setState(state => {
            const items = [...state.items, item];
            const itemsToUpload = state.itemsToUpload.filter(data => data.id !== item.id);

            return Object.assign({}, state, {
                itemsToUpload,
                items
            });
        });
    }

    handleAfterAbort(item) {
        this.setState(state => {
            const items = state.items.filter(data => data.id !== item.id);
            const itemsToUpload = state.itemsToUpload.filter(data => data.id !== item.id);

            return Object.assign({}, state, {
                uploaded: items.length,
                total: items.length + itemsToUpload.length,
                itemsToUpload,
                items
            });
        });
    }

    handleAfterDelete(item) {
        this.setState(state => {
            const items = state.items.filter(data => data.id !== item.id);
            const itemsToUpload = state.itemsToUpload.filter(data => data.id !== item.id);

            return Object.assign({}, state, {
                uploaded: items.length,
                total: items.length + itemsToUpload.length,
                itemsToUpload,
                items
            });
        });
    }

    renderItemToUpload(item) {
        return this.renderItem(item, {
            isUploaded: false,
            createFileStruct: this.props.createFileStruct,
            publishFile: this.props.publishFile,
            onAfterAbort: this.handleAfterAbort.bind(this),
            onAfterUpload: this.handleAfterUpload.bind(this),
            checkCanUpload: this.props.checkCanUpload
        });
    }

    renderUploadedItem(item) {
        return this.renderItem(item, {
            isUploaded: true,
            deleteFile: this.props.deleteFile,
            onAfterDelete: this.handleAfterDelete.bind(this)
        });
    }

    renderItem(item, customAttrs) {
        const attrs = Object.assign({
            key: item.id,
            data: item,
            adminUiConfig: this.props.adminUiConfig,
            parentInfo: this.props.parentInfo
        }, customAttrs);

        return <UploadItemComponent {...attrs} />
    }

    componentWillReceiveProps(props) {
        this.setState(state => {
            return Object.assign({}, state, {itemsToUpload: [...state.itemsToUpload, ...props.itemsToUpload]});
        });
    }

    render() {
        const {items, itemsToUpload} = this.state;
        const uploaded = items.length;
        const total = uploaded + itemsToUpload.length;
        
        return (
            <div className="c-upload-list">
                <div className="c-upload-list__title">{this.props.uploadedItemsListTitle} ({uploaded}/{total})</div>
                <div className="c-upload-list__items">
                    {itemsToUpload.map(this.renderItemToUpload.bind(this))}
                    {items.map(this.renderUploadedItem.bind(this))}
                </div>
            </div>
        );
    }
}

UploadListComponent.propTypes = {
    itemsToUpload: PropTypes.arrayOf(PropTypes.object),
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
    uploadedItemsListTitle: PropTypes.string.isRequired
};

UploadListComponent.defaultProps = {
    itemsToUpload: []
};