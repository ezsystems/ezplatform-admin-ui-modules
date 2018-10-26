import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import ViewSwitcherComponent from './components/view-switcher/view.switcher.component.js';
import SubItemsListComponent from './components/sub-items-list/sub.items.list.component.js';
import Popup from '../common/popup/popup.component';
import ActionButton from './components/action-btn/action.btn.js';
import PaginationComponent from './components/pagination/pagination.component.js';
import ViewingMessageComponent from './components/viewing-message/viewing.message.component.js';
import NoItemsComponent from './components/no-items/no.items.component.js';
import Icon from '../common/icon/icon.js';

import { updateLocationPriority, loadLocation, loadContentInfo, loadContentType, loadContentTypes } from './services/sub.items.service';
import { bulkMoveLocations, bulkMoveLocationsToTrash } from './services/bulk.service.js';

import './css/sub.items.module.css';
import deepClone from '../common/helpers/deep.clone.helper.js';

export default class SubItemsModule extends Component {
    constructor(props) {
        super(props);

        this.afterPriorityUpdated = this.afterPriorityUpdated.bind(this);
        this.loadContentItems = this.loadContentItems.bind(this);
        this.loadContentTypes = this.loadContentTypes.bind(this);
        this.updateItemsState = this.updateItemsState.bind(this);
        this.switchView = this.switchView.bind(this);
        this.handleItemPriorityUpdate = this.handleItemPriorityUpdate.bind(this);
        this.toggleItemSelect = this.toggleItemSelect.bind(this);
        this.toggleAllPageItemsSelection = this.toggleAllPageItemsSelection.bind(this);
        this.onMoveBtnClick = this.onMoveBtnClick.bind(this);
        this.closeUdw = this.closeUdw.bind(this);
        this.onUdwConfirm = this.onUdwConfirm.bind(this);
        this.onDeleteBtnClick = this.onDeleteBtnClick.bind(this);
        this.closeBulkDeletePopup = this.closeBulkDeletePopup.bind(this);
        this.onBulkDeletePopupConfirm = this.onBulkDeletePopupConfirm.bind(this);
        this.afterBulkDelete = this.afterBulkDelete.bind(this);
        this.changePage = this.changePage.bind(this);
        this.changeSorting = this.changeSorting.bind(this);

        this._refListViewWrapper = React.createRef();
        this.bulkDeleteModalContainer = null;
        this.udwContainer = null;
        this.pagesDuringLoading = new Set();

        const sortClauseData = this.extractFirstSortClauseData(props.sortClauses);

        this.state = {
            activeView: props.activeView,
            pages: {
                '0': props.items,
            },
            selectedItemsCachedData: new Map(),
            contentTypesMap: props.contentTypesMap,
            totalCount: props.totalCount,
            offset: props.offset,
            isLoading: false,
            isDuringBulkOperation: false,
            isUdwOpened: false,
            isBulkDeletePopupVisible: false,
            activePage: 0,
            listViewHeight: null,
            sortClause: sortClauseData.name,
            sortOrder: sortClauseData.order,
        };
    }

    componentDidMount() {
        this.udwContainer = document.getElementById('react-udw');
        this.bulkDeleteModalContainer = document.createElement('div');
        this.bulkDeleteModalContainer.classList.add('m-sub-items__bulk-delete-modal-container');
        document.body.appendChild(this.bulkDeleteModalContainer);
    }

    componentDidUpdate() {
        const { activePage, pages, totalCount } = this.state;
        const { limit: itemsPerPage } = this.props;
        const numberOfPages = Math.ceil(totalCount / itemsPerPage);
        const pageDoesNotExist = activePage > numberOfPages - 1 && activePage !== 0;

        if (pageDoesNotExist) {
            this.setState({
                activePage: numberOfPages - 1,
            });

            return;
        }

        const pageData = pages[activePage];
        const activePageIsLoading = this.pagesDuringLoading.has(activePage);
        const shouldLoadPage = !pageData && !activePageIsLoading;

        if (shouldLoadPage) {
            this.updateListViewHeight();
            this.loadPage(activePage);
        }
    }

