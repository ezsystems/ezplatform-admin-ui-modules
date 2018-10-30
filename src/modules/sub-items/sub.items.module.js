import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import ViewSwitcherComponent from './components/view-switcher/view.switcher.component.js';
import SubItemsListComponent from './components/sub-items-list/sub.items.list.component.js';
import LoadMoreComponent from './components/load-more/load.more.component.js';
import Popup from '../common/popup/popup.component';
import ActionButton from './components/action-btn/action.btn.js';

import { updateLocationPriority, loadLocation, loadContentInfo, loadContentType, loadContentTypes } from './services/sub.items.service';
import { bulkMoveLocations, bulkMoveLocationsToTrash } from './services/bulk.service.js';

import './css/sub.items.module.css';

export default class SubItemsModule extends Component {
    constructor(props) {
        super(props);

        this.afterPriorityUpdated = this.afterPriorityUpdated.bind(this);
        this.loadContentItems = this.loadContentItems.bind(this);
        this.loadContentTypes = this.loadContentTypes.bind(this);
        this.updateItemsState = this.updateItemsState.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.switchView = this.switchView.bind(this);
        this.handleItemPriorityUpdate = this.handleItemPriorityUpdate.bind(this);
        this.toggleItemSelect = this.toggleItemSelect.bind(this);
        this.toggleAllItemsSelect = this.toggleAllItemsSelect.bind(this);
        this.getSelectedItems = this.getSelectedItems.bind(this);
        this.removeItemsFromList = this.removeItemsFromList.bind(this);
        this.onMoveBtnClick = this.onMoveBtnClick.bind(this);
        this.closeUdw = this.closeUdw.bind(this);
        this.onUdwConfirm = this.onUdwConfirm.bind(this);
        this.onDeleteBtnClick = this.onDeleteBtnClick.bind(this);
        this.closeBulkDeletePopup = this.closeBulkDeletePopup.bind(this);
        this.onBulkDeletePopupConfirm = this.onBulkDeletePopupConfirm.bind(this);
        this.afterBulkDelete = this.afterBulkDelete.bind(this);

        this.bulkDeleteModalContainer = null;
        this.udwContainer = null;

        this.state = {
            activeView: props.activeView,
            items: props.items,
            selectedLocationsIds: new Set(),
            contentTypesMap: props.contentTypesMap,
            totalCount: props.totalCount,
            offset: props.offset,
            isLoading: false,
            isDuringBulkOperation: false,
            isUdwOpened: false,
            isBulkDeletePopupVisible: false,
        };
    }

