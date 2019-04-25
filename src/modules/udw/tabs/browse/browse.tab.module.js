import React, { Fragment, useState } from 'react';
import BrowsePanelComponent from './components/panel/browse.panel.component';
import ContentMetaPreviewComponent from './components/content-meta-preview/content.meta.preview.component';

const UDWBrowseTab = (props) => {
    const [showContentMetaPreview, setShowContentMetaPreviewState] = useState(false);
    const [contentData, setContentData] = useState(null);
    const onItemSelect = (data) => {
        setContentData(data);
        setShowContentMetaPreviewState(true);
    };
    const attrs = { ...props, isVisible: true, onItemSelect };

    return (
        <Fragment>
            <BrowsePanelComponent {...attrs} />
            <ContentMetaPreviewComponent isVisible={showContentMetaPreview} data={contentData} />
        </Fragment>
    );
};

eZ.addConfig('udwTabs.Browse', UDWBrowseTab);

export default UDWBrowseTab;
