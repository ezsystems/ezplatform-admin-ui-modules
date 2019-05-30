import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';

import TableViewItemComponent from './table.view.item.component';
import TableViewColumnsTogglerComponent from './table.view.columns.toggler';

const KEY_CONTENT_NAME = 'ContentName';
const KEY_DATE_MODIFIED = 'DateModified';
const KEY_LOCATION_PRIORITY = 'LocationPriority';
const SORTKEY_MAP = {
    [KEY_CONTENT_NAME]: 'name',
    [KEY_DATE_MODIFIED]: 'date',
    [KEY_LOCATION_PRIORITY]: 'priority',
};
const COLUMNS_VISIBILITY_LOCAL_STORAGE_DATA_KEY = 'sub-items_columns-visibility';
const DEFAULT_COLUMNS_VISIBILITY = {
    modified: true,
    contentType: true,
    priority: true,
    translations: true,
    childrenCount:true,
};
const TABLE_CELL_CLASS = 'c-table-view__cell';
const TABLE_HEAD_CLASS = `${TABLE_CELL_CLASS} ${TABLE_CELL_CLASS}--head`;
const TABLE_CELL_SORT_CLASS = `${TABLE_CELL_CLASS} ${TABLE_CELL_CLASS}--sortable`;
export const headerLabels = {
    name: Translator.trans(/*@Desc("Name")*/ 'items_table.header.name', {}, 'sub_items'),
    modified: Translator.trans(/*@Desc("Modified")*/ 'items_table.header.modified', {}, 'sub_items'),
    contentType: Translator.trans(/*@Desc("Content type")*/ 'items_table.header.content_type', {}, 'sub_items'),
    priority: Translator.trans(/*@Desc("Priority")*/ 'items_table.header.priority', {}, 'sub_items'),
    translations: Translator.trans(/*@Desc("Translations")*/ 'items_table.header.translations', {}, 'sub_items'),
    childrenCount: Translator.trans(/*@Desc("Children count")*/ 'items_table.header.children_count', {}, 'sub_items'),
};

export default class TableViewComponent extends Component {
    constructor(props) {
        super(props);

        this.sortByName = this.sortByName.bind(this);
        this.sortByDate = this.sortByDate.bind(this);
        this.sortByPriority = this.sortByPriority.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.setColumnsVisibilityInLocalStorage = this.setColumnsVisibilityInLocalStorage.bind(this);
        this.toggleColumnVisibility = this.toggleColumnVisibility.bind(this);

        this._refColumnsTogglerButton = createRef();

        this.state = {
            columnsVisibility: this.getColumnsVisibilityFromLocalStorage(),
        };
    }

    getColumnsVisibilityFromLocalStorage() {
        const columnsVisibilityData = localStorage.getItem(COLUMNS_VISIBILITY_LOCAL_STORAGE_DATA_KEY);

        return columnsVisibilityData ? JSON.parse(columnsVisibilityData) : DEFAULT_COLUMNS_VISIBILITY;
    }

    setColumnsVisibilityInLocalStorage() {
        const columnsVisibilityData = JSON.stringify(this.state.columnsVisibility);

        localStorage.setItem(COLUMNS_VISIBILITY_LOCAL_STORAGE_DATA_KEY, columnsVisibilityData);
    }

    /**
     * Changes sort to name
     */
    sortByName() {
        const { onSortChange } = this.props;

        onSortChange(KEY_CONTENT_NAME);
    }

    /**
     * Changes sort to modification date
     */
    sortByDate() {
        const { onSortChange } = this.props;

        onSortChange(KEY_DATE_MODIFIED);
    }

    /**
     * Changes sort to priority
     */
    sortByPriority() {
        const { onSortChange } = this.props;

        onSortChange(KEY_LOCATION_PRIORITY);
    }

    /**
     * Selects all visible items
     *
     * @param {Event} event
     */
    selectAll(event) {
        const { toggleAllItemsSelect } = this.props;
        const isSelectAction = event.target.checked;

        toggleAllItemsSelect(isSelectAction);
    }

