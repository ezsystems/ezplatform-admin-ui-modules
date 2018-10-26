import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TableViewItemComponent from './table.view.item.component';

import './css/table.view.component.css';

const KEY_CONTENT_NAME = 'ContentName';
const KEY_DATE_MODIFIED = 'DateModified';
const KEY_LOCATION_PRIORITY = 'LocationPriority';
const SORTKEY_MAP = {
    [KEY_CONTENT_NAME]: 'name',
    [KEY_DATE_MODIFIED]: 'date',
    [KEY_LOCATION_PRIORITY]: 'priority',
};

export default class TableViewComponent extends Component {
    constructor(props) {
        super(props);

        this.sortByName = this.sortByName.bind(this);
        this.sortByDate = this.sortByDate.bind(this);
        this.sortByPriority = this.sortByPriority.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.selectAll = this.selectAll.bind(this);
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

    /**
     * Renders single list item
     *
     * @method renderItem
     * @param {Object} data
     * @returns {JSX.Element}
     * @memberof TableViewComponent
     */
    renderItem(data) {
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
            />
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

        const { sortClause, sortOrder } = this.props;

        if (sortClause) {
            const headSortClass = sortOrder === 'ascending' ? `${headClass}--sort-asc` : `${headClass}--sort-desc`;
            const headSortByClass = `${headClass}--sort-by-${SORTKEY_MAP[sortClause]}`;

            headClass = `${headClass} ${headSortClass} ${headSortByClass}`;
        }

        const headerNameLabel = Translator.trans(/*@Desc("Name")*/ 'items_table.header.name', {}, 'sub_items');
        const headerModifiedLabel = Translator.trans(/*@Desc("Modified")*/ 'items_table.header.modified', {}, 'sub_items');
        const headerContentTypeLabel = Translator.trans(/*@Desc("Content type")*/ 'items_table.header.content_type', {}, 'sub_items');
        const headerPriorityLabel = Translator.trans(/*@Desc("Priority")*/ 'items_table.header.priority', {}, 'sub_items');
        const headerTranslationsLabel = Translator.trans(/*@Desc("Translations")*/ 'items_table.header.translations', {}, 'sub_items');
        const { selectedLocationsIds } = this.props;
        const anyLocationSelected = !!selectedLocationsIds.size;

        return (
            <thead className={headClass}>
                <tr className="c-table-view__row">
                    <td className={cellHeadClass}>
                        <input type="checkbox" checked={anyLocationSelected} onChange={this.selectAll} />
                    </td>
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
        const content = items.map(this.renderItem);

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
    toggleAllItemsSelect: PropTypes.func.isRequired,
    selectedLocationsIds: PropTypes.instanceOf(Set),
    onSortChange: PropTypes.func.isRequired,
    sortClause: PropTypes.string.isRequired,
    sortOrder: PropTypes.string.isRequired,
};

TableViewComponent.defaultProps = {};