    componentWillUnmount() {
        document.body.removeChild(this.bulkDeleteModalContainer);
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.setState((state) => ({ items: [...state.items, ...props.items] }));
    }

    extractFirstSortClauseData(sortClauses) {
        const objKeys = Object.keys(sortClauses);

        if (!objKeys.length) {
            return { name: null, order: null };
        }

        const name = objKeys[0];
        const order = sortClauses[name];

        return { name, order };
    }

    updateListViewHeight() {
        this.setState(() => ({
            listViewHeight: this._refListViewWrapper.current.offsetHeight,
        }));
    }

    /**
     * Loads items into the list
     *
     * @method loadItems
     * @memberof SubItemsModule
     */
    loadPage(page) {
        this.pagesDuringLoading.add(page);

        this.loadLocation(page)
            .then(this.loadContentItems.bind(this, page))
            .then(this.loadContentTypes)
            .then(this.updateItemsState)
            .catch(() => {
                const errorMessage = Translator.trans(
                    /*@Desc("An error occurred while loading items in the Sub Items module")*/ 'page.loading_error.message',
                    {},
                    'sub_items'
                );

                window.eZ.helpers.notification.showErrorNotification(errorMessage);
            });
    }

    /**
     * Loads location data
     *
     * @param {Number} page
     * @method loadLocation
     * @returns {Promise}
     * @memberof SubItemsModule
     */
    loadLocation(page) {
        const { limit: itemsPerPage, loadLocation, restInfo, parentLocationId: locationId } = this.props;
        const { sortClause, sortOrder } = this.state;
        const offset = page * itemsPerPage;
        const sortClauses = {
            [sortClause]: sortOrder,
        };
        const queryConfig = { locationId, limit: itemsPerPage, sortClauses, offset };

        return new Promise((resolve) => loadLocation(restInfo, queryConfig, resolve));
    }

    /**
     * Loads content items from location
     *
     * @method loadContentItems
     * @param {Number} page
     * @param {Object} response query results
     * @returns {Promise}
     * @memberof SubItemsModule
     */
    loadContentItems(page, response) {
        const { loadContentInfo, restInfo } = this.props;

        if (!response || !response.View) {
            const invalidResponseFormatMessage = Translator.trans(
                /*@Desc("Invalid response format")*/ 'load_content_items.invalid_response_format.error.message',
                {},
                'sub_items'
            );
            throw new Error(invalidResponseFormatMessage);
        }

        const locations = response.View.Result.searchHits.searchHit;

        return new Promise((resolve) => {
            const contentIds = locations.map((item) => item.value.Location.ContentInfo.Content._id);

            loadContentInfo(restInfo, contentIds, (contentInfo) => {
                const { totalCount: oldTotalCount } = this.state;
                const totalCount = response.View.Result.count;

                if (oldTotalCount !== totalCount) {
                    this.discardPagesDataOtherThan([page]);
                }

                resolve({
                    page,
                    locations,
                    totalCount,
                    contents: contentInfo.View.Result.searchHits.searchHit.map((searchHit) => searchHit.value.Content),
                });
            });
        });
    }

    /**
     * Loads content types info
     *
     * @method loadContentTypes
     * @param {Object} itemsData
     * @returns {Promise}
     * @memberof SubItemsModule
     */
    loadContentTypes(itemsData) {
        const promises = itemsData.contents.map(
            (content) =>
                new Promise((resolve) => {
                    const contentTypeId = content.ContentType._href;

                    if (!this.state.contentTypesMap[contentTypeId]) {
                        this.props.loadContentType(contentTypeId, this.props.restInfo, (response) => resolve(response));
                    } else {
                        resolve({ ContentType: this.state.contentTypesMap[contentTypeId] });
                    }
                })
        );

        return Promise.all(promises).then((contentTypes) => {
            itemsData.contentTypes = contentTypes;

            return itemsData;
        });
    }

