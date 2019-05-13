import React, { useState, useContext, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ContentTypesContext } from '../udw.module';
import { loadContentInfo } from '../services/universal.discovery.service';
import { restInfo } from '../../common/rest-info/rest.info';
import deepClone from '../../common/helpers/deep.clone.helper';

const BaseTabComponent = ({ children }) => {
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
    const afterUpdatingMissingContentMeta = (updatedContentMeta) => {
        setSelectedContent((content) => content.map((item) => (item.id === updatedContentMeta.id ? updatedContentMeta : item)));
    };
    const onItemMarked = (contentMeta) => {
        setContentMeta(() => contentMeta);
        addMissingContentMeta(contentMeta, (updatedContentMeta) => setContentMeta(() => updatedContentMeta));
        setShowContentMetaPreviewState(true);
    };
    const markContentAsSelected = (contentMeta) => {
        setSelectedContent((content) => [...deepClone(content), contentMeta]);
        addMissingContentMeta(contentMeta, afterUpdatingMissingContentMeta);
    };
    const unmarkContentAsSelected = (locationId) => {
        setSelectedContent((content) => deepClone(content).filter((item) => item.id !== locationId));
    };
    const attrs = {
        selectedContent,
        showContentMetaPreview,
        contentMeta,
        addContentTypeInfoToItem,
        updateContentMetaWithCurrentVersion,
        addMissingContentMeta,
        onItemMarked,
        markContentAsSelected,
        unmarkContentAsSelected,
    };

    return <Fragment>{children(attrs)}</Fragment>;
};

BaseTabComponent.propTypes = {
    children: PropTypes.node.isRequired,
};

export default BaseTabComponent;
