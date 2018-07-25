import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ContentTableComponent from '../content-table/content.table.component';

import './css/search.component.css';

export default class SearchComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            isSearching: false,
            submitDisabled: true,
        };

        this.updateItemsState = this.updateItemsState.bind(this);
        this.searchContent = this.searchContent.bind(this);
        this.onRequireItemsCount = this.onRequireItemsCount.bind(this);
        this.toggleSubmitButtonState = this.toggleSubmitButtonState.bind(this);
        this.setSearchInputRef = this.setSearchInputRef.bind(this);
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

        if (this.state.submitDisabled || (!isClickEvent && !isEnterKeyEvent)) {
            return;
        }

        this.setState(
            (state) => ({ ...state, isSearching: true }),
            () => {
                const promise = new Promise((resolve) =>
                    this.props.findContentBySearchQuery(this.props.restInfo, this._refSearchInput.value, resolve)
                );

                promise
                    .then(this.updateItemsState)
                    .catch(() => window.eZ.helpers.notification.showErrorNotification('Cannot find content'));
            }
        );
    }

    /**
     * Updates items state with search results
     *
     * @param {Object} response content query REST endpoint response
     * @memberof SearchComponent
     */
    updateItemsState(response) {
        this.setState((state) => ({
            ...state,
            items: response.View.Result.searchHits.searchHit.map((item) => item.value),
            isSearching: false,
        }));
    }

    /**
     * Checks whether a requested amount items fits the actual number of items.
     *
     * @method onRequireItemsCount
     * @param {Number} count
     */
    onRequireItemsCount(count) {
        const { items } = this.state;

        if (count > items.length) {
            throw new Error('All items loaded.');
        }
    }

    /**
     * Renders the submit button
     *
     * @method renderSubmitBtn
     */
    renderSubmitBtn() {
        const btnAttrs = { className: 'c-search__submit' };
        const svgAttrs = { className: 'ez-icon' };
        let iconIdentifier = 'search';

        if (this.state.isSearching) {
            btnAttrs.className = `${btnAttrs.className} c-search__submit--loading`;
            btnAttrs.disabled = true;
            svgAttrs.className = `${svgAttrs.className} ez-spin ez-icon-x2 ez-icon-spinner`;
            iconIdentifier = 'spinner';
        } else if (this.state.submitDisabled) {
            btnAttrs.disabled = true;
        } else {
            btnAttrs.onClick = this.searchContent;
        }

        return (
            <button {...btnAttrs}>
                <svg {...svgAttrs}>
                    <use xlinkHref={`/bundles/ezplatformadminui/img/ez-icons.svg#${iconIdentifier}`} />
                </svg>
                {!this.state.isSearching && this.props.labels.search.searchBtnLabel}
            </button>
        );
    }

    /**
     * Toggles the submit button state.
     * Disables it when the search query is empty.
     *
     * @method toggleSubmitButtonState
     */
    toggleSubmitButtonState() {
        this.setState((state) => ({ ...state, submitDisabled: !this._refSearchInput.value.trim().length }));
    }

    /**
     * Set a reference to the search input HTMLElement node
     *
     * @method setSearchInputRef
     * @param {HTMLElement} ref
     */
    setSearchInputRef(ref) {
        this._refSearchInput = ref;
    }

    render() {
        const {
            labels,
            onItemSelect,
            searchResultsPerPage,
            contentTypesMap,
            maxHeight,
            selectedContent,
            onSelectContent,
            canSelectContent,
            onItemRemove,
            multiple,
        } = this.props;

        return (
            <div className="c-search" style={{ maxHeight: `${maxHeight - 32}px` }}>
                <div className="c-search__title">{labels.search.title}:</div>
                <div className="c-search__form">
                    <input
                        className="c-search__input"
                        type="text"
                        ref={this.setSearchInputRef}
                        onKeyUp={this.searchContent}
                        onChange={this.toggleSubmitButtonState}
                    />
                    {this.renderSubmitBtn()}
                </div>
                <ContentTableComponent
                    items={this.state.items}
                    count={this.state.items.length}
                    requireItemsCount={this.onRequireItemsCount}
                    onItemSelect={onItemSelect}
                    perPage={searchResultsPerPage}
                    contentTypesMap={contentTypesMap}
                    title={labels.search.tableTitle}
                    labels={labels}
                    selectedContent={selectedContent}
                    onSelectContent={onSelectContent}
                    canSelectContent={canSelectContent}
                    onItemRemove={onItemRemove}
                    multiple={multiple}
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
            searchBtnLabel: PropTypes.string.isRequired,
        }).isRequired,
        searchPagination: PropTypes.object.isRequired,
    }).isRequired,
    restInfo: PropTypes.shape({
        token: PropTypes.string.isRequired,
        siteaccess: PropTypes.string.isRequired,
    }).isRequired,
    selectedContent: PropTypes.array.isRequired,
    onSelectContent: PropTypes.func.isRequired,
    canSelectContent: PropTypes.func.isRequired,
    onItemRemove: PropTypes.func.isRequired,
    multiple: PropTypes.bool.isRequired,
};
