import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TabContentPanelComponent from '../../common/tab-content-panel/tab.content.panel.component';
import SearchComponent from './components/search/search.component';
import { classnames } from '../../../common/classnames/classnames';

const UDWSearchTab = ({ multiple, maxHeight, searchResultsPerPage, searchResultsLimit, canSelectContent }) => {
    const [showContentMetaPreview, setShowContentMetaPreviewState] = useState(false);
    const [contentMeta, setContentMeta] = useState(null);
    const [selectedContent, setSelectedContent] = useState([]);
    const wrapperAttrs = {
        className: classnames({
            'ez-browse-tab': true,
            'ez-browse-tab--with-preview': !!contentMeta,
        }),
    };
    const searchAttrs = {
        multiple,
        maxHeight,
        searchResultsPerPage,
        searchResultsLimit,
        canSelectContent,
    };

    return (
        <div {...wrapperAttrs}>
            <TabContentPanelComponent id="search" isVisible={true}>
                <SearchComponent {...searchAttrs} />
            </TabContentPanelComponent>
        </div>
    );
};

UDWSearchTab.propTypes = {
    maxHeight: PropTypes.number.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    searchResultsPerPage: PropTypes.number,
    searchResultsLimit: PropTypes.number,
    multiple: PropTypes.bool,
    canSelectContent: PropTypes.func,
};

UDWSearchTab.defaultProps = {
    multiple: false,
    searchResultsPerPage: 10,
    searchResultsLimit: 50,
    canSelectContent: (item, callback) => callback(true),
};

eZ.addConfig('udwTabs.Search', UDWSearchTab);

export default UDWSearchTab;
