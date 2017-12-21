import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SearchResultsComponent from './search.results.component';

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

        this.setState(state => Object.assign({}, state, {isSearching: true}), () => {
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
        this.setState(state => Object.assign({}, state, {
            items: response.View.Result.searchHits.searchHit,
            isSearching: false
        }));
    }

    renderSubmitBtn() {
        const btnAttrs = { className: 'c-search__submit' };
        const svgAttrs = { className: 'ez-icon'};
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

    render() {
        const {labels, onItemSelect, searchResultsPerPage, contentTypesMap, maxHeight} = this.props;

        return (
            <div className="c-search" style={{maxHeight:`${maxHeight - 32}px`}}>
                <div className="c-search__title">{labels.search.title}:</div>
                <div className="c-search__form">
                    <input className="c-search__input" type="text" ref={(ref) => this._refSearchInput = ref} onKeyUp={this.searchContent}/>
                    {this.renderSubmitBtn()}
                </div>
                <div className="c-search__results">
                    <SearchResultsComponent
                        items={this.state.items}
                        onItemSelect={onItemSelect}
                        perPage={searchResultsPerPage}
                        contentTypesMap={contentTypesMap}
                        isSearching={this.state.isSearching}
                        labels={labels} />
                </div>
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
