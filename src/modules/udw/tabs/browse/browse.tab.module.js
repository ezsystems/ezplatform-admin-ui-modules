import React, { useState, useEffect, createContext } from 'react';
import PropTypes from 'prop-types';
import TabContentPanelComponent from '../../common/tab-content-panel/tab.content.panel.component';
import FinderComponent from './components/finder/finder.component';
import ContentMetaPreviewComponent from './components/content-meta-preview/content.meta.preview.component';
import SelectedContentComponent from '../../common/selected-content/selected.content.component';
import { loadContentTypes, loadContentInfo } from '../../services/universal.discovery.service';
import { restInfo } from '../../../common/rest-info/rest.info';
import { classnames } from '../../../common/classnames/classnames';
import deepClone from '../../../common/helpers/deep.clone.helper';

const ContentTypesContext = createContext();

const UDWBrowseTab = ({ selectedItemsLimit, ...props }) => {
    const [contentTypesMap, setContentTypesMap] = useState(null);
    const [showContentMetaPreview, setShowContentMetaPreviewState] = useState(false);
    const [contentMeta, setContentMeta] = useState(null);
    const [selectedContent, setSelectedContent] = useState([]);
    const addContentTypeInfoToItem = (item) => {
        const clonedItem = deepClone(item);
        const contentType = clonedItem.ContentInfo.Content.ContentType;

        clonedItem.ContentInfo.Content.ContentTypeInfo = deepClone(contentTypesMap[contentType._href]);

        return clonedItem;
    };
    const updateContentMetaWithCurrentVersion = (contentMeta, response) => {
        let updatedContentMeta = deepClone(contentMeta);
        const currentVersion = response.View.Result.searchHits.searchHit[0].value.Content.CurrentVersion;

        updatedContentMeta.CurrentVersion = currentVersion;

        updatedContentMeta = addContentTypeInfoToItem(updatedContentMeta);

        setContentMeta(updatedContentMeta);
    };
    const onItemSelect = (contentMeta) => {
        const contentId = contentMeta.ContentInfo.Content._id;

        loadContentInfo(restInfo, contentId, (response) => updateContentMetaWithCurrentVersion(contentMeta, response));

        setShowContentMetaPreviewState(true);
    };
    const markContentAsSelected = (content) => {
        const alreadySelectedContent = deepClone(selectedContent);

        setSelectedContent([...alreadySelectedContent, content]);
    };
    const unmarkContentAsSelected = (locationId) => {
        const alreadySelectedContent = deepClone(selectedContent);

        setSelectedContent(alreadySelectedContent.filter((item) => item.id !== locationId));
    };
    const updateContentTypesMapState = (response) => {
        if (!response || !response.ContentTypeInfoList) {
            return;
        }

        const contentTypesMap = response.ContentTypeInfoList.ContentType.reduce((total, item) => {
            total[item._href] = item;

            return total;
        }, {});

        setContentTypesMap(contentTypesMap);
    };
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

    useEffect(() => loadContentTypes(restInfo, updateContentTypesMapState), []);

    return (
        <ContentTypesContext.Provider value={contentTypesMap}>
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
                    <button type="button">Cancel</button>
                    <button type="button">Confirm</button>
                </div>
            </div>
        </ContentTypesContext.Provider>
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
