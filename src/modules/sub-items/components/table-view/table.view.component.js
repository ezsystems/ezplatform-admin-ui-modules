import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TableViewItemComponent from './table.view.item.component';
import NoItemsComponent from '../no-items/no.items.component';

import './css/table.view.component.css';

const SORTKEY_NAME = 'name';
const SORTKEY_DATE = 'date';
const SORTKEY_PRIORITY = 'priority';

export default class TableViewComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: props.items,
            isAscSort: false,
            sortKey: false,
        };
    }

    componentWillReceiveProps({ items }) {
        this.sortItems(items);
    }

    /**
     * Sorts provided items
     *
     * @method sortItems
     * @param {Array} items
     * @memberof TableViewComponent
     */
    sortItems(items) {
        const sortKey = this.state.sortKey;

        if (!sortKey) {
            this.setState((state) => Object.assign({}, state, { items }));
        }

        if (sortKey === SORTKEY_NAME) {
            this.sortByName(items);
        } else if (sortKey === SORTKEY_DATE) {
            this.sortByDate(items);
        } else if (sortKey === SORTKEY_PRIORITY) {
            this.sortByPriority(items);
        } else {
            this.setState((state) => Object.assign({}, state, { items }));
        }
    }

    /**
     * Sorts provided items by name
     *
     * @method sortByName
     * @param {Array} items
     * @memberof TableViewComponent
     */
    sortByName(items) {
        this.setState((state) => {
            const isOnClick = !Array.isArray(items);
            const isAscSort = isOnClick ? !state.isAscSort : state.isAscSort;

            items = isOnClick ? state.items : items;

            items.sort((a, b) => {
                if (isAscSort) {
                    return a.content.Name.localeCompare(b.content.Name);
                }

                return b.content.Name.localeCompare(a.content.Name);
            });

            return Object.assign({}, state, {
                items,
                isAscSort,
                sortKey: SORTKEY_NAME,
            });
        });
    }

    /**
     * Sorts provided items by date
     *
     * @method sortByDate
     * @param {Array} items
     * @memberof TableViewComponent
     */
    sortByDate(items) {
        this.setState((state) => {
            const isOnClick = !Array.isArray(items);
            const isAscSort = isOnClick ? !state.isAscSort : state.isAscSort;

            items = isOnClick ? state.items : items;

            items.sort((a, b) => {
                if (isAscSort) {
                    return new Date(a.content.lastModificationDate) - new Date(b.content.lastModificationDate);
                }

                return new Date(b.content.lastModificationDate) - new Date(a.content.lastModificationDate);
            });

            return Object.assign({}, state, {
                items,
                isAscSort,
                sortKey: SORTKEY_DATE,
            });
        });
    }

    /**
     * Sorts provided items by priority
     *
     * @method sortByPriority
     * @param {Array} items
     * @memberof TableViewComponent
     */
    sortByPriority(items) {
        this.setState((state) => {
            const isOnClick = !Array.isArray(items);
            const isAscSort = isOnClick ? !state.isAscSort : state.isAscSort;

            items = isOnClick ? state.items : items;

            items.sort((a, b) => {
                if (isAscSort) {
                    return a.location.priority - b.location.priority;
                }

                return -a.location.priority + b.location.priority;
            });

            return Object.assign({}, state, {
                items,
                isAscSort,
                sortKey: SORTKEY_PRIORITY,
            });
        });
    }

    /**
     * Renders single list item
     *
     * @method renderItem
     * @param {Object} data
     * @returns {Element}
     * @memberof TableViewComponent
     */
    renderItem(data) {
        const { contentTypesMap, handleItemPriorityUpdate, labels, handleEditItem, generateLink, languages } = this.props;

        return (
            <TableViewItemComponent
                key={data.location.id}
                {...data}
                contentTypesMap={contentTypesMap}
                onItemPriorityUpdate={handleItemPriorityUpdate}
                labels={labels.tableViewItem}
                languages={languages}
                handleEditItem={handleEditItem}
                generateLink={generateLink}
            />
        );
    }

    /**
     * Renders no items message
     *
     * @method renderNoItems
     * @returns {Element}
     * @memberof TableViewComponent
     */
    renderNoItems() {
        return (
            <tr>
                <td>
                    <NoItemsComponent labels={this.props.labels} />
                </td>
            </tr>
        );
    }

    /**
     * Renders table's head
     *
     * @method renderHead
     * @returns {Element}
     * @memberof GridViewComponent
     */
    renderHead() {
        const cellClass = 'c-table-view__cell';
        const cellHeadClass = `${cellClass}--head`;
        const cellSortClass = `${cellClass}--sortable`;
        const { labels, items } = this.props;
        let headClass = 'c-table-view__head';

        if (!items.length) {
            return;
        }

        if (this.state.sortKey) {
            const headSortClass = this.state.isAscSort ? `${headClass}--sort-asc` : `${headClass}--sort-desc`;
            const headSortByClass = `${headClass}--sort-by-${this.state.sortKey}`;

            headClass = `${headClass} ${headSortClass} ${headSortByClass}`;
        }

        return (
            <thead className={headClass}>
                <tr className="c-table-view__row">
                    <td className={`${cellHeadClass} ${cellClass}--name ${cellSortClass}`} onClick={this.sortByName.bind(this)}>
                        <span className="c-table-view__label">{labels.tableView.headerName}</span>
                    </td>
                    <td className={`${cellHeadClass} ${cellClass}--date ${cellSortClass}`} onClick={this.sortByDate.bind(this)}>
                        <span className="c-table-view__label">{labels.tableView.headerModified}</span>
                    </td>
                    <td className={cellHeadClass}>
                        <span className="c-table-view__label">{labels.tableView.headerContentType}</span>
                    </td>
                    <td className={`${cellHeadClass} ${cellClass}--priority ${cellSortClass}`} onClick={this.sortByPriority.bind(this)}>
                        <span className="c-table-view__label">{labels.tableView.headerPriority}</span>
                    </td>
                    <td className={cellHeadClass} colSpan="2">
                        <span className="c-table-view__label">{labels.tableView.headerTranslations}</span>
                    </td>
                </tr>
            </thead>
        );
    }

    render() {
        const { items } = this.props;
        const content = items.length ? items.map(this.renderItem.bind(this)) : this.renderNoItems();

        return (
            <table className="c-table-view">
                {this.renderHead()}
                <tbody className="c-table-view__body">{content}</tbody>
            </table>
        );
    }
}

TableViewComponent.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    contentTypesMap: PropTypes.object.isRequired,
    handleItemPriorityUpdate: PropTypes.func.isRequired,
    labels: PropTypes.shape({
        tableView: PropTypes.shape({
            headerName: PropTypes.string.isRequired,
            headerContentType: PropTypes.string.isRequired,
            headerModified: PropTypes.string.isRequired,
            headerPriority: PropTypes.string.isRequired,
            headerTranslations: PropTypes.string.isRequired,
        }),
        tableViewItem: PropTypes.object.isRequired,
        noItems: PropTypes.object.isRequired,
    }).isRequired,
    generateLink: PropTypes.func.isRequired,
    handleEditItem: PropTypes.func.isRequired,
    languages: PropTypes.object.isRequired,
};