    toggleColumnVisibility(column) {
        this.setState(
            (state) => ({
                columnsVisibility: {
                    ...state.columnsVisibility,
                    [column]: !state.columnsVisibility[column],
                },
            }),
            this.setColumnsVisibilityInLocalStorage
        );
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
        const { columnsVisibility } = this.state;
        const {
            contentTypesMap,
            handleItemPriorityUpdate,
            handleEditItem,
            generateLink,
            languages,
            onItemSelect,
            selectedLocationsIds,
        } = this.props;
        const isSelected = selectedLocationsIds.has(data.location.id);

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
                isSelected={isSelected}
                columnsVisibility={columnsVisibility}
            />
        );
    }

    renderModifiedHeader() {
        if (!this.state.columnsVisibility.modified) {
            return null;
        }

        return (
            <th
                className={`${TABLE_HEAD_CLASS} ${TABLE_CELL_CLASS}--date ${TABLE_CELL_SORT_CLASS}`}
                onClick={this.sortByDate}
                tabIndex="-1">
                <span className="c-table-view__label">{headerLabels.modified}</span>
            </th>
        );
    }

    renderContentTypeHeader() {
        if (!this.state.columnsVisibility.contentType) {
            return null;
        }

        return (
            <th className={TABLE_HEAD_CLASS}>
                <span className="c-table-view__label">{headerLabels.contentType}</span>
            </th>
        );
    }

    renderPriorityHeader() {
        if (!this.state.columnsVisibility.priority) {
            return null;
        }

        return (
            <th
                className={`${TABLE_HEAD_CLASS} ${TABLE_CELL_CLASS}--priority ${TABLE_CELL_SORT_CLASS}`}
                onClick={this.sortByPriority}
                tabIndex="-1">
                <span className="c-table-view__label">{headerLabels.priority}</span>
            </th>
        );
    }

    renderChildrenCountHeader() {
        if (!this.state.columnsVisibility.childrenCount) {
            return null;
        }

        return (
            <th
                className={`${TABLE_HEAD_CLASS} ${TABLE_CELL_CLASS}--children-count ${TABLE_CELL_SORT_CLASS}`}
                tabIndex="-1">
                <span className="c-table-view__label">{headerLabels.childrenCount}</span>
            </th>
        );
    }

    renderTranslationsHeader() {
        if (!this.state.columnsVisibility.translations) {
            return null;
        }

        return (
            <th className={`${TABLE_HEAD_CLASS}`}>
                <span className="c-table-view__label">{headerLabels.translations}</span>
            </th>
        );
    }

    /**
     * Renders table's head
     *
     * @method renderHead
     * @returns {JSX.Element|null}
     * @memberof GridViewComponent
     */
    renderHead() {
        const cellClass = 'c-table-view__cell';
        const { items } = this.props;
        let headClass = 'c-table-view__head';

        if (!items.length) {
            return null;
        }

        const { sortClause, sortOrder } = this.props;

        if (sortClause) {
            const headSortOrderClass = sortOrder === 'ascending' ? `${headClass}--sort-asc` : `${headClass}--sort-desc`;
            const headSortByClass = `${headClass}--sort-by-${SORTKEY_MAP[sortClause]}`;

            headClass = `${headClass} ${headSortOrderClass} ${headSortByClass}`;
        }

        const { columnsVisibility } = this.state;
        const { selectedLocationsIds } = this.props;
        const anyLocationSelected = !!selectedLocationsIds.size;

        return (
            <thead className={headClass}>
                <tr className="c-table-view__row">
                    <th className={`${TABLE_HEAD_CLASS} ${cellClass}--checkbox`}>
                        <input type="checkbox" checked={anyLocationSelected} onChange={this.selectAll} />
                    </th>
                    <th className={TABLE_HEAD_CLASS} />
                    <th
                        className={`${TABLE_HEAD_CLASS} ${TABLE_CELL_CLASS}--name ${TABLE_CELL_SORT_CLASS}`}
                        onClick={this.sortByName}
                        tabIndex="-1">
                        <span className="c-table-view__label">{headerLabels.name}</span>
                    </th>
                    {this.renderModifiedHeader()}
                    {this.renderContentTypeHeader()}
                    {this.renderPriorityHeader()}
                    {this.renderChildrenCountHeader()}
                    {this.renderTranslationsHeader()}
                    <th className={`${TABLE_HEAD_CLASS} ${cellClass}--actions`}>
                        <TableViewColumnsTogglerComponent
                            columnsVisibility={columnsVisibility}
                            toggleColumnVisibility={this.toggleColumnVisibility}
                        />
                    </th>
                </tr>
            </thead>
        );
    }

    render() {
        const { items } = this.props;
        const content = items.map(this.renderItem);

        return (
            <div className="c-table-view__wrapper">
                <div className="c-table-view__scroller">
                    <table className="c-table-view">
                        {this.renderHead()}
                        <tbody className="c-table-view__body">{content}</tbody>
                    </table>
                </div>
            </div>
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
    toggleAllItemsSelect: PropTypes.func.isRequired,
    selectedLocationsIds: PropTypes.instanceOf(Set),
    onSortChange: PropTypes.func.isRequired,
    sortClause: PropTypes.string.isRequired,
    sortOrder: PropTypes.string.isRequired,
};
