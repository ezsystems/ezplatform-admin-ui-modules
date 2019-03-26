import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../common/icon/icon';
import ContentTableComponent from '../content-table/content.table.component';

export default class SearchComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: null,
            lastSearchText: null,
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

        const searchText = this._refSearchInput.value;

        this.setState(
            () => ({ isSearching: true, lastSearchText: searchText }),
            () => {
                const promise = new Promise((resolve) =>
                    this.props.findContentBySearchQuery(this.props.restInfo, searchText, resolve, this.props.searchResultsLimit)
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
        this.setState(() => ({
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
        const btnAttrs = { className: 'c-search__submit', type: 'button' };
        let svgExtraClasses = 'ez-icon--small ez-icon--light';
        const btnLabel = Translator.trans(/*@Desc("Search")*/ 'search.submit.label', {}, 'universal_discovery_widget');
        let iconIdentifier = 'search';

        if (this.state.isSearching) {
            btnAttrs.className = `${btnAttrs.className} c-search__submit--loading`;
            btnAttrs.disabled = true;
            svgExtraClasses = `${svgExtraClasses} ez-spin ez-icon-x2 ez-icon-spinner`;
            iconIdentifier = 'spinner';
        } else if (this.state.submitDisabled) {
            btnAttrs.disabled = true;
        } else {
            btnAttrs.onClick = this.searchContent;
        }

        return (
            <button {...btnAttrs}>
                <Icon name={iconIdentifier} extraClasses={svgExtraClasses} />
                {!this.state.isSearching && btnLabel}
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
        this.setState(() => ({ submitDisabled: !this._refSearchInput.value.trim().length }));
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

    renderSearchTips() {
        const { items } = this.state;

        if (items === null || items.length) {
            return null;
        }

        const searchTipsTitle = Translator.trans(/*@Desc("Some helpful search tips:")*/ 'search.tips.headline', {}, 'search');
        const searchTipCheckSpelling = Translator.trans(
            /*@Desc("Check spelling of keywords.")*/ 'search.tips.check_spelling',
            {},
            'search'
        );
        const searchTipDifferentKeywords = Translator.trans(
            /*@Desc("Try different keywords.")*/ 'search.tips.different_keywords',
            {},
            'search'
        );
        const searchTipMoreGeneralKeywords = Translator.trans(
            /*@Desc("Try more general keywords.")*/ 'search.tips.more_general_keywords',
            {},
            'search'
        );
        const searchTipFewerKeywords = Translator.trans(
            /*@Desc("Try fewer keywords. Reducing keywords result in more matches.")*/ 'search.tips.fewer_keywords',
            {},
            'search'
        );

        return (
            <div className="c-search__search-tips">
                <h6>{searchTipsTitle}</h6>
                <ul>
                    <li>{searchTipCheckSpelling}</li>
                    <li>{searchTipDifferentKeywords}</li>
                    <li>{searchTipMoreGeneralKeywords}</li>
                    <li>{searchTipFewerKeywords}</li>
                </ul>
            </div>
        );
    }

    renderResultsTable() {
        if (this.state.items === null) {
            return null;
        }

        const { items, lastSearchText } = this.state;
        const {
            onItemSelect,
            searchResultsPerPage,
            contentTypesMap,
            selectedContent,
            onSelectContent,
            canSelectContent,
            onItemRemove,
            multiple,
        } = this.props;
        const tableTitle = Translator.trans(/*@Desc("Search results")*/ 'search.content_table.title', {}, 'universal_discovery_widget');
        const noItemsMessage = Translator.trans(
            /*@Desc("Sorry, no results were found for "%query%".")*/ 'search.no_result',
            { query: lastSearchText },
            'search'
        );

        return (
            <ContentTableComponent
                items={items}
                count={items.length}
                requireItemsCount={this.onRequireItemsCount}
                onItemSelect={onItemSelect}
                perPage={searchResultsPerPage}
                contentTypesMap={contentTypesMap}
                title={tableTitle}
                selectedContent={selectedContent}
                onSelectContent={onSelectContent}
                canSelectContent={canSelectContent}
                onItemRemove={onItemRemove}
                multiple={multiple}
                noItemsMessage={noItemsMessage}
            />
        );
    }

    render() {
        const { maxHeight } = this.props;
        const title = Translator.trans(/*@Desc("Search")*/ 'search.title', {}, 'universal_discovery_widget');

        return (
            <div className="c-search" style={{ maxHeight: `${maxHeight - 32}px` }}>
                <div className="c-search__title">{title}:</div>
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
                {this.renderResultsTable()}
                {this.renderSearchTips()}
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
    searchResultsLimit: PropTypes.number.isRequired,
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
