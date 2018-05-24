import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ContentTableComponent from '../content-table/content.table.component';

import './css/search.component.css';

export default class SearchComponent extends Component {
    constructor() {
        super();

        this.state = {
            items: [],
            isSearching: false
        };

        this.updateItemsState = this.updateItemsState.bind(this);
        this.searchContent = this.searchContent.bind(this);
    }

    /**
     * Searches content by a query
     *
     * @method searchContent
     * @param {Event} event
     * @memberof SearchComponent
     */
    searchContent(event) {
        const isClickEvent = event.nativeEvent.type === 'click';
        const isEnterKeyEvent = event.nativeEvent.type === 'keyup' && event.nativeEvent.keyCode === 13;

        if (!isClickEvent && !isEnterKeyEvent) {
            return;
        }

        this.setState(state => ({ ...state, isSearching: true }), () => {
            const promise = new Promise(resolve => this.props.findContentBySearchQuery(
                this.props.restInfo,
                this._refSearchInput.value,
                resolve
            ));

            promise
                .then(this.updateItemsState)
                .catch(error => console.log('search:component:search', error));
        });
    }

    /**
     * Updates items state with search results
     *
     * @param {Object} response content query REST endpoint response
     * @memberof SearchComponent
     */
    updateItemsState(response) {
        this.setState(state => ({
            ...state,
            items: response.View.Result.searchHits.searchHit.map(item => item.value),
            isSearching: false
        }));
    }

    renderSubmitBtn() {
        const btnAttrs = { className: 'c-search__submit' };
        const svgAttrs = { className: 'ez-icon' };
        let iconIdentifier = 'search';

        if (this.state.isSearching) {
            btnAttrs.className = `${btnAttrs.className} c-search__submit--loading`;
            btnAttrs.disabled = true;
            svgAttrs.className = `${svgAttrs.className} ez-spin ez-icon-x2 ez-icon-spinner`;
            iconIdentifier = 'spinner';
        } else {
            btnAttrs.onClick = this.searchContent;
        }

        return (
            <button {...btnAttrs}>
                <svg {...svgAttrs}>
                    <use xlinkHref={`/bundles/ezplatformadminui/img/ez-icons.svg#${iconIdentifier}`}></use>
                </svg>
                {!this.state.isSearching && this.props.labels.search.searchBtnLabel}
            </button>
        );
    }

    /**
     * Get table labels
     *
     * @memberof SearchComponent
     */
    getTableLabels() {
        const {
            search,
            contentTable,
            contentTablePagination,
            contentTableHeader,
            contentTableItem
        } = this.props.labels;

        return {
            title: search.tableTitle,
            header: contentTableHeader,
            item: contentTableItem,
            pagination: contentTablePagination
        };
    }

    render() {
        const { labels, onItemSelect, searchResultsPerPage, contentTypesMap, maxHeight } = this.props;
        const tableLabels = this.getTableLabels();

        return (
            <div className="c-search" style={{ maxHeight: `${maxHeight - 32}px` }}>
                <div className="c-search__title">{labels.search.title}:</div>
                <div className="c-search__form">
                    <input className="c-search__input" type="text" ref={(ref) => this._refSearchInput = ref} onKeyUp={this.searchContent} />
                    {this.renderSubmitBtn()}
                </div>
                <ContentTableComponent
                    items={this.state.items}
                    onItemSelect={onItemSelect}
                    perPage={searchResultsPerPage}
                    contentTypesMap={contentTypesMap}
                    labels={tableLabels}
                />
            </div>
        );
    }
}

SearchComponent.propTypes = {
    findContentBySearchQuery: PropTypes.func.isRequired,
    onItemSelect: PropTypes.func.isRequired,
    maxHeight: PropTypes.number.isRequired,
    contentTypesMap: PropTypes.object.isRequired,
    searchResultsPerPage: PropTypes.number.isRequired,
    labels: PropTypes.shape({
        search: PropTypes.shape({
            title: PropTypes.string.isRequired,
            searchBtnLabel: PropTypes.string.isRequired
        }).isRequired,
        searchPagination: PropTypes.object.isRequired
    }).isRequired,
    restInfo: PropTypes.shape({
        token: PropTypes.string.isRequired,
        siteaccess: PropTypes.string.isRequired
    }).isRequired
};
