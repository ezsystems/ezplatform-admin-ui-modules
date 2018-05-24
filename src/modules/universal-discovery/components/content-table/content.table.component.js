import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ContentTablePaginationComponent from './content.table.pagination.component';
import ContentTableItemComponent from './content.table.item.component';
import ContentTableHeaderComponent from './content.table.header.component';

import './css/content.table.component.css';

export default class ContentTableComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: props.items,
            perPage: props.perPage,
            activePage: 0,
            pages: this.splitToPages(props.items, props.perPage)
        };

        this.setActivePage = this.setActivePage.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    componentWillReceiveProps({ items, perPage }) {
        this.setState(state => ({
            ...state,
            items,
            pages: this.splitToPages(items, perPage)
        }));
    }

    /**
     * Splits items into pages
     *
     * @method splitToPages
     * @param {Array} items
     * @param {Number} perPage
     * @returns {Array}
     * @memberof ContentTableComponent
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
     * @param {number} activePage
     * @memberof ContentTableComponent
     */
    setActivePage(activePage) {
        this.setState(state => ({
            ...state,
            activePage
        }));
    }

    /**
     * Renders single item
     *
     * @method renderItem
     * @param {Object} item
     * @returns {Element}
     * @memberof ContentTableComponent
     */
    renderItem(item) {
        const location = item.Location;

        const { contentTypesMap, onItemSelect, onItemClick, labels } = this.props;

        return <ContentTableItemComponent
            key={location.id}
            data={location}
            contentTypesMap={contentTypesMap}
            onPreview={onItemSelect}
            onItemClick={onItemClick}
            labels={labels.item} />;
    }

    /**
     * Renders no items message 
     *
     * @method renderNoItemsMessage
     * @returns {Element}
     * @memberof ContentTableComponent
     */
    renderNoItemsMessage() {
        const { items } = this.state;
        const { noItems } = this.props.labels;
        const showMessage = items.length === 0 && !!noItems;

        if (!showMessage) {
            return null;
        }

        return (
            <div className="c-content-table__no-items">
                {noItems}
            </div>
        )
    }

    /**
     * Renders single search results item
     *
     * @method renderHeader
     * @returns {Element}
     * @memberof ContentTableComponent
     */
    renderHeader() {
        const { items } = this.state;
        const showHeader = items.length !== 0;

        if (!showHeader) {
            return null;
        }

        const { labels } = this.props;

        return <ContentTableHeaderComponent
            labels={labels.header}
        />;
    }

    /**
     * Renders pagination
     *
     * @method renderPagination
     * @returns {Element}
     * @memberof ContentTableComponent
     */
    renderPagination() {
        const { pages, activePage } = this.state;
        const { labels } = this.props;
        const pagesCount = pages.length;

        const paginationAttrs = {
            minIndex: 0,
            maxIndex: pagesCount - 1,
            activeIndex: activePage,
            onChange: this.setActivePage,
            labels: labels.pagination
        };

        if (pagesCount === 0 || paginationAttrs.minIndex === paginationAttrs.maxIndex) {
            return null;
        }

        return <ContentTablePaginationComponent {...paginationAttrs} />;
    }

    render() {
        const { showWhenNoItems, labels } = this.props;
        const { pages, activePage } = this.state;

        if (!pages.length && !showWhenNoItems) {
            return null;
        }

        const itemsCount = this.state.items.length;
        const pageToRender = itemsCount === 0 ? [] : pages[activePage];

        return (
            <div className="c-content-table">
                <div className="c-content-table__title">{labels.title} ({itemsCount})</div>
                {this.renderHeader()}
                <div className="c-content-table__list">
                    {pageToRender.map(this.renderItem)}
                    {this.renderNoItemsMessage()}
                </div>
                {this.renderPagination()}
            </div>
        );
    }
}

ContentTableComponent.propTypes = {
    items: PropTypes.array.isRequired,
    perPage: PropTypes.number.isRequired,
    onItemSelect: PropTypes.func.isRequired,
    contentTypesMap: PropTypes.object.isRequired,
    onItemClick: PropTypes.func.isRequired,
    showWhenNoItems: PropTypes.bool,

    labels: PropTypes.shape({
        title: PropTypes.string.isRequired,
        header: PropTypes.object.isRequired,
        item: PropTypes.object.isRequired,
        noItems: PropTypes.string.isRequired,
        pagination: PropTypes.shape({
            first: PropTypes.string.isRequired,
            prev: PropTypes.string.isRequired,
            next: PropTypes.string.isRequired,
            last: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired
};

ContentTableComponent.defaultProps = {
    onItemClick: null,
    showWhenNoItems: false
}
