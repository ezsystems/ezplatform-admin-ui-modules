import React, { useState, useEffect, createContext } from 'react';
import PropTypes from 'prop-types';
import TabContentPanelComponent from '../../common/tab-content-panel/tab.content.panel.component';
import FinderComponent from './components/finder/finder.component';
import ContentMetaPreviewComponent from './components/content-meta-preview/content.meta.preview.component';
import { loadContentTypes, loadContentInfo } from '../../services/universal.discovery.service';
import { restInfo } from '../../common/rest-info/rest.info';
import deepClone from '../../../common/helpers/deep.clone.helper';

const ContentTypesContext = createContext();

const UDWBrowseTab = (props) => {
    const [contentTypesMap, setContentTypesMap] = useState(null);
    const [showContentMetaPreview, setShowContentMetaPreviewState] = useState(false);
    const [contentMeta, setContentMeta] = useState(null);
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
        // this.setState(() => ({ contentMeta: updatedContentMeta, isPreviewMetaReady: true }));
    };
    const onItemSelect = (contentMeta) => {
        const contentId = contentMeta.ContentInfo.Content._id;

        loadContentInfo(restInfo, contentId, (response) => updateContentMetaWithCurrentVersion(contentMeta, response));

        setShowContentMetaPreviewState(true);
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
    const finderAttrs = { onItemSelect, ...props };

    useEffect(() => loadContentTypes(restInfo, updateContentTypesMapState), []);

    return (
        <ContentTypesContext.Provider value={contentTypesMap}>
            <TabContentPanelComponent id="browse" isVisible={true}>
                <FinderComponent {...finderAttrs} />
            </TabContentPanelComponent>
            <ContentMetaPreviewComponent {...previewAttrs} />
        </ContentTypesContext.Provider>
    );
};

UDWBrowseTab.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    maxHeight: PropTypes.number.isRequired,
    multiple: PropTypes.bool,
    startingLocationId: PropTypes.number,
    allowContainersOnly: PropTypes.bool,
    canSelectContent: PropTypes.func,
};

UDWBrowseTab.defaultProps = {
    multiple: false,
    startingLocationId: 1,
    allowContainersOnly: false,
    canSelectContent: (item, callback) => callback(true),
};

eZ.addConfig('udwTabs.Browse', UDWBrowseTab);

export default UDWBrowseTab;
