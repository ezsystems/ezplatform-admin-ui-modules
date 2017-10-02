import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './css/search.pagination.component.css';

export default class SearchPaginationComponent extends Component {
    loadFirstPage() {
        this.props.onChange(this.props.minIndex);
    }

    loadLastPage() {
        this.props.onChange(this.props.maxIndex);
    }

    loadPrevPage() {
        this.props.onChange(this.props.activeIndex - 1);
    }

    loadNextPage() {
        this.props.onChange(this.props.activeIndex + 1);
    }

    render() {
        const {minIndex, activeIndex, maxIndex} = this.props;
        const firstAttrs = {
            onClick: this.loadFirstPage.bind(this),
            className: 'search-pagination-component__btn--first'
        };

        const prevAttrs = {
            onClick: this.loadPrevPage.bind(this),
            className: 'search-pagination-component__btn--prev'
        };

        const nextAttrs = {
            onClick: this.loadNextPage.bind(this),
            className: 'search-pagination-component__btn--next'
        };

        const lastAttrs = {
            onClick: this.loadLastPage.bind(this),
            className: 'search-pagination-component__btn--last'
        };

        if (activeIndex === minIndex) { 
            firstAttrs.disabled = true; 
            prevAttrs.disabled = true;
        }

        if (activeIndex === maxIndex) { 
            nextAttrs.disabled = true;
            lastAttrs.disabled = true; 
        }

        return (
            <div className="search-pagination-component">
                <button {...firstAttrs}>&laquo; First</button>
                <button {...prevAttrs}>&lsaquo; Previous</button>
                <button {...nextAttrs}>Next &rsaquo;</button>
                <button {...lastAttrs}>Last &raquo;</button>
            </div>
        );
    }
}

SearchPaginationComponent.propTypes = {
    minIndex: PropTypes.number.isRequired,
    maxIndex: PropTypes.number.isRequired,
    activeIndex: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
};