    /**
     * Updates module state by updating items list
     *
     * @method updateItemsState
     * @param {Object} responses
     * @memberof SubItemsModule
     */
    updateItemsState({ page, locations, contents, totalCount, contentTypes }) {
        const pageItems = locations.map((location) => {
            const itemLocation = location.value.Location;
            const respectiveContent = contents.find((content) => content._id === itemLocation.ContentInfo.Content._id);

            return {
                location: itemLocation,
                content: respectiveContent,
            };
        });

        this.setState(
            (state) => ({
                pages: {
                    ...state.pages,
                    [page]: pageItems,
                },
                totalCount,
                contentTypesMap: {
                    ...state.contentTypesMap,
                    ...this.buildContentTypesMap(contentTypes),
                },
            }),
            () => {
                this.pagesDuringLoading.delete(page);
            }
        );
    }

    /**
     * Builds content types map
     *
     * @method buildContentTypesMap
     * @param {Array} contentTypes
     * @returns {Object}
     * @memberof SubItemsModule
     */
    buildContentTypesMap(contentTypes) {
        if (!contentTypes) {
            return {};
        }

        return contentTypes.reduce((total, item) => {
            total[item.ContentType._href] = item.ContentType;

            return total;
        }, {});
    }

    updateTotalCountState(totalCount) {
        this.setState(() => ({
            totalCount,
        }));
    }

    discardPagesDataOtherThan(pages) {
        this.setState((state) => {
            const notDiscardedPagesData = pages.reduce((pagesData, page) => (pagesData[page] = state.pages[page]), {});

            return {
                pages: notDiscardedPagesData,
            };
        });
    }

    changeSorting(sortClause) {
        this.setState((state) => ({
            sortClause,
            sortOrder: this.getSortOrder(state.sortClause, sortClause, state.sortOrder),
            pages: {},
        }));
    }

    getSortOrder(sortClause, newSortClause, currentSortOrder) {
        return newSortClause === sortClause ? this.getOppositeSortOrder(currentSortOrder) : this.getDefaultSortOrder();
    }

    getOppositeSortOrder(sortOrder) {
        return sortOrder === 'ascending' ? 'descending' : 'ascending';
    }

    getDefaultSortOrder() {
        return 'ascending';
    }

    /**
     * Updates item priority
     *
     * @method handleItemPriorityUpdate
     * @param {Object} data data hash containing: priority, location, token, siteaccess
     * @memberof SubItemsModule
     */
    handleItemPriorityUpdate(data) {
        this.props.updateLocationPriority({ ...data, ...this.props.restInfo }, this.afterPriorityUpdated);
    }

    /**
     * Updates module state after item's priority has been updated
     *
     * @method afterPriorityUpdated
     * @param {Object} response
     * @memberof SubItemsModule
     */
    afterPriorityUpdated(response) {
        if (this.state.sortClause === 'LocationPriority') {
            this.discardPagesDataOtherThan([]);
            return;
        }

        this.updateItemLocation(response.Location);
    }

    updateItemLocation(location) {
        this.setState((state) => {
            const { pages } = state;
            const { itemPage, itemIndex } = this.findItemPositionByLocationId(pages, location.id);
            const itemPageData = pages[itemPage];
            const item = itemPageData.items[itemIndex];
            const updatedItem = deepClone(item);

            updatedItem.location = location;

            const updatedPageItems = [...itemPageData.items];

            updatedPageItems[itemIndex] = updatedItem;

            return {
                pages: {
                    ...state.pages,
                    [itemPage]: updatedPageItems,
                },
            };
        });
    }

    /**
     * Finds on what page item is located
     * and what is the index of the item in page's items list
     *
     * @returns {{itemPage: number, itemIndex: number}}
     */
    findItemPositionByLocationId(pages, locationId) {
        let itemPage = null;
        let itemIndex = null;

        for (const [page, pageData] of Object.entries(pages)) {
            itemIndex = pageData.items.findIndex((item) => item.location.id === locationId);

            if (itemIndex !== -1) {
                itemPage = page;
                break;
            }
        }

        return { itemPage, itemIndex };
    }

    /**
     * Switches active view
     *
     * @method switchView
     * @param {String} activeView
     * @memberof SubItemsModule
     */
    switchView(activeView) {
        this.setState(() => ({ activeView }));
    }

