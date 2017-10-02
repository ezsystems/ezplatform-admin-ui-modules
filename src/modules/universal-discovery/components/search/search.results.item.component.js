import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './css/search.results.item.component.css';

export default class SearchResultsItemComponent extends Component {
    handlePreviewClick() {
        this.props.onPreview(this.props.data);
    }

    render() {
        const item = this.props.data.ContentInfo.Content;

        return (
            <div className="search-results-item-component">
                <div className="search-results-item-component__name" title={item.Name}>{item.Name}</div>
                <div className="search-results-item-component__type" title={item.ContentType._href}>{item.ContentType._href}</div>
                <div className="search-results-item-component__actions">
                    <button className="search-results-item-component__btn--preview" onClick={this.handlePreviewClick.bind(this)}>Preview</button>
                </div>
            </div>
        );
    }
}

SearchResultsItemComponent.propTypes = {
    data: PropTypes.object.isRequired,
    onPreview: PropTypes.func.isRequired
};
