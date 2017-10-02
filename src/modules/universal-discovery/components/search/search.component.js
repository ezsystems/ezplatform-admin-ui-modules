import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SearchResultsComponent from './search.results.component.js';

import searchData from './data/search.json';
import './css/search.component.css';

export default class SearchComponent extends Component {
    constructor() {
        super();

        this.state = {
            items: searchData
        }
    }

    render() {
        return (
            <div className="search-component">
                <div className="search-component__title">{this.props.title || 'Search'}</div>
                <div className="search-component__form">
                    <input className="search-component__input" type="text" ref={(ref) => this.refSearchInput = ref} />
                    <button className="search-component__submit">Search</button>
                </div>
                <div className="search-component__results">
                    <SearchResultsComponent items={this.state.items} onItemSelect={this.props.onItemSelect} perPage={5}/>
                </div>
            </div>
        );
    }
}

SearchComponent.propTypes = {
    title: PropTypes.string,
    canSelectContent: PropTypes.func,
    multiple: PropTypes.bool,
    startingLocationId: PropTypes.string,
    shouldLoadContent: PropTypes.bool,
    onItemSelect: PropTypes.func.isRequired
};
