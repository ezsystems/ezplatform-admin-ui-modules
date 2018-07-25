import React from 'react';
import PropTypes from 'prop-types';

import TabContentPanelComponent from './tab.content.panel.component';
import SearchComponent from '../search/search.component';

import './css/search.panel.component.css';

const SearchPanelComponent = (props) => {
    const wrapperAttrs = { className: 'c-search-panel' };
    const {
        multiple,
        findContentBySearchQuery,
        onItemSelect,
        maxHeight,
        contentTypesMap,
        searchResultsPerPage,
        labels,
        restInfo,
        selectedContent,
        onSelectContent,
        canSelectContent,
        onItemRemove,
    } = props;
    const searchAttrs = Object.assign(
        {},
        {
            multiple,
            findContentBySearchQuery,
            onItemSelect,
            maxHeight,
            contentTypesMap,
            searchResultsPerPage,
            labels,
            restInfo,
            selectedContent,
            onSelectContent,
            canSelectContent,
            onItemRemove,
        }
    );

    if (!props.isVisible) {
        wrapperAttrs.hidden = true;
    }

    return (
        <div {...wrapperAttrs}>
            <TabContentPanelComponent {...props}>
                <SearchComponent {...searchAttrs} />
            </TabContentPanelComponent>
        </div>
    );
};

SearchPanelComponent.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    multiple: PropTypes.bool.isRequired,
    onItemSelect: PropTypes.func.isRequired,
    findContentBySearchQuery: PropTypes.func.isRequired,
    maxHeight: PropTypes.number.isRequired,
    contentTypesMap: PropTypes.object.isRequired,
    searchResultsPerPage: PropTypes.number.isRequired,
    labels: PropTypes.object.isRequired,
    restInfo: PropTypes.shape({
        token: PropTypes.string.isRequired,
        siteaccess: PropTypes.string.isRequired,
    }).isRequired,
    selectedContent: PropTypes.array.isRequired,
    onSelectContent: PropTypes.func.isRequired,
    canSelectContent: PropTypes.func.isRequired,
    onItemRemove: PropTypes.func.isRequired,
};

export default SearchPanelComponent;
