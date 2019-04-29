import React, { useState, useEffect, createContext } from 'react';
import BrowsePanelComponent from './components/panel/browse.panel.component';
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
    const panelAttrs = { ...props, isVisible: true, onItemSelect };

    useEffect(() => {
        loadContentTypes(restInfo, updateContentTypesMapState);
    }, []);

    return (
        <ContentTypesContext.Provider value={contentTypesMap}>
            <BrowsePanelComponent {...panelAttrs} />
            <ContentMetaPreviewComponent {...previewAttrs} />
        </ContentTypesContext.Provider>
    );
};

eZ.addConfig('udwTabs.Browse', UDWBrowseTab);

export default UDWBrowseTab;
