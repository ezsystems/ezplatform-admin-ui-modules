import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import TabContentPanelComponent from '../../common/tab-content-panel/tab.content.panel.component';
import FinderComponent from './components/finder/finder.component';
import ContentMetaPreviewComponent from './components/content-meta-preview/content.meta.preview.component';
import SelectedContentComponent from '../../common/selected-content/selected.content.component';
import { loadContentInfo } from '../../services/universal.discovery.service';
import { restInfo } from '../../../common/rest-info/rest.info';
import { classnames } from '../../../common/classnames/classnames';
import deepClone from '../../../common/helpers/deep.clone.helper';
import { ContentTypesContext } from '../../udw.module';

const UDWBrowseTab = ({ selectedItemsLimit, onCancel, onConfirm, ...props }) => {
    const contentTypesMap = useContext(ContentTypesContext);
    const [showContentMetaPreview, setShowContentMetaPreviewState] = useState(false);
    const [contentMeta, setContentMeta] = useState(null);
    const [selectedContent, setSelectedContent] = useState([]);
    const addContentTypeInfoToItem = (item) => {
        const clonedItem = deepClone(item);
        const contentType = clonedItem.ContentInfo.Content.ContentType;

        clonedItem.ContentInfo.Content.ContentTypeInfo = deepClone(contentTypesMap[contentType._href]);

        return clonedItem;
    };
    const updateContentMetaWithCurrentVersion = (contentMeta, currentVersion) => {
        const updatedContentMeta = deepClone(contentMeta);

        updatedContentMeta.CurrentVersion = currentVersion;

        return updatedContentMeta;
    };
    const addMissingContentMeta = (contentMeta, callback) => {
        const contentId = contentMeta.ContentInfo.Content._id;

        loadContentInfo(restInfo, contentId, (response) => {
            const currentVersion = response.View.Result.searchHits.searchHit[0].value.Content.CurrentVersion;
            const updatedContentMeta = addContentTypeInfoToItem(updateContentMetaWithCurrentVersion(contentMeta, currentVersion));

            callback(updatedContentMeta);
        });
    };
    const onItemSelect = (contentMeta) => {
        addMissingContentMeta(contentMeta, (updatedContentMeta) => setContentMeta(updatedContentMeta));
        setShowContentMetaPreviewState(true);
    };
    const markContentAsSelected = (contentMeta) => {
        const alreadySelectedContent = deepClone(selectedContent);
        const afterUpdate = (updatedContentMeta) => setSelectedContent([...alreadySelectedContent, updatedContentMeta]);

        addMissingContentMeta(contentMeta, afterUpdate);
    };
    const unmarkContentAsSelected = (locationId) => {
        const alreadySelectedContent = deepClone(selectedContent);

        setSelectedContent(alreadySelectedContent.filter((item) => item.id !== locationId));
    };
    const confirmSelection = () => onConfirm(selectedContent);
    const previewAttrs = {
        isVisible: showContentMetaPreview && !!contentMeta,
        location: contentMeta,
    };
    const finderAttrs = {
        onItemSelect,
        selectedContent,
        onSelectContent: markContentAsSelected,
        onItemRemove: unmarkContentAsSelected,
        ...props,
    };
    const selectedContentAttrs = {
        items: selectedContent,
        selectedItemsLimit,
        onItemRemove: unmarkContentAsSelected,
    };
    const tabAttrs = {
        className: classnames({
            'ez-browse-tab': true,
            'ez-browse-tab--with-preview': !!contentMeta,
        }),
    };
    const confirmBtnAttrs = {
        className: 'ez-browse-tab__action',
        disabled: !selectedContent.length,
        onClick: confirmSelection,
        type: 'button',
    };
    const cancelBtnAttrs = {
        className: 'ez-browse-tab__action',
        type: 'button',
        onClick: onCancel,
    };

    return (
        <div {...tabAttrs}>
            <div className="ez-browse-tab__finder">
                <TabContentPanelComponent id="browse" isVisible={true}>
                    <FinderComponent {...finderAttrs} />
                </TabContentPanelComponent>
            </div>
            <div className="ez-browse-tab__preview">
                <ContentMetaPreviewComponent {...previewAttrs} />
            </div>
            <div className="ez-browse-tab__selected-items">
                <SelectedContentComponent {...selectedContentAttrs} />
            </div>
            <div className="ez-browse-tab__actions">
                <button {...cancelBtnAttrs}>Cancel</button>
                <button {...confirmBtnAttrs}>Confirm</button>
            </div>
        </div>
    );
};

UDWBrowseTab.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    maxHeight: PropTypes.number.isRequired,
    multiple: PropTypes.bool,
    selectedItemsLimit: PropTypes.number,
    startingLocationId: PropTypes.number,
    allowContainersOnly: PropTypes.bool,
    canSelectContent: PropTypes.func,
};

UDWBrowseTab.defaultProps = {
    multiple: false,
    startingLocationId: 1,
    selectedItemsLimit: 0,
    allowContainersOnly: false,
    canSelectContent: (item, callback) => callback(true),
};

eZ.addConfig('udwTabs.Browse', UDWBrowseTab);

export default UDWBrowseTab;
