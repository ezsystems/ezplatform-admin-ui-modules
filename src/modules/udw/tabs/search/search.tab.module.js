import React from 'react';
import PropTypes from 'prop-types';
import TabContentPanelComponent from '../../common/tab-content-panel/tab.content.panel.component';
import SearchComponent from './components/search/search.component';
import ContentMetaPreviewComponent from '../../common/content-meta-preview/content.meta.preview.component';
import SelectedContentComponent from '../../common/selected-content/selected.content.component';
import { createCssClassNames } from '../../../common/css-class-names/css.class.names';
import BaseTabComponent from '../base.tab.component';

const UDWSearchTab = (props) => {
    const {
        multiple,
        maxHeight,
        selectedItemsLimit,
        searchResultsPerPage,
        searchResultsLimit,
        onCancel,
        onConfirm,
        checkCanSelectContent,
    } = props;
    const renderTab = (parentProps) => {
        const {
            showContentMetaPreview,
            contentMeta,
            selectedContent,
            markContentAsSelected,
            unmarkContentAsSelected,
            onItemMarked,
        } = parentProps;
        const confirmSelection = () => onConfirm(selectedContent);
        const wrapperAttrs = {
            className: createCssClassNames({
                'ez-browse-tab': true,
                'ez-browse-tab--with-preview': !!contentMeta,
            }),
        };
        const searchAttrs = {
            multiple,
            maxHeight,
            searchResultsPerPage,
            searchResultsLimit,
            selectedContent,
            onItemSelect: markContentAsSelected,
            onItemDeselect: unmarkContentAsSelected,
            checkCanSelectContent,
            onItemMarked,
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
        const previewAttrs = {
            isVisible: showContentMetaPreview && !!contentMeta,
            location: contentMeta,
        };
        const selectedContentAttrs = {
            items: selectedContent,
            selectedItemsLimit,
            onItemRemove: unmarkContentAsSelected,
        };

        return (
            <div {...wrapperAttrs}>
                <TabContentPanelComponent id="search" isVisible={true}>
                    <SearchComponent {...searchAttrs} />
                </TabContentPanelComponent>
                <div className="ez-search-tab__preview">
                    <ContentMetaPreviewComponent {...previewAttrs} />
                </div>
                <div className="ez-search-tab__selected-items">
                    <SelectedContentComponent {...selectedContentAttrs} />
                </div>
                <div className="ez-search-tab__actions">
                    <button {...cancelBtnAttrs}>Cancel</button>
                    <button {...confirmBtnAttrs}>Confirm</button>
                </div>
            </div>
        );
    };

    return <BaseTabComponent>{renderTab}</BaseTabComponent>;
};

UDWSearchTab.propTypes = {
    maxHeight: PropTypes.number.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    selectedItemsLimit: PropTypes.number.isRequired,
    searchResultsPerPage: PropTypes.number,
    searchResultsLimit: PropTypes.number,
    multiple: PropTypes.bool,
    checkCanSelectContent: PropTypes.func,
};

UDWSearchTab.defaultProps = {
    multiple: false,
    searchResultsPerPage: 10,
    searchResultsLimit: 50,
    checkCanSelectContent: (item, callback) => callback(true),
};

eZ.addConfig('udwTabs.Search', UDWSearchTab);

export default UDWSearchTab;
