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

        this.sortByName = this.sortByName.bind(this);
        this.sortByDate = this.sortByDate.bind(this);
        this.sortByPriority = this.sortByPriority.bind(this);
        this.renderItem = this.renderItem.bind(this);

        this.state = {
            items: props.items,
            isAscSort: false,
            sortKey: false,
        };
    }

    UNSAFE_componentWillReceiveProps({ items }) {
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
            this.setState(() => ({ items }));
        }

        if (sortKey === SORTKEY_NAME) {
            this.sortByName(items);
        } else if (sortKey === SORTKEY_DATE) {
            this.sortByDate(items);
        } else if (sortKey === SORTKEY_PRIORITY) {
            this.sortByPriority(items);
        } else {
            this.setState(() => ({ items }));
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

            return {
                items,
                isAscSort,
                sortKey: SORTKEY_NAME,
            };
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

            return {
                items,
                isAscSort,
                sortKey: SORTKEY_DATE,
            };
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

                return b.location.priority - a.location.priority;
            });

            return {
                items,
                isAscSort,
                sortKey: SORTKEY_PRIORITY,
            };
        });
    }

    /**
     * Renders single list item
     *
     * @method renderItem
     * @param {Object} data
     * @returns {JSX.Element}
     * @memberof TableViewComponent
     */
    renderItem(data) {
        const { contentTypesMap, handleItemPriorityUpdate, handleEditItem, generateLink, languages, onItemSelect } = this.props;

        return (
            <TableViewItemComponent
                key={data.location.id}
                {...data}
                contentTypesMap={contentTypesMap}
                onItemPriorityUpdate={handleItemPriorityUpdate}
                languages={languages}
                handleEditItem={handleEditItem}
                generateLink={generateLink}
                onItemSelect={onItemSelect}
            />
        );
    }

    /**
     * Renders no items message
     *
     * @method renderNoItems
     * @returns {JSX.Element}
     * @memberof TableViewComponent
     */
    renderNoItems() {
        return (
            <tr>
                <td>
                    <NoItemsComponent />
                </td>
            </tr>
        );
    }

    /**
     * Renders table's head
     *
     * @method renderHead
     * @returns {JSX.Element}
     * @memberof GridViewComponent
     */
    renderHead() {
        const cellClass = 'c-table-view__cell';
        const cellHeadClass = `${cellClass}--head`;
        const cellSortClass = `${cellClass}--sortable`;
        const { items } = this.props;
        let headClass = 'c-table-view__head';

        if (!items.length) {
            return;
        }

        if (this.state.sortKey) {
            const headSortClass = this.state.isAscSort ? `${headClass}--sort-asc` : `${headClass}--sort-desc`;
            const headSortByClass = `${headClass}--sort-by-${this.state.sortKey}`;

            headClass = `${headClass} ${headSortClass} ${headSortByClass}`;
        }

        const headerNameLabel = Translator.trans(/*@Desc("Name")*/ 'items_table.header.name', {}, 'sub_items');
        const headerModifiedLabel = Translator.trans(/*@Desc("Modified")*/ 'items_table.header.modified', {}, 'sub_items');
        const headerContentTypeLabel = Translator.trans(/*@Desc("Content type")*/ 'items_table.header.content_type', {}, 'sub_items');
        const headerPriorityLabel = Translator.trans(/*@Desc("Priority")*/ 'items_table.header.priority', {}, 'sub_items');
        const headerTranslationsLabel = Translator.trans(/*@Desc("Translations")*/ 'items_table.header.translations', {}, 'sub_items');

        return (
            <thead className={headClass}>
                <tr className="c-table-view__row">
                    <td className={cellHeadClass} />
                    <td className={`${cellHeadClass} ${cellClass}--name ${cellSortClass}`} onClick={this.sortByName}>
                        <span className="c-table-view__label">{headerNameLabel}</span>
                    </td>
                    <td className={`${cellHeadClass} ${cellClass}--date ${cellSortClass}`} onClick={this.sortByDate}>
                        <span className="c-table-view__label">{headerModifiedLabel}</span>
                    </td>
                    <td className={cellHeadClass}>
                        <span className="c-table-view__label">{headerContentTypeLabel}</span>
                    </td>
                    <td className={`${cellHeadClass} ${cellClass}--priority ${cellSortClass}`} onClick={this.sortByPriority}>
                        <span className="c-table-view__label">{headerPriorityLabel}</span>
                    </td>
                    <td className={cellHeadClass} colSpan={2}>
                        <span className="c-table-view__label">{headerTranslationsLabel}</span>
                    </td>
                </tr>
            </thead>
        );
    }

    render() {
        const { items } = this.props;
        const content = items.length ? items.map(this.renderItem) : this.renderNoItems();

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
    generateLink: PropTypes.func.isRequired,
    handleEditItem: PropTypes.func.isRequired,
    languages: PropTypes.object.isRequired,
    onItemSelect: PropTypes.func.isRequired,
};