    /**
     * Returns data which we want to cache for selected item
     * Page data might be discarded but selection of the item should stay,
     * thus we need item data to perform operations such as bulk delete or bulk move
     *
     * @param {Object} item
     * @param {Object} item.content
     * @param {Object} item.location
     *
     * @returns {Object} dataToCache
     */
    getItemDataToCache(item) {
        const { contentTypesMap } = this.state;
        const contentType = contentTypesMap[item.content.ContentType._href];
        const contentTypeIdentifier = contentType.identifier;
        const contentTypeName = window.eZ.adminUiConfig.contentTypeNames[contentTypeIdentifier];

        return {
            contentTypeName,
            name: item.content.Name,
            location: {
                id: item.location.id,
                _href: item.location._href,
            },
        };
    }

    toggleItemSelect(item, isSelected) {
        const { selectedItemsCachedData } = this.state;
        const updatedSelectedItemsCachedData = new Map(selectedItemsCachedData);
        const itemDataToCache = this.getItemDataToCache(item);
        const locationId = item.location.id;

        if (isSelected) {
            updatedSelectedItemsCachedData.set(locationId, itemDataToCache);
        } else {
            updatedSelectedItemsCachedData.delete(locationId);
        }

        this.setSelectedItemsState(updatedSelectedItemsCachedData);
    }

    toggleAllPageItemsSelection(select) {
        const { pages, activePage } = this.state;
        const pageItems = pages[activePage];

        if (select) {
            const itemsCachedData = new Map(pageItems.map((item) => [item.location.id, this.getItemDataToCache(item)]));

            this.selectItems(itemsCachedData);
        } else {
            const locationsIds = pageItems.map((item) => item.location.id);
            const locationsIdsSet = new Set(locationsIds);

            this.deselectItems(locationsIdsSet);
        }
    }

    /**
     *
     * @param {Map} itemsCachedData
     */
    selectItems(itemsCachedData) {
        const { selectedItemsCachedData } = this.state;
        const newSelection = new Map([...selectedItemsCachedData, ...itemsCachedData]);

        this.setSelectedItemsState(newSelection);
    }

    /**
     * Deselects items with locations with provided IDs.
     *
     * @param {Set} locationsIds
     */
    deselectItems(locationsIds) {
        const { selectedItemsCachedData } = this.state;
        const newSelection = new Map([...selectedItemsCachedData].filter(([locationId, cachedData]) => !locationsIds.has(locationId)));

        this.setSelectedItemsState(newSelection);
    }

    deselectAllItems() {
        this.setSelectedItemsState(new Map());
    }

    setSelectedItemsState(selectedItemsCachedData) {
        this.setState(() => ({
            selectedItemsCachedData,
        }));
    }

    toggleBulkOperationStatusState(isDuringBulkOperation) {
        this.setState(() => ({
            isDuringBulkOperation,
        }));
    }

    onMoveBtnClick() {
        this.toggleUdw(true);
    }

    bulkMove(location) {
        this.toggleBulkOperationStatusState(true);

        const { restInfo } = this.props;
        const { selectedItemsCachedData } = this.state;
        const locationsToMove = [...selectedItemsCachedData.values()].map(({ location }) => location);

        bulkMoveLocations(restInfo, locationsToMove, location._href, this.afterBulkMove.bind(this, location));
    }

    afterBulkMove(location, movedLocations, notMovedLocations) {
        const { totalCount } = this.state;

        this.updateTotalCountState(totalCount - movedLocations.length);
        this.deselectAllItems();
        this.discardPagesDataOtherThan([]);

        this.toggleBulkOperationStatusState(false);

        if (notMovedLocations.length) {
            const message = Translator.trans(
                /*@Desc("You do not have permission to move at least 1 of the selected content item(s). Please contact your Administrator to obtain permissions.")*/ 'bulk_move.error.message',
                {},
                'sub_items'
            );

            window.eZ.helpers.notification.showErrorNotification(message);
        }

        if (movedLocations.length) {
            const message = Translator.trans(
                /*@Desc("The selected content item(s) have been sent to <u>%location_name%</u>")*/ 'bulk_move.success.message',
                { location_name: location.ContentInfo.Content.Name },
                'sub_items'
            );

            window.eZ.helpers.notification.showSuccessNotification(message);
        }
    }

