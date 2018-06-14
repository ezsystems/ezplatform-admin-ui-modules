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
            count: props.count,
        };

        this.setActivePage = this.setActivePage.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    componentWillMount() {
        this.ensurePageItemsLoaded(0);
    }

    componentWillReceiveProps({ items, perPage, count }) {
        const maxPage = !count ? 0 : Math.floor((count - 1) / perPage);

        this.setState((state) => ({
            ...state,
            items,
            count,
            activePage: state.activePage <= maxPage ? state.activePage : maxPage,
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

    ensurePageItemsLoaded(activePage) {
        const { requireItemsCount } = this.props;
        const { count, perPage } = this.state;
        const itemsNeededCount = Math.min(perPage * (activePage + 1), count);

        requireItemsCount(itemsNeededCount);
    }

    /**
     * Sets active page index state
     *
     * @method setActivePage
     * @param {Number} activePage
     * @memberof ContentTableComponent
     */
    setActivePage(activePage) {
        this.ensurePageItemsLoaded(activePage);

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
     * Renders single search results item
     *
     * @method renderHeader
     * @returns {Element}
     * @memberof ContentTableComponent
     */
    renderHeader() {
        const { items } = this.state;
        const showHeader = !!items.length;

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
        const { activePage, count, perPage } = this.state;
        const { labels } = this.props;
        const pagesCount = !count ? 0 : Math.floor((count - 1) / perPage) + 1;
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

    renderPage() {
        const { pages, activePage, perPage, count } = this.state;
        const itemsCount = this.state.items.length;
        const neededItemsCount = Math.min((activePage + 1) * perPage, count);
        const allNeededItemsLoaded = itemsCount >= neededItemsCount;

        if (!allNeededItemsLoaded) {
            return (
                <svg className="c-content-table__loading-spinner ez-icon ez-spin ez-icon-x2 ez-icon-spinner">
                    <use xlinkHref="/bundles/ezplatformadminui/img/ez-icons.svg#spinner" />
                </svg>
            );
        }

        const pageToRender = !itemsCount ? [] : pages[activePage];

        return pageToRender.map(this.renderItem);
    }

    render() {
        const { title, count } = this.props;

        if (!count) {
            return null;
        }

        return (
            <div className="c-content-table">
                <div className="c-content-table__title">
                    {title} ({count})
                </div>
                {this.renderHeader()}
                <div className="c-content-table__list">
                    {this.renderPage()}
                </div>
                {this.renderPagination()}
            </div>
        );
    }
}

ContentTableComponent.propTypes = {
    items: PropTypes.array.isRequired,
    count: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    onItemSelect: PropTypes.func.isRequired,
    contentTypesMap: PropTypes.object.isRequired,
    onItemClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    noItemsMessage: PropTypes.string,
    requireItemsCount: PropTypes.func.isRequired,
    labels: PropTypes.shape({
        contentTablePagination: PropTypes.object.isRequired,
        contentTableHeader: PropTypes.object.isRequired,
        contentTableItem: PropTypes.object.isRequired,
    }).isRequired,
};

ContentTableComponent.defaultProps = {
    onItemClick: null,
};
