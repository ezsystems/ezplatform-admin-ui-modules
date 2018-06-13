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
            pages: this.splitToPages(props.items, props.perPage),
        };

        this.setActivePage = this.setActivePage.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    componentWillReceiveProps({ items, perPage }) {
        this.setState((state) => ({
            ...state,
            items,
            pages: this.splitToPages(items, perPage),
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
     * @param {Number} activePage
     * @memberof ContentTableComponent
     */
    setActivePage(activePage) {
        this.setState((state) => ({
            ...state,
            activePage,
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

        return (
            <ContentTableItemComponent
                key={location.id}
                data={location}
                contentTypesMap={contentTypesMap}
                onPreview={onItemSelect}
                onItemClick={onItemClick}
                labels={labels}
            />
        );
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
        const { noItemsMessage } = this.props;
        const showMessage = !items.length && !!noItemsMessage;

        if (!showMessage) {
            return null;
        }

        return <div className="c-content-table__no-items">{noItemsMessage}</div>;
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
        const showHeader = !items.length;

        if (!showHeader) {
            return null;
        }

        const { labels } = this.props;

        return <ContentTableHeaderComponent labels={labels} />;
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
            labels,
            minIndex: 0,
            maxIndex: pagesCount - 1,
            activeIndex: activePage,
            onChange: this.setActivePage,
        };

        if (!pagesCount || paginationAttrs.minIndex === paginationAttrs.maxIndex) {
            return null;
        }

        return <ContentTablePaginationComponent {...paginationAttrs} />;
    }

    render() {
        const { showWhenNoItems, title } = this.props;
        const { pages, activePage } = this.state;

        if (!pages.length && !showWhenNoItems) {
            return null;
        }

        const itemsCount = this.state.items.length;
        const pageToRender = !itemsCount ? [] : pages[activePage];

        return (
            <div className="c-content-table">
                <div className="c-content-table__title">
                    {title} ({itemsCount})
                </div>
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
    title: PropTypes.string.isRequired,
    noItemsMessage: PropTypes.string,
    labels: PropTypes.shape({
        contentTablePagination: PropTypes.object.isRequired,
        contentTableHeader: PropTypes.object.isRequired,
        contentTableItem: PropTypes.object.isRequired,
    }).isRequired,
};

ContentTableComponent.defaultProps = {
    onItemClick: null,
    showWhenNoItems: false,
};