    componentDidMount() {
        this.udwContainer = document.getElementById('react-udw');
        this.bulkDeleteModalContainer = document.createElement('div');
        this.bulkDeleteModalContainer.classList.add('m-sub-items__bulk-delete-modal-container');
        document.body.appendChild(this.bulkDeleteModalContainer);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.offset < this.state.offset) {
            this.loadItems();
        }
    }

    componentWillUnmount() {
        document.body.removeChild(this.bulkDeleteModalContainer);
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.setState((state) => ({ items: [...state.items, ...props.items] }));
    }

    /**
     * Increases an amount of items to be loaded in the list
     *
     * @method handleLoadMore
     * @memberof SubItemsModule
     */
    handleLoadMore() {
        this.setState((state) => ({ offset: state.offset + this.props.limit }));
    }

    /**
     * Loads items into the list
     *
     * @method loadItems
     * @memberof SubItemsModule
     */
    loadItems() {
        const parentLocationId = this.props.parentLocationId;

        this.setState(() => ({ isLoading: true }));

        this.loadLocation(parentLocationId)
            .then(this.loadContentItems)
            .then(this.loadContentTypes)
            .then(this.updateItemsState)
            .catch(() =>
                window.eZ.helpers.notification.showErrorNotification('An error occurred while loading items in the Sub Items module')
            );
    }

    /**
     * Loads location data
     *
     * @method loadLocation
     * @param {Number} locationId
     * @returns {Promise}
     * @memberof SubItemsModule
     */
    loadLocation(locationId) {
        const { limit, sortClauses, loadLocation, restInfo } = this.props;
        const { offset } = this.state;
        const queryConfig = { locationId, limit, sortClauses, offset };

        return new Promise((resolve) => loadLocation(restInfo, queryConfig, resolve));
    }

    /**
     * Loads content items from location
     *
     * @method loadContentItems
     * @param {Object} response query results
     * @returns {Promise}
     * @memberof SubItemsModule
     */
    loadContentItems(response) {
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
        const promises = [];

        promises.push(
            new Promise((resolve) => {
                const contentIds = locations.map((item) => item.value.Location.ContentInfo.Content._id);

                loadContentInfo(restInfo, contentIds, resolve);
            }).then((contentInfo) => ({
                locations,
                totalCount: response.View.Result.count,
                content: contentInfo.View.Result.searchHits.searchHit,
            }))
        );

        return Promise.all(promises);
    }

    /**
     * Loads content types info
     *
     * @method loadContenTypes
     * @param {Array} responses
     * @returns {Promise}
     * @memberof SubItemsModule
     */
    loadContentTypes(responses) {
        const promises = responses[0].content.reduce((total, item) => {
            return [
                ...total,
                new Promise((resolve) => {
                    const contentTypeId = item.value.Content.ContentType._href;

                    if (!this.state.contentTypesMap[contentTypeId]) {
                        this.props.loadContentType(contentTypeId, this.props.restInfo, (response) => resolve(response));
                    } else {
                        resolve({ ContentType: this.state.contentTypesMap[contentTypeId] });
                    }
                }),
            ];
        }, []);

        return Promise.all(promises).then((contentTypes) => {
            responses[0].contentTypes = contentTypes;

            return responses[0];
        });
    }

    /**
     * Updates module state by updating items list
     *
     * @method updateItemsState
     * @param {Object} responses
     * @memberof SubItemsModule
     */
    updateItemsState({ locations, content, totalCount, contentTypes }) {
        const items = locations.reduce((total, location) => {
            const itemLocation = location.value.Location;

            return [
                ...total,
                {
                    location: itemLocation,
                    content: content.find((item) => item.value.Content._id === itemLocation.ContentInfo.Content._id).value.Content,
                },
            ];
        }, []);

        this.setState((state) => ({
            items: [...state.items, ...items],
            isLoading: false,
            totalCount,
            contentTypesMap: {
                ...state.contentTypesMap,
                ...this.buildContentTypesMap(contentTypes),
            },
        }));
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
        this.setState(this.updateItemsOrder.bind(this, response.Location));
    }

    /**
     * Updates items order
     *
     * @method updateItemsOrder
     * @param {Object} location
     * @param {Object} state
     * @returns {Object}
     * @memberof SubItemsModule
     */
    updateItemsOrder(location, state) {
        const items = state.items;
        const item = items.find((element) => element.location.id === location.id);

        item.location = location;

        items.sort((a, b) => a.location.priority - b.location.priority);

        return { items };
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

    toggleItemSelect(location, isSelected) {
        const { selectedLocationsIds } = this.state;
        const updatedSelectedItemsIds = new Set(selectedLocationsIds);

        if (isSelected) {
            updatedSelectedItemsIds.add(location.id);
        } else {
            updatedSelectedItemsIds.delete(location.id);
        }

        this.setSelectedItemsState(updatedSelectedItemsIds);
    }

    toggleAllItemsSelect(isSelectAction) {
        if (isSelectAction) {
            this.selectAllItems();
        } else {
            this.deselectAllItems();
        }
    }

    selectAllItems() {
        const { items } = this.state;
        const contentItemsIds = items.map((item) => item.location.id);
        const contentItemsIdsSet = new Set(contentItemsIds);

        this.setSelectedItemsState(contentItemsIdsSet);
    }

    deselectAllItems() {
        this.setSelectedItemsState(new Set());
    }

    setSelectedItemsState(selectedLocationsIds) {
        this.setState(() => ({
            selectedLocationsIds,
        }));
    }

    getSelectedItems() {
        const { items, selectedLocationsIds } = this.state;
        const selectedLocationsIdsArray = [...selectedLocationsIds];
        const selectedItems = items.filter((item) => selectedLocationsIdsArray.includes(item.location.id));

        return selectedItems;
    }

    /**
     * Removes items of provided locations' IDs from items list in component state
     *
     * @param {Set} locationsToRemoveIds
     */
    removeItemsFromList(locationsToRemoveIds) {
        this.setState((state) => {
            const { items } = state;
            const itemsWithoutItemsToRemove = items.filter((item) => !locationsToRemoveIds.has(item.location.id));
            const removedItemsCount = items.length - itemsWithoutItemsToRemove.length;
            const selectedLocationsIds = new Set([...state.selectedLocationsIds].filter((id) => !locationsToRemoveIds.has(id)));

            return {
                selectedLocationsIds,
                items: itemsWithoutItemsToRemove,
                totalCount: state.totalCount - removedItemsCount,
                offset: state.offset - removedItemsCount,
            };
        });
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
        const itemsToMove = this.getSelectedItems();
        const contentsToMove = itemsToMove.map((item) => item.location);

        bulkMoveLocations(restInfo, contentsToMove, location._href, this.afterBulkMove.bind(this, location));
    }

    afterBulkMove(location, movedLocations, notMovedLocations) {
        const movedLocationsIds = new Set(movedLocations.map((location) => location.id));

        this.removeItemsFromList(movedLocationsIds);

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
        const selectedItems = this.getSelectedItems();
        const selectedItemsLocationsIds = selectedItems.map((item) => item.location.id);
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
        const itemsToDelete = this.getSelectedItems();
        const locationsToDelete = itemsToDelete.map((item) => item.location);

        bulkMoveLocationsToTrash(restInfo, locationsToDelete, this.afterBulkDelete);
    }

    afterBulkDelete(deletedLocations, notDeleted) {
        const deletedLocationsIds = new Set(deletedLocations.map((location) => location.id));

        this.removeItemsFromList(deletedLocationsIds);

        this.toggleBulkOperationStatusState(false);

        if (deletedLocations.length) {
            const message = Translator.trans(
                /*@Desc("The selected content item(s) have been sent to trash")*/ 'bulk_delete.success.message',
                {},
                'sub_items'
            );

            window.eZ.helpers.notification.showSuccessNotification(message);
        }

        if (notDeleted.length) {
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
     * Renders load more button
     *
     * @method renderLoadMore
     * @returns {JSX.Element}
     * @memberof SubItemsModule
     */
    renderLoadMore() {
        if (!this.state.totalCount) {
            return;
        }

        return (
            <LoadMoreComponent
                totalCount={this.state.totalCount}
                loadedCount={this.state.items.length}
                limit={this.state.limit}
                onLoadMore={this.handleLoadMore}
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

    render() {
        const { isLoading, isDuringBulkOperation } = this.state;
        let listClassName = 'm-sub-items__list';

        if (isLoading || isDuringBulkOperation) {
            listClassName = `${listClassName} ${listClassName}--loading`;
        }

        const listTitle = Translator.trans(/*@Desc("Sub-items")*/ 'items_list.title', {}, 'sub_items');
        const { activeView } = this.state;
        const selectedItems = this.getSelectedItems();
        const nothingSelected = !selectedItems.length;
        const isTableViewActive = activeView === 'table';
        const bulkBtnDisabled = nothingSelected || !isTableViewActive;

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
                    <ViewSwitcherComponent
                        onViewChange={this.switchView}
                        activeView={this.state.activeView}
                        isDisabled={!this.state.items.length}
                    />
                </div>
                <div className={listClassName}>
                    <SubItemsListComponent
                        activeView={activeView}
                        contentTypesMap={this.state.contentTypesMap}
                        handleItemPriorityUpdate={this.handleItemPriorityUpdate}
                        items={this.state.items}
                        languages={this.props.languages}
                        handleEditItem={this.props.handleEditItem}
                        generateLink={this.props.generateLink}
                        onItemSelect={this.toggleItemSelect}
                        toggleAllItemsSelect={this.toggleAllItemsSelect}
                        selectedLocationsIds={this.state.selectedLocationsIds}
                    />
                </div>
                {this.renderLoadMore()}
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
