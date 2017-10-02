import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TableViewItemComponent from './table.view.item.component';

import './css/table.view.component.css';

export default class TableViewComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: props.items,
            isAscSort: false,
            sortKey: false
        };
    }

    componentWillReceiveProps({items}) {
        this.setState(state => Object.assign({}, state, {items}));
    }

    renderItem(data) {
        return <TableViewItemComponent 
            key={data.location.id} {...data} 
            contentTypesMap={this.props.contentTypesMap} 
            onItemPriorityUpdate={this.props.handleItemPriorityUpdate}
        />;
    }

    sortByName() {
        this.setState(state => {
            const items = state.items;
            const isAscSort = !state.isAscSort;

            items.sort((a, b) => {
                if (isAscSort) {
                    return a.content.Name.localeCompare(b.content.Name);
                }
                
                return b.content.Name.localeCompare(a.content.Name);
            });

            return Object.assign({}, state, {
                items, 
                isAscSort,
                sortKey: 'name'
            });
        });
    }

    sortByDate() {
        this.setState(state => {
            const items = state.items;
            const isAscSort = !state.isAscSort;

            items.sort((a, b) => {
                if (isAscSort) {
                    return new Date(a.content.lastModificationDate) - new Date(b.content.lastModificationDate);
                }
                
                return (new Date(b.content.lastModificationDate) - new Date(a.content.lastModificationDate));
            });

            return Object.assign({}, state, {
                items, 
                isAscSort,
                sortKey: 'date'
            });
        });
    }

    sortByPriority() {
        this.setState(state => {
            const items = state.items;
            const isAscSort = !state.isAscSort;

            items.sort((a, b) => {
                if (isAscSort) {
                    return a.location.priority - b.location.priority;
                }
                
                return (- a.location.priority + b.location.priority);
            });

            return Object.assign({}, state, {
                items, 
                isAscSort,
                sortKey: 'priority'
            });
        });
    }

    render() {
        const cellClass = 'c-table-view__cell';
        const cellHeadClass = `${cellClass}--head`;
        const cellSortClass = `${cellClass}--sortable`;
        let headClass = 'c-table-view__head';

        if (this.state.sortKey) {
            const headSortClass = this.state.isAscSort ? `${headClass}--sort-asc` : `${headClass}--sort-desc`;
            const headSortByClass = `${headClass}--sort-by-${this.state.sortKey}`;

            headClass = `${headClass} ${headSortClass} ${headSortByClass}`;
        }

        return (
            <table className="c-table-view">
                <thead className={headClass}>
                    <tr className="c-table-view__row">
                        <td className={`${cellHeadClass} ${cellClass}--name ${cellSortClass}`} onClick={this.sortByName.bind(this)}>
                            <span className="c-table-view__label">Name</span>
                        </td>
                        <td className={`${cellHeadClass} ${cellClass}--date ${cellSortClass}`} onClick={this.sortByDate.bind(this)}>
                            <span className="c-table-view__label">Modified</span>
                        </td>
                        <td className={cellHeadClass}>
                            <span className="c-table-view__label">Content type</span>
                        </td>
                        <td className={`${cellHeadClass} ${cellClass}--priority ${cellSortClass}`} onClick={this.sortByPriority.bind(this)}>
                            <span className="c-table-view__label">Priority</span>
                        </td>
                        <td className={cellHeadClass} colSpan="2">
                            <span className="c-table-view__label">Translations</span>
                        </td>
                    </tr>
                </thead>
                <tbody className="c-table-view__body">{this.props.items.map(this.renderItem.bind(this))}</tbody>
            </table>
        );
    }
}

TableViewComponent.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    contentTypesMap: PropTypes.object,
    handleItemPriorityUpdate: PropTypes.func.isRequired
};