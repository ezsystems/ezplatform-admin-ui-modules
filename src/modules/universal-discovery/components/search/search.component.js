import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SearchResultsComponent from './search.results.component';

import './css/search.component.css';

export default class SearchComponent extends Component {
    constructor() {
        super();

        this.state = {
            items: []
        }
    }

    /**
     * Searches content by a query
     *
     * @method searchContent
     * @memberof SearchComponent
     */
    searchContent() {
        const promise = new Promise(resolve => this.props.findContentBySearchQuery(this._refSearchInput.value, resolve));

        promise
            .then(this.updateItemsState.bind(this))
            .catch(error => console.log('search:component:search', error));
    }

    /**
     * Updates items state with search results
     *
     * @param {Object} response content query REST endpoint response
     * @memberof SearchComponent
     */
    updateItemsState(response) {
        this.setState(state => Object.assign({}, state, {items: response.View.Result.searchHits.searchHit}));
    }

    render() {
        const {labels, onItemSelect, searchResultsPerPage, contentTypesMap, maxHeight} = this.props;

        return (
            <div className="c-search" style={{maxHeight:`${maxHeight}px`}}>
                <div className="c-search__title">{labels.search.title}</div>
                <div className="c-search__form">
                    <input className="c-search__input" type="text" ref={(ref) => this._refSearchInput = ref} />
                    <button className="c-search__submit" onClick={this.searchContent.bind(this)}>Search</button>
                </div>
                <div className="c-search__results">
                    <SearchResultsComponent
                        items={this.state.items}
                        onItemSelect={onItemSelect}
                        perPage={searchResultsPerPage}
                        contentTypesMap={contentTypesMap}
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
            title: PropTypes.string.isRequired
        }).isRequired,
        searchPagination: PropTypes.object.isRequired
    }).isRequired
};
