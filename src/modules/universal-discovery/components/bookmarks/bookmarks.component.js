import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ContentTableComponent from '../content-table/content.table.component';
import { loadBookmarks } from '../../services/universal.discovery.service';
import { showErrorNotification } from '../../helpers/error.helper';

import './css/bookmarks.component.css';

export default class BookmarksComponent extends Component {
    constructor() {
        super();

        this.state = {
            items: [],
            isLoading: false
        };

        this.updateItemsState = this.updateItemsState.bind(this);
    }

    componentDidMount() {
        this.loadBookmarks();
    }

    /**
     * Called when bookmark was removed
     *
     * @method onBookmarkRemoved
     * @param {Object} itemLocation
     * @memberof BookmarksComponent
     */
    onBookmarkRemoved(itemLocation) {
        this.removeItem(itemLocation);
    }

    /**
     * Called when bookmark was added
     *
     * @method onBookmarkAdded
     * @param {Object} itemLocation
     * @memberof BookmarksComponent
     */
    onBookmarkAdded(itemLocation) {
        this.addItem(itemLocation);
    }

    /**
     * Removes item from list
     *
     * @method removeItem
     * @param {Object} itemToRemoveLocation
     * @memberof BookmarksComponent
     */
    removeItem(itemToRemoveLocation) {
        const areSameItems = (a, b) => a.id === b.id;

        this.setState(state => ({
            ...state,
            items: state.items.filter((item) => !areSameItems(item.Location, itemToRemoveLocation))
        }));
    }

    /**
     * Adds item to list
     *
     * @method addItem
     * @param {Object} itemToAddLocation
     * @memberof BookmarksComponent
     */
    addItem(itemToAddLocation) {
        this.setState(state => ({
            ...state,
            items: [...state.items, { Location: itemToAddLocation }]
        }));
    }

    /**
     * Sets isLoading flag
     *
     * @method setIsLoading
     * @param {boolean} isLoading
     * @param {function} callback
     * @memberof BookmarksComponent
     */
    setIsLoading(isLoading, callback) {
        this.setState(state => ({
            ...state,
            isLoading,
        }), callback);
    }

    /**
     * Loads bookmarks
     *
     * @method loadBookmarks
     * @memberof BookmarksComponent
     */
    loadBookmarks() {
        this.setIsLoading(true, () => {
            const { restInfo } = this.props;
            const bookmarksLoaded = new Promise(resolve => loadBookmarks(restInfo, resolve));

            bookmarksLoaded
                .then(this.updateItemsState)
                .catch(showErrorNotification);
        });
    }

    /**
     * Updates items state with bookmarks results
     *
     * @param {Object} response content query REST endpoint response
     * @memberof BookmarksComponent
     */
    updateItemsState(response) {
        this.setState(state => ({
            ...state,
            items: response.BookmarkList.items,
            isLoading: false
        }));
    }

    /**
     * Get table labels
     *
     * @memberof BookmarksComponent
     */
    getTableLabels() {
        const {
            bookmarks,
            contentTablePagination,
            contentTableHeader,
            contentTableItem
        } = this.props.labels;

        return {
            title: bookmarks.tableTitle,
            header: contentTableHeader,
            item: contentTableItem,
            pagination: contentTablePagination,
            noItems: bookmarks.noBookmarks
        };
    }

    render() {
        const { onItemSelect, bookmarksPerPage, contentTypesMap, maxHeight } = this.props;
        const { items, isLoading } = this.state;
        const tableLabels = this.getTableLabels();

        return (
            <div className="c-bookmarks" style={{ maxHeight: `${maxHeight - 32}px` }}>
                <ContentTableComponent
                    items={items}
                    onItemSelect={onItemSelect}
                    onItemClick={onItemSelect}
                    perPage={bookmarksPerPage}
                    contentTypesMap={contentTypesMap}
                    labels={tableLabels}
                    showWhenNoItems={!isLoading}
                />
            </div>
        );
    }
}

BookmarksComponent.propTypes = {
    findContentBySearchQuery: PropTypes.func.isRequired,
    onItemSelect: PropTypes.func.isRequired,
    maxHeight: PropTypes.number.isRequired,
    contentTypesMap: PropTypes.object.isRequired,
    bookmarksPerPage: PropTypes.number.isRequired,
    labels: PropTypes.shape({
        bookmarks: PropTypes.shape({
            noBookmarks: PropTypes.string.isRequired,
            tableTitle: PropTypes.string.isRequired
        }).isRequired,
        contentTablePagination: PropTypes.object.isRequired,
        contentTableHeader: PropTypes.object.isRequired,
        contentTableItem: PropTypes.object.isRequired
    }).isRequired,
    restInfo: PropTypes.shape({
        token: PropTypes.string.isRequired,
        siteaccess: PropTypes.string.isRequired
    }).isRequired
};
