import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SearchPaginationComponent from './search.pagination.component';
import SearchResultsItemComponent from './search.results.item.component';

export default class SearchResultsComponent extends Component {
    constructor(props) {
        super(props);

        console.warn('[DEPRECATED] SearchResultsComponent is deprecated');
        console.warn('[DEPRECATED] it will be removed from ezplatform-admin-ui-modules 2.0');
        console.warn('[DEPRECATED] use ContentTableComponent instead');

        this.state = {
            activePage: 0,
            pages: this.splitToPages(props.items, props.perPage),
        };

        this.setActivePage = this.setActivePage.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    UNSAFE_componentWillReceiveProps({ items, perPage }) {
        this.setState(() => ({ pages: this.splitToPages(items, perPage) }));
    }

    /**
     * Splits items into pages
     *
     * @method splitToPages
     * @param {Array} items
     * @param {Number} perPage
     * @returns {Array}
     * @memberof SearchResultsComponent
     */
    splitToPages(items, perPage) {
        return items.reduce((pages, item, index) => {
            const pageIndex = Math.floor(index / perPage);

            if (!pages[pageIndex]) {
                pages[pageIndex] = [];
            }

            pages[pageIndex].push(item);

            return pages;
        }, []);
    }

    /**
     * Sets active page index state
     *
     * @method setActivePage
     * @param {Number} activePage
     * @memberof SearchResultsComponent
     */
    setActivePage(activePage) {
        this.setState(() => ({ activePage }));
    }

    /**
     * Renders single search results item
     *
     * @method renderItem
     * @param {Object} item
     * @returns {Element}
     * @memberof SearchResultsComponent
     */
    renderItem(item) {
        item = item.value.Location;

        const { contentTypesMap, onItemSelect } = this.props;

        return <SearchResultsItemComponent key={item.id} data={item} contentTypesMap={contentTypesMap} onPreview={onItemSelect} />;
    }

    /**
     * Renders pagination
     *
     * @method renderPagination
     * @returns {Element}
     * @memberof SearchResultsComponent
     */
    renderPagination() {
        const paginationAttrs = {
            minIndex: 0,
            maxIndex: this.state.pages.length - 1,
            activeIndex: this.state.activePage,
            onChange: this.setActivePage,
        };

        if (paginationAttrs.minIndex === paginationAttrs.maxIndex) {
            return null;
        }

        return <SearchPaginationComponent {...paginationAttrs} />;
    }

    render() {
        if (!this.state.pages.length) {
            return null;
        }

        const resultsTitle = Translator.trans(/*@Desc("Search results")*/ 'search.results_table.title', {}, 'universal_discovery_widget');
        const headerNameLabel = Translator.trans(/*@Desc("Name")*/ 'search.results_table.header.name', {}, 'universal_discovery_widget');
        const headerTypeLabel = Translator.trans(
            /*@Desc("Content Type")*/ 'search.results_table.header.type',
            {},
            'universal_discovery_widget'
        );

        return (
            <div className="c-search-results">
                <div className="c-search-results__title">
                    {resultsTitle} ({this.state.items.length})
                </div>
                <div className="c-search-results__list-headers">
                    <div className="c-search-results__list-header c-search-results__list-header--name">{headerNameLabel}</div>
                    <div className="c-search-results__list-header c-search-results__list-header--type">{headerTypeLabel}</div>
                    <div className="c-search-results__list-header c-search-results__list-header--span" />
                </div>
                <div className="c-search-results__list">{this.state.pages[this.state.activePage].map(this.renderItem)}</div>
                {this.renderPagination()}
            </div>
        );
    }
}

SearchResultsComponent.propTypes = {
    items: PropTypes.array.isRequired,
    perPage: PropTypes.number.isRequired,
    onItemSelect: PropTypes.func.isRequired,
    contentTypesMap: PropTypes.object.isRequired,
};