    toggleUdw(show) {
        this.setState(() => ({
            isUdwOpened: show,
        }));
    }

    closeUdw() {
        this.toggleUdw(false);
    }

    onUdwConfirm([selectedLocation]) {
        this.closeUdw();
        this.bulkMove(selectedLocation);
    }

    renderUdw() {
        const { isUdwOpened } = this.state;

        if (!isUdwOpened) {
            return null;
        }

        const UniversalDiscovery = window.eZ.modules.UniversalDiscovery;
        const { restInfo, parentLocationId, udwConfigBulkMoveItems } = this.props;
        const { selectedItemsCachedData } = this.state;
        const selectedItemsLocationsIds = [...selectedItemsCachedData.values()].map(({ location }) => location.id);
        const excludedMoveLocations = [parentLocationId, ...selectedItemsLocationsIds];
        const title = Translator.trans(/*@Desc("Choose location")*/ 'udw.choose_location.title', {}, 'sub_items');
        const udwProps = {
            title,
            restInfo,
            onCancel: this.closeUdw,
            onConfirm: this.onUdwConfirm,
            canSelectContent: ({ item }, callback) => {
                callback(!excludedMoveLocations.includes(item.id));
            },
            ...udwConfigBulkMoveItems,
        };

        return ReactDOM.createPortal(<UniversalDiscovery {...udwProps} />, this.udwContainer);
    }

    onDeleteBtnClick() {
        this.toggleBulkDeletePopup(true);
    }

    bulkDelete() {
        this.toggleBulkOperationStatusState(true);

        const { restInfo } = this.props;
        const { selectedItemsCachedData } = this.state;
        const locationsToDelete = [...selectedItemsCachedData.values()].map(({ location }) => location);

        bulkMoveLocationsToTrash(restInfo, locationsToDelete, this.afterBulkDelete);
    }

    afterBulkDelete(deletedLocations, notDeletedLocations) {
        const { totalCount } = this.state;

        this.updateTotalCountState(totalCount - deletedLocations.length);
        this.deselectAllItems();
        this.discardPagesDataOtherThan([]);

        this.toggleBulkOperationStatusState(false);

        if (deletedLocations.length) {
            const message = Translator.trans(
                /*@Desc("The selected content item(s) have been sent to trash")*/ 'bulk_delete.success.message',
                {},
                'sub_items'
            );

            window.eZ.helpers.notification.showSuccessNotification(message);
        }

        if (notDeletedLocations.length) {
            const message = Translator.trans(
                /*@Desc("You do not have permission to delete at least 1 of the selected content item(s). Please contact your Administrator to obtain permissions.")*/ 'bulk_delete.error.message',
                {},
                'sub_items'
            );

            window.eZ.helpers.notification.showErrorNotification(message);
        }
    }

    toggleBulkDeletePopup(show) {
        this.setState(() => ({
            isBulkDeletePopupVisible: show,
        }));
    }

    closeBulkDeletePopup() {
        this.toggleBulkDeletePopup(false);
    }

    onBulkDeletePopupConfirm() {
        this.closeBulkDeletePopup();
        this.bulkDelete();
    }

    renderConfirmationPopupFooter() {
        const cancelLabel = Translator.trans(/*@Desc("Cancel")*/ 'bulk_delete.popup.cancel', {}, 'sub_items');
        const confirmLabel = Translator.trans(/*@Desc("Send to trash")*/ 'bulk_delete.popup.confirm', {}, 'sub_items');

        return (
            <Fragment>
                <button
                    onClick={this.closeBulkDeletePopup}
                    type="button"
                    className="btn btn-secondary btn--no m-sub-items__confirmation-modal-cancel-btn"
                    data-dismiss="modal"
                >
                    {cancelLabel}
                </button>
                <button onClick={this.onBulkDeletePopupConfirm} type="button" className="btn btn-danger font-weight-bold btn--trigger">
                    {confirmLabel}
                </button>
            </Fragment>
        );
    }

