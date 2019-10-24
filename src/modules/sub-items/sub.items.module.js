import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import ViewSwitcherComponent from './components/view-switcher/view.switcher.component.js';
import SubItemsListComponent from './components/sub-items-list/sub.items.list.component.js';
import Popup from '../common/popup/popup.component';
import ActionButton from './components/action-btn/action.btn.js';
import PaginationComponent from './components/pagination/pagination.component.js';
import NoItemsComponent from './components/no-items/no.items.component.js';
import Icon from '../common/icon/icon.js';

import deepClone from '../common/helpers/deep.clone.helper.js';
import { updateLocationPriority, loadLocation } from './services/sub.items.service';
import { bulkMoveLocations, bulkDeleteItems } from './services/bulk.service.js';

export const ASCENDING_SORT_ORDER = 'ascending';
const DESCENDING_SORT_ORDER = 'descending';
const DEFAULT_SORT_ORDER = ASCENDING_SORT_ORDER;

export default class SubItemsModule extends Component {
    constructor(props) {
        super(props);

        this.afterPriorityUpdated = this.afterPriorityUpdated.bind(this);
        this.switchView = this.switchView.bind(this);
        this.handleItemPriorityUpdate = this.handleItemPriorityUpdate.bind(this);
        this.toggleItemSelection = this.toggleItemSelection.bind(this);
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

        const sortClauseData = this.getDefaultSortClause(props.sortClauses);

        this.state = {
            activeView: props.activeView,
            activePageItems: null,
            pages: [],
            selectedItems: new Map(),
            totalCount: props.totalCount,
            offset: props.offset,
            isDuringBulkOperation: false,
            isUdwOpened: false,
            isBulkDeletePopupVisible: false,
            activePageIndex: 0,
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

        if (!this.state.activePageItems) {
            this.loadPage(0);
        }
    }

    componentDidUpdate() {
        const { activePageIndex, activePageItems, totalCount } = this.state;
        const { limit: itemsPerPage } = this.props;
        const pagesCount = Math.ceil(totalCount / itemsPerPage);
        const pageDoesNotExist = activePageIndex > pagesCount - 1 && activePageIndex !== 0;

        if (pageDoesNotExist) {
            this.setState({
                activePageIndex: pagesCount - 1,
            });

            return;
        }

        const shouldLoadPage = !activePageItems;

        if (shouldLoadPage) {
            this.loadPage(activePageIndex);
        }
    }

    componentWillUnmount() {
        document.body.removeChild(this.bulkDeleteModalContainer);
    }

    getDefaultSortClause(sortClauses) {
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
     * @method loadPage
     * @memberof SubItemsModule
     */
    loadPage(pageIndex) {
        const { limit: itemsPerPage, parentLocationId: locationId, loadLocation, restInfo } = this.props;
        const { sortClause, sortOrder } = this.state;
        const page = this.state.pages.find((page) => page.number === pageIndex + 1);
        const cursor = page ? page.cursor : null;
        const queryConfig = { locationId, limit: itemsPerPage, sortClause, sortOrder, cursor };

        loadLocation(restInfo, queryConfig, (response) => {
            const { totalCount, pages, edges } = response.data._repository.location.children;
            const activePageItems = edges.map((edge) => edge.node);

            this.setState(() => ({
                activePageItems,
                totalCount,
                pages,
            }));
        });
    }

    updateTotalCountState(totalCount) {
        this.setState(() => ({
            totalCount,
        }));
    }

    discardActivePageItems() {
        this.updateListViewHeight();
        this.setState(() => ({
            activePageItems: null,
        }));
    }

    changeSorting(sortClause) {
        this.updateListViewHeight();
        this.setState((state) => ({
            sortClause,
            sortOrder: this.getSortOrder(state.sortClause, sortClause, state.sortOrder),
            activePageItems: null,
        }));
    }

    getSortOrder(sortClause, newSortClause, currentSortOrder) {
        return newSortClause === sortClause ? this.getOppositeSortOrder(currentSortOrder) : DEFAULT_SORT_ORDER;
    }

    getOppositeSortOrder(sortOrder) {
        return sortOrder === ASCENDING_SORT_ORDER ? DESCENDING_SORT_ORDER : ASCENDING_SORT_ORDER;
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
            this.discardActivePageItems();
            this.refreshContentTree();
            return;
        }

        this.updateItemLocation(response.Location);
    }

    updateItemLocation(location) {
        this.setState(({ activePageItems }) => {
            const itemIndex = activePageItems.findIndex((item) => item.id === location.id);

            if (itemIndex === -1) {
                return null;
            }

            const item = activePageItems[itemIndex];
            const updatedItem = deepClone(item);
            const updatedPageItems = [...activePageItems];

            updatedItem.priority = location.priority;
            updatedPageItems[itemIndex] = updatedItem;

            return {
                activePageItems: updatedPageItems,
            };
        });
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

    toggleItemSelection(item, isSelected) {
        const { selectedItems } = this.state;
        const updatedSelectedItems = new Map(selectedItems);
        const locationId = item.id;

        if (isSelected) {
            updatedSelectedItems.set(locationId, item);
        } else {
            updatedSelectedItems.delete(locationId);
        }

        this.setState(() => ({ selectedItems: updatedSelectedItems }));
    }

    toggleAllPageItemsSelection(select) {
        const { activePageItems } = this.state;

        if (select) {
            this.selectItems(activePageItems);
        } else {
            const locationsIds = activePageItems.map((item) => item.id);
            const locationsIdsSet = new Set(locationsIds);

            this.deselectItems(locationsIdsSet);
        }
    }

    /**
     *
     * @param {Array} itemsToSelect
     */
    selectItems(itemsToSelect) {
        const { selectedItems } = this.state;
        const newSelectedItems = itemsToSelect.map((item) => [item.id, item]);
        const newSelection = new Map([...selectedItems, ...newSelectedItems]);

        this.setState(() => ({ selectedItems: newSelection }));
    }

    /**
     * Deselects items with locations with provided IDs.
     *
     * @param {Set} locationsIds
     */
    deselectItems(locationsIds) {
        const { selectedItems } = this.state;
        const newSelection = new Map([...selectedItems].filter(([locationId]) => !locationsIds.has(locationId)));

        this.setState(() => ({ selectedItems: newSelection }));
    }

    deselectAllItems() {
        this.setState(() => ({ selectedItems: new Map() }));
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
        const { selectedItems } = this.state;
        const itemsToMove = [...selectedItems.values()];

        bulkMoveLocations(restInfo, itemsToMove, location._href, this.afterBulkMove.bind(this, location));
    }

    afterBulkMove(location, movedItems, notMovedItems) {
        const { totalCount } = this.state;

        this.refreshContentTree();
        this.updateTotalCountState(totalCount - movedItems.length);
        this.deselectAllItems();
        this.discardActivePageItems();

        this.toggleBulkOperationStatusState(false);

        if (notMovedItems.length) {
            const modalTableTitle = Translator.trans(
                /*@Desc("%itemsCount% Content items cannot be moved")*/ 'bulk_move.error.modal.table_title',
                {
                    itemsCount: notMovedItems.length,
                },
                'sub_items'
            );
            const notificationMessage = Translator.trans(
                /*@Desc("%notMovedCount% of the %totalCount% selected item(s) could not be moved because you do not have sufficient user permissions. {{ moreInformationLink }} Contact your Administrator.")*/ 'bulk_move.error.message',
                {
                    notMovedCount: notMovedItems.length,
                    totalCount: movedItems.length + notMovedItems.length,
                },
                'sub_items'
            );
            const rawPlaceholdersMap = {
                moreInformationLink: Translator.trans(
                    /*@Desc("<u><a class='ez-notification-btn ez-notification-btn--show-modal'>Click here for more information.</a></u><br>")*/ 'bulk_move.error.more_info',
                    {},
                    'sub_items'
                ),
            };

            this.handleBulkOperationFailedNotification(notMovedItems, modalTableTitle, notificationMessage, rawPlaceholdersMap);
        }

        if (movedItems.length) {
            const message = Translator.trans(
                /*@Desc("Content item(s) sent to {{ locationLink }}")*/ 'bulk_move.success.message',
                {},
                'sub_items'
            );
            const rawPlaceholdersMap = {
                locationLink: Translator.trans(
                    /*@Desc("<u><a href='%locationHref%'>%locationName%</a></u>")*/ 'bulk_move.success.link_to_location',
                    {
                        locationName: eZ.helpers.text.escapeHTML(location.ContentInfo.Content.Name),
                        locationHref: this.props.generateLink(location.id),
                    },
                    'sub_items'
                ),
            };

            window.eZ.helpers.notification.showSuccessNotification(message, () => {}, rawPlaceholdersMap);
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
        const { selectedItems } = this.state;
        const selectedItemsLocationsIds = [...selectedItems.values()].map(({ id }) => id);
        const excludedMoveLocations = [parentLocationId, ...selectedItemsLocationsIds];
        const title = Translator.trans(/*@Desc("Choose Location")*/ 'udw.choose_location.title', {}, 'sub_items');
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
        const { selectedItems } = this.state;
        const itemsToDelete = [...selectedItems.values()];

        bulkDeleteItems(restInfo, itemsToDelete, this.afterBulkDelete);
    }

    afterBulkDelete(deletedItems, notDeletedItems) {
        const { totalCount } = this.state;
        const isUser = ({ content }) => window.eZ.adminUiConfig.userContentTypes.includes(content._info.contentType.identifier);

        this.refreshContentTree();
        this.updateTotalCountState(totalCount - deletedItems.length);
        this.deselectAllItems();
        this.discardActivePageItems();

        this.toggleBulkOperationStatusState(false);

        if (notDeletedItems.length) {
            const hadUserContentItemFailed = notDeletedItems.some(isUser);
            const hadNonUserContentItemFailed = notDeletedItems.some((item) => !isUser(item));
            let modalTableTitle = null;
            let message = null;
            const rawPlaceholdersMap = {
                moreInformationLink: Translator.trans(
                    /*@Desc("<u><a class='ez-notification-btn ez-notification-btn--show-modal'>Click here for more information.</a></u><br>")*/ 'bulk_delete.error.more_info',
                    {},
                    'sub_items'
                ),
            };

            if (hadUserContentItemFailed && hadNonUserContentItemFailed) {
                modalTableTitle = Translator.trans(
                    /*@Desc("%itemsCount% Content item(s) cannot be deleted or sent to Trash")*/ 'bulk_delete.error.modal.table_title.users_with_nonusers',
                    {
                        itemsCount: notDeletedItems.length,
                    },
                    'sub_items'
                );
                message = Translator.trans(
                    /*@Desc("%notDeletedCount% of the %totalCount% selected item(s) could not be deleted or sent to Trash because you do not have sufficient permissions. {{ moreInformationLink }} Contact your Administrator.")*/ 'bulk_delete.error.message.users_with_nonusers',
                    {
                        notDeletedCount: notDeletedItems.length,
                        totalCount: deletedItems.length + notDeletedItems.length,
                    },
                    'sub_items'
                );
            } else if (hadUserContentItemFailed) {
                modalTableTitle = Translator.trans(
                    /*@Desc("%itemsCount% User(s) cannot be deleted")*/ 'bulk_delete.error.modal.table_title.users',
                    {
                        itemsCount: notDeletedItems.length,
                    },
                    'sub_items'
                );
                message = Translator.trans(
                    /*@Desc("%notDeletedCount% of the %totalCount% selected item(s) could not be deleted because you do not have sufficient permissions. {{ moreInformationLink }} Contact your Administrator.")*/ 'bulk_delete.error.message.users',
                    {
                        notDeletedCount: notDeletedItems.length,
                        totalCount: deletedItems.length + notDeletedItems.length,
                    },
                    'sub_items'
                );
            } else {
                modalTableTitle = Translator.trans(
                    /*@Desc("%itemsCount% Content item(s) cannot be sent to Trash")*/ 'bulk_delete.error.modal.table_title.nonusers',
                    {
                        itemsCount: notDeletedItems.length,
                    },
                    'sub_items'
                );
                message = Translator.trans(
                    /*@Desc("%notDeletedCount% of the %totalCount% selected item(s) could not be sent to Trash because you do not have sufficient permissions. {{ moreInformationLink }} Contact your Administrator.")*/ 'bulk_delete.error.message.nonusers',
                    {
                        notDeletedCount: notDeletedItems.length,
                        totalCount: deletedItems.length + notDeletedItems.length,
                    },
                    'sub_items'
                );
            }

            this.handleBulkOperationFailedNotification(notDeletedItems, modalTableTitle, message, rawPlaceholdersMap);
        } else {
            const anyUserContentItemDeleted = deletedItems.some(isUser);
            const anyNonUserContentItemDeleted = deletedItems.some((location) => !isUser(location));
            let message = null;

            if (anyUserContentItemDeleted && anyNonUserContentItemDeleted) {
                message = Translator.trans(
                    /*@Desc("Content item(s) sent to Trash. User(s) deleted.")*/ 'bulk_delete.success.message.users_with_nonusers',
                    {},
                    'sub_items'
                );
            } else if (anyUserContentItemDeleted) {
                message = Translator.trans(
                    /*@Desc("User(s) deleted.")*/ 'bulk_delete.success.message.users',
                    {},
                    'sub_items'
                );
            } else {
                message = Translator.trans(
                    /*@Desc("Content item(s) sent to Trash.")*/ 'bulk_delete.success.message.nonusers',
                    {},
                    'sub_items'
                );
            }

            window.eZ.helpers.notification.showSuccessNotification(message);
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

    /**
     * Shows warning notification which has a button.
     * Clicking the button should cause appearance of the modal
     * with list of items, which failed to be deleted/moved.
     *
     * @param {Array} failedItems
     * @param {String} modalTableTitle
     * @param {String} notificationMessage
     * @param {Object} rawPlaceholdersMap
     */
    handleBulkOperationFailedNotification(failedItems, modalTableTitle, notificationMessage, rawPlaceholdersMap) {
        const failedItemsData = failedItems.map((content) => ({
            contentTypeName: content._info.contentType.name,
            contentName: content._info.name,
        }));

        window.eZ.helpers.notification.showWarningNotification(
            notificationMessage,
            (notificationNode) => {
                const showModalBtn = notificationNode.querySelector('.ez-notification-btn--show-modal');

                if (!showModalBtn) {
                    return;
                }

                showModalBtn.addEventListener('click', this.props.showBulkActionFailedModal.bind(null, modalTableTitle, failedItemsData));
            },
            rawPlaceholdersMap
        );
    }

    refreshContentTree() {
        document.body.dispatchEvent(new CustomEvent('ez-content-tree-refresh'));
    }

    renderConfirmationPopupFooter(selectionInfo) {
        const cancelLabel = Translator.trans(/*@Desc("Cancel")*/ 'bulk_delete.popup.cancel', {}, 'sub_items');
        const { isUserContentItemSelected, isNonUserContentItemSelected } = selectionInfo;
        let confirmLabel = '';

        if (!isUserContentItemSelected && isNonUserContentItemSelected) {
            confirmLabel = Translator.trans(/*@Desc("Send to Trash")*/ 'bulk_delete.popup.confirm.nonusers', {}, 'sub_items');
        } else {
            confirmLabel = Translator.trans(/*@Desc("Delete")*/ 'bulk_delete.popup.confirm.users_and_users_with_nonusers', {}, 'sub_items');
        }

        return (
            <Fragment>
                <button
                    onClick={this.closeBulkDeletePopup}
                    type="button"
                    className="btn btn-dark"
                    data-dismiss="modal">
                    {cancelLabel}
                </button>
                <button onClick={this.onBulkDeletePopupConfirm} type="button" className="btn btn-danger font-weight-bold btn--trigger">
                    {confirmLabel}
                </button>
            </Fragment>
        );
    }

    getSelectionInfo() {
        const { selectedItems } = this.state;
        let isUserContentItemSelected = false;
        let isNonUserContentItemSelected = false;

        for (const [locationId, { content }] of selectedItems) {
            if (isUserContentItemSelected && isNonUserContentItemSelected) {
                break;
            }

            const isUserContentItem = window.eZ.adminUiConfig.userContentTypes.includes(content._info.contentType.identifier);

            if (isUserContentItem) {
                isUserContentItemSelected = true;
            } else {
                isNonUserContentItemSelected = true;
            }
        }

        return {
            isUserContentItemSelected,
            isNonUserContentItemSelected,
        };
    }

    renderConfirmationPopup() {
        const { isBulkDeletePopupVisible } = this.state;

        if (!isBulkDeletePopupVisible) {
            return null;
        }

        const confirmationMessageUsers = Translator.trans(
            /*@Desc("Are you sure you want to delete the selected user(s)?")*/ 'bulk_delete.popup.message.users',
            {},
            'sub_items'
        );
        const confirmationMessageNonUsers = Translator.trans(
            /*@Desc("Are you sure you want to send the selected Content item(s) to Trash?")*/ 'bulk_delete.popup.message.nonusers',
            {},
            'sub_items'
        );
        const confirmationMessageUsersAndNonUsers = Translator.trans(
            /*@Desc("Are you sure you want to delete the selected user(s) and send the other selected Content item(s) to Trash?")*/ 'bulk_delete.popup.message.users_with_nonusers',
            {},
            'sub_items'
        );
        const selectionInfo = this.getSelectionInfo();
        const { isUserContentItemSelected, isNonUserContentItemSelected } = selectionInfo;
        let confirmationMessage = '';

        if (isUserContentItemSelected && isNonUserContentItemSelected) {
            confirmationMessage = confirmationMessageUsersAndNonUsers;
        } else if (isUserContentItemSelected) {
            confirmationMessage = confirmationMessageUsers;
        } else {
            confirmationMessage = confirmationMessageNonUsers;
        }

        return ReactDOM.createPortal(
            <Popup
                onClose={this.closeBulkDeletePopup}
                isVisible={isBulkDeletePopupVisible}
                isLoading={false}
                size="medium"
                footerChildren={this.renderConfirmationPopupFooter(selectionInfo)}
                noHeader={true}>
                <div className="m-sub-items__confirmation-modal-body">{confirmationMessage}</div>
            </Popup>,
            this.bulkDeleteModalContainer
        );
    }

    changePage(pageIndex) {
        this.updateListViewHeight();
        this.setState(() => ({
            activePageIndex: pageIndex,
            activePageItems: null,
        }));
    }

    getPageSelectedLocationsIds() {
        const { selectedItems, activePageItems } = this.state;
        const selectedLocationsIds = [...selectedItems.keys()];
        const pageLocationsIds = [...activePageItems.map(({ id }) => id)];
        const selectedPageLocationsIds = new Set(pageLocationsIds.filter((locationId) => selectedLocationsIds.includes(locationId)));

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
     * Renders pagination info,
     * which is information about how many items of all user is
     * viewing at the moment
     *
     * @method renderPaginationInfo
     * @returns {JSX.Element}
     */
    renderPaginationInfo() {
        const { totalCount, activePageItems } = this.state;
        const viewingCount = activePageItems ? activePageItems.length : 0;

        const message = Translator.trans(
            /*@Desc("Viewing <strong>%viewingCount%</strong> out of <strong>%totalCount%</strong> sub-items")*/ 'viewing_message',
            {
                viewingCount,
                totalCount,
            },
            'sub_items'
        );

        return <div className="m-sub-items__pagination-info" dangerouslySetInnerHTML={{ __html: message }} />;
    }

    /**
     * Renders pagination
     *
     * @method renderPagination
     * @returns {JSX.Element|null}
     * @memberof SubItemsModule
     */
    renderPagination() {
        const { limit: itemsPerPage } = this.props;
        const { totalCount } = this.state;
        const lessThanOnePage = totalCount <= itemsPerPage;

        if (lessThanOnePage) {
            return null;
        }

        const { activePageIndex, activePageItems, isDuringBulkOperation } = this.state;
        const isActivePageLoaded = !!activePageItems;
        const isPaginationDisabled = !isActivePageLoaded || isDuringBulkOperation;

        return (
            <PaginationComponent
                proximity={1}
                itemsPerPage={itemsPerPage}
                activePageIndex={activePageIndex}
                totalCount={totalCount}
                onPageChange={this.changePage}
                disabled={isPaginationDisabled}
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
        const { activePageItems } = this.state;
        const isActivePageLoaded = !!activePageItems;

        if (isActivePageLoaded) {
            return null;
        }

        const { listViewHeight } = this.state;
        const spinnerMinHeight = 90;
        const style = {
            height: listViewHeight && listViewHeight > spinnerMinHeight ? listViewHeight : spinnerMinHeight,
        };

        return (
            <div style={style}>
                <div className="m-sub-items__spinner-wrapper">
                    <Icon name="spinner" extraClasses="m-sub-items__spinner ez-icon--medium ez-spin" />
                </div>
            </div>
        );
    }

    renderNoItems() {
        if (this.state.totalCount) {
            return null;
        }

        return <NoItemsComponent />;
    }

    renderListView() {
        const { activePageItems, sortClause, sortOrder } = this.state;
        const pageLoaded = !!activePageItems;

        if (!pageLoaded) {
            return null;
        }

        const selectedPageLocationsIds = this.getPageSelectedLocationsIds();

        return (
            <SubItemsListComponent
                activeView={this.state.activeView}
                handleItemPriorityUpdate={this.handleItemPriorityUpdate}
                items={activePageItems}
                languages={this.props.languages}
                handleEditItem={this.props.handleEditItem}
                generateLink={this.props.generateLink}
                onItemSelect={this.toggleItemSelection}
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
        const { selectedItems, activeView, totalCount, isDuringBulkOperation, activePageItems } = this.state;
        const nothingSelected = !selectedItems.size;
        const isTableViewActive = activeView === 'table';
        const pageLoaded = !!activePageItems;
        const bulkBtnDisabled = nothingSelected || !isTableViewActive || !pageLoaded;
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
                {this.renderPaginationInfo()}
                {this.renderPagination()}
                {this.renderUdw()}
                {this.renderConfirmationPopup()}
            </div>
        );
    }
}

eZ.addConfig('modules.SubItems', SubItemsModule);

SubItemsModule.propTypes = {
    parentLocationId: PropTypes.number.isRequired,
    restInfo: PropTypes.shape({
        token: PropTypes.string.isRequired,
        siteaccess: PropTypes.string.isRequired,
    }).isRequired,
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
    totalCount: PropTypes.number,
    languages: PropTypes.object,
    udwConfigBulkMoveItems: PropTypes.object.isRequired,
    showBulkActionFailedModal: PropTypes.func.isRequired,
};

SubItemsModule.defaultProps = {
    loadLocation,
    sortClauses: {},
    updateLocationPriority,
    activeView: 'table',
    extraActions: [],
    languages: window.eZ.adminUiConfig.languages,
    items: [],
    limit: parseInt(window.eZ.adminUiConfig.subItems.limit, 10),
    offset: 0,
    totalCount: 0,
};