    renderConfirmationPopup() {
        const { isBulkDeletePopupVisible } = this.state;

        if (!isBulkDeletePopupVisible) {
            return null;
        }

        const confirmationMessage = Translator.trans(
            /*@Desc("Are you sure you want to send the selected content item(s) to trash?")*/ 'bulk_delete.popup.message',
            {},
            'sub_items'
        );

        return ReactDOM.createPortal(
            <Popup
                onClose={this.closeBulkDeletePopup}
                isVisible={isBulkDeletePopupVisible}
                isLoading={false}
                size="medium"
                footerChildren={this.renderConfirmationPopupFooter()}
                noHeader={true}
            >
                <div className="m-sub-items__confirmation-modal-body">{confirmationMessage}</div>
            </Popup>,
            this.bulkDeleteModalContainer
        );
    }

    changePage(page) {
        this.updateListViewHeight();
        this.setState(() => ({
            activePage: page,
        }));
    }

    getPageSelectedLocationsIds() {
        const { selectedItemsCachedData, pages, activePage } = this.state;
        const selectedLocationsIds = new Set([...selectedItemsCachedData.keys()]);
        const pageItems = pages[activePage];
        const pageLocationsIds = new Set(pageItems.map((item) => item.location.id));
        const selectedPageLocationsIds = new Set([...pageLocationsIds].filter((locationId) => selectedLocationsIds.has(locationId)));

        return selectedPageLocationsIds;
    }

    /**
     * Renders extra actions
     *
     * @method renderExtraActions
     * @param {Object} action
     * @returns {JSX.Element}
     * @memberof SubItemsModule
     */
    renderExtraActions(action, index) {
        const Action = action.component;

        return <Action key={index} className="m-sub-items__action" {...action.attrs} />;
    }

    /**
     * Renders viewing message
     *
     * @method renderViewingMessage
     * @returns {JSX.Element}
     */
    renderViewingMessage() {
        const { totalCount } = this.state;
        const { activePage, pages } = this.state;
        const pageItems = pages[activePage];
        const viewingCount = pageItems ? pageItems.length : 0;

        return <ViewingMessageComponent totalCount={totalCount} viewingCount={viewingCount} />;
    }

    /**
     * Renders pagination
     *
     * @method renderPagination
     * @returns {JSX.Element}
     * @memberof SubItemsModule
     */
    renderPagination() {
        const { limit: itemsPerPage } = this.props;
        const { totalCount } = this.state;
        const onlyOnePage = totalCount <= itemsPerPage;

        if (!this.state.totalCount || onlyOnePage) {
            return null;
        }

        const { activePage } = this.state;

        return (
            <PaginationComponent
                proximity={1}
                itemsPerPage={itemsPerPage}
                activePageIndex={activePage}
                totalCount={totalCount}
                onPageChange={this.changePage}
            />
        );
    }

    renderBulkMoveBtn(disabled) {
        const label = Translator.trans(/*@Desc("Move selected items")*/ 'move_btn.label', {}, 'sub_items');

        return <ActionButton disabled={disabled} onClick={this.onMoveBtnClick} label={label} type="move" />;
    }

    renderBulkDeleteBtn(disabled) {
        const label = Translator.trans(/*@Desc("Delete selected items")*/ 'trash_btn.label', {}, 'sub_items');

        return <ActionButton disabled={disabled} onClick={this.onDeleteBtnClick} label={label} type="trash" />;
    }

    renderSpinner() {
        const { pages, activePage } = this.state;
        const activePageItems = pages[activePage];
        const pageLoaded = !!activePageItems;

        if (pageLoaded) {
            return null;
        }

        const { listViewHeight } = this.state;
        const spinnerMinHeight = 90;
        const style = {
            height: listViewHeight && listViewHeight > spinnerMinHeight ? listViewHeight : spinnerMinHeight,
        };

        return (
            <div style={style}>
                <div className="m-sub-items__list-spinner-wrapper">
                    <Icon name="spinner" extraClasses="m-sub-items__list-spinner ez-spin ez-icon-x2 ez-icon-spinner" />
                </div>
            </div>
        );
    }

    renderNoItems() {
        const { totalCount } = this.state;

        if (totalCount) {
            return null;
        }

        return <NoItemsComponent />;
    }

    renderListView() {
        const { pages, activePage, sortClause, sortOrder } = this.state;
        const activePageItems = pages[activePage];
        const pageLoaded = !!activePageItems;

        if (!pageLoaded) {
            return null;
        }

        const selectedPageLocationsIds = this.getPageSelectedLocationsIds();

        return (
            <SubItemsListComponent
                activeView={this.state.activeView}
                contentTypesMap={this.state.contentTypesMap}
                handleItemPriorityUpdate={this.handleItemPriorityUpdate}
                items={activePageItems}
                languages={this.props.languages}
                handleEditItem={this.props.handleEditItem}
                generateLink={this.props.generateLink}
                onItemSelect={this.toggleItemSelect}
                toggleAllItemsSelect={this.toggleAllPageItemsSelection}
                selectedLocationsIds={selectedPageLocationsIds}
                onSortChange={this.changeSorting}
                sortClause={sortClause}
                sortOrder={sortOrder}
            />
        );
    }

    render() {
        const listTitle = Translator.trans(/*@Desc("Sub-items")*/ 'items_list.title', {}, 'sub_items');
        const { selectedItemsCachedData, activeView, totalCount, isDuringBulkOperation } = this.state;
        const nothingSelected = !selectedItemsCachedData.size;
        const isTableViewActive = activeView === 'table';
        const bulkBtnDisabled = nothingSelected || !isTableViewActive;
        let listClassName = 'm-sub-items__list';

        if (isDuringBulkOperation) {
            listClassName = `${listClassName} ${listClassName}--processing`;
        }

        return (
            <div className="m-sub-items">
                <div className="m-sub-items__header">
                    <div className="m-sub-items__title">
                        {listTitle} ({this.state.totalCount})
                    </div>
                    <div className="m-sub-items__actions">
                        {this.props.extraActions.map(this.renderExtraActions)}
                        {this.renderBulkMoveBtn(bulkBtnDisabled)}
                        {this.renderBulkDeleteBtn(bulkBtnDisabled)}
                    </div>
                    <ViewSwitcherComponent onViewChange={this.switchView} activeView={activeView} isDisabled={!totalCount} />
                </div>
                <div ref={this._refListViewWrapper} className={listClassName}>
                    {this.renderSpinner()}
                    {this.renderListView()}
                    {this.renderNoItems()}
                </div>
                {this.renderViewingMessage()}
                {this.renderPagination()}
                {this.renderUdw()}
                {this.renderConfirmationPopup()}
            </div>
        );
    }
}

SubItemsModule.propTypes = {
    parentLocationId: PropTypes.number.isRequired,
    restInfo: PropTypes.shape({
        token: PropTypes.string.isRequired,
        siteaccess: PropTypes.string.isRequired,
    }).isRequired,
    loadContentInfo: PropTypes.func,
    loadContentType: PropTypes.func,
    loadContentTypes: PropTypes.func,
    loadLocation: PropTypes.func,
    sortClauses: PropTypes.object,
    updateLocationPriority: PropTypes.func,
    activeView: PropTypes.string,
    extraActions: PropTypes.arrayOf(
        PropTypes.shape({
            component: PropTypes.func,
            attrs: PropTypes.object,
        })
    ),
    items: PropTypes.arrayOf(PropTypes.object),
    limit: PropTypes.number,
    offset: PropTypes.number,
    handleEditItem: PropTypes.func.isRequired,
    generateLink: PropTypes.func.isRequired,
    contentTypesMap: PropTypes.object,
    totalCount: PropTypes.number,
    languages: PropTypes.object,
    udwConfigBulkMoveItems: PropTypes.object.isRequired,
};

SubItemsModule.defaultProps = {
    loadContentInfo,
    loadContentType,
    loadContentTypes,
    loadLocation,
    sortClauses: {},
    updateLocationPriority,
    activeView: 'table',
    extraActions: [],
    languages: window.eZ.adminUiConfig.languages,
    items: [],
    limit: parseInt(window.eZ.adminUiConfig.subItems.limit, 10),
    offset: 0,
    contentTypesMap: {},
    totalCount: 0,
};
