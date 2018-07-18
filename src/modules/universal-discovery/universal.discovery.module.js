import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TabNavItemComponent from './components/tab-nav/tab.nav.item.component';
import FinderPanelComponent from './components/tab-content/finder.panel.component';
import SearchPanelComponent from './components/tab-content/search.panel.component';
import CreatePanelComponent from './components/tab-content/create.panel.component';
import BookmarksPanelComponent from './components/tab-content/bookmarks.panel.component';
import ContentCreatorComponent from './components/content-creator/content.creator.component';
import SelectedContentComponent from './components/selected-content/selected.content.component';
import ContentMetaPreviewComponent from './components/content-meta-preview/content.meta.preview.component';
import {
    loadContentInfo,
    loadContentTypes,
    findLocationsByParentLocationId,
    findContentBySearchQuery,
    checkCreatePermission,
} from './services/universal.discovery.service';
import { checkIsBookmarked, loadBookmarks, addBookmark, removeBookmark } from './services/bookmark.service';
import { showErrorNotification } from '../common/services/notification.service';
import { areSameLocations } from '../common/helpers/compare.helper';
import deepClone from '../common/helpers/deep.clone.helper';

import './css/universal.discovery.module.css';

export const TAB_BROWSE = 'browse';
export const TAB_SEARCH = 'search';
export const TAB_CREATE = 'create';
export const TAB_BOOKMARKS = 'bookmarks';

const CONTENT_META_PREVIEW_BASE_STATE = {
    contentMeta: null,
    isPreviewMetaReady: false,
    isLocationAllowed: true,
};

export default class UniversalDiscoveryModule extends Component {
    constructor(props) {
        super(props);

        let selectedContentType = {};
        const isForcedLanguage = props.cotfAllowedLanguages.length === 1 || props.cotfForcedLanguage;
        const isForcedContentType = props.cotfAllowedContentTypes.length === 1;
        const isForcedLocation = props.cotfAllowedLocations.length === 1;

        this.onLanguageSelected = this.onLanguageSelected.bind(this);
        this.onContentTypeSelected = this.onContentTypeSelected.bind(this);
        this.handlePublish = this.handlePublish.bind(this);
        this.togglePanel = this.togglePanel.bind(this);
        this.setContentTypesMap = this.setContentTypesMap.bind(this);
        this.canSelectContent = this.canSelectContent.bind(this);
        this.updateSelectedContent = this.updateSelectedContent.bind(this);
        this.onItemRemove = this.onItemRemove.bind(this);
        this.onItemSelect = this.onItemSelect.bind(this);
        this.renderSinglePanel = this.renderSinglePanel.bind(this);
        this.renderSingleTab = this.renderSingleTab.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleSingleConfirm = this.handleSingleConfirm.bind(this);
        this.setCreateModeState = this.setCreateModeState.bind(this);
        this.updateContentMetaWithCurrentVersion = this.updateContentMetaWithCurrentVersion.bind(this);
        this.toggleBookmark = this.toggleBookmark.bind(this);
        this.onBookmarkAdded = this.onBookmarkAdded.bind(this);
        this.onBookmarkRemoved = this.onBookmarkRemoved.bind(this);
        this.setBookmarkLoadingStatus = this.setBookmarkLoadingStatus.bind(this);
        this.requireBookmarksCount = this.requireBookmarksCount.bind(this);
        this.onBookmarksLoaded = this.onBookmarksLoaded.bind(this);
        this.updatePermissionsState = this.updatePermissionsState.bind(this);

        this.loadingBookmarksLocationsIds = {};

        if (isForcedContentType) {
            selectedContentType = this.findContentType(props.cotfAllowedContentTypes[0]);
        }

        this.state = {
            activeTab: props.activeTab,
            contentTypesMap: {},
            selectedContent: [],
            maxHeight: props.maxHeight,
            selectedLanguage: {},
            selectedContentType,
            isCreateMode: isForcedLanguage && isForcedContentType && isForcedLocation,
            hasPermission: true,
            userBookmarksCount: null,
            userBookmarksItems: [],
            bookmarksRequiredCount: 0,
            bookmarksDuringLoadingCount: 0,
            bookmarked: {},
            canSelectContent: false,
            ...CONTENT_META_PREVIEW_BASE_STATE,
        };
    }

    componentDidMount() {
        this.props.loadContentTypes(this.props.restInfo, this.setContentTypesMap);

        if (!this._refContentContainer) {
            return null;
        }

        this.setState((state) => ({ ...state, maxHeight: this._refContentContainer.clientHeight }));
        this.initializeBookmarks();
    }

    componentDidUpdate() {
        const { contentMeta, isPreviewMetaReady } = this.state;

        if (!!contentMeta && !isPreviewMetaReady) {
            this.props.loadContentInfo(this.props.restInfo, contentMeta.ContentInfo.Content._id, this.updateContentMetaWithCurrentVersion);
        }

        if (!this.props.multiple) {
            this.canSelectContent(contentMeta, (canSelectContent) => {
                if (this.state.canSelectContent === canSelectContent) {
                    return;
                }

                this.setState((state) => ({ ...state, canSelectContent }));
            });
        }
    }

    /**
     * Loads first 10 user's bookmarks (or less if user doesn't have that many bookmarks).
     * Sets total count of user's bookmarks.
     *
     * @method initializeBookmarks
     * @memberof UniversalDiscoveryModule
     */
    initializeBookmarks() {
        const { restInfo } = this.props;
        const bookmarksLoaded = new Promise((resolve) => loadBookmarks(restInfo, 10, 0, resolve));

        bookmarksLoaded
            .then(({ BookmarkList }) =>
                this.setState((state) => ({
                    ...state,
                    userBookmarksCount: BookmarkList.count,
                    userBookmarksItems: BookmarkList.items,
                }))
            )
            .catch(showErrorNotification);
    }

    /**
     * Updates selected content item meta with a current version info object
     *
     * @method updateContentMetaWithCurrentVersion
     * @param {Object} response
     */
    updateContentMetaWithCurrentVersion(response) {
        const contentMeta = deepClone(this.state.contentMeta);
        const currentVersion = response.View.Result.searchHits.searchHit[0].value.Content.CurrentVersion;

        contentMeta.CurrentVersion = currentVersion;

        this.setState((state) => ({ ...state, contentMeta, isPreviewMetaReady: true }));
    }

    /**
     * Finds a content type data
     *
     * @method findContentType
     * @param {String} identifier
     * @returns {Object}
     */
    findContentType(identifier) {
        let contentType = null;

        Object.values(this.props.contentTypes).forEach((group) => {
            const result = group.find((contentType) => contentType.identifier === identifier);

            if (result) {
                contentType = result;
            }
        });

        return contentType;
    }

    /**
     * Handles selection confirm action
     *
     * @method handleConfirm
     */
    handleConfirm() {
        this.props.onConfirm(this.addContentTypeInfo(this.state.selectedContent));
    }

    handleSingleConfirm() {
        this.setState(
            (state) => ({ ...state, selectedContent: [this.state.contentMeta] }),
            () => this.props.onConfirm(this.addContentTypeInfo(this.state.selectedContent))
        );
    }

    /**
     * Handles create content action
     *
     * @method setCreateModeState
     */
    setCreateModeState() {
        this.setState((state) => ({ ...state, isCreateMode: true }));
    }

    /**
     * Handles publish content action
     *
     * @method handlePublish
     * @param {Object} location
     */
    handlePublish(location) {
        this.props.onConfirm(this.addContentTypeInfo([location]));
    }

    /**
     * Adds a content type info to a content
     *
     * @method addContentTypeInfo
     * @param {Array} items
     * @returns {Array}
     */
    addContentTypeInfo(items) {
        const { contentTypesMap } = this.state;

        return items.map((item) => {
            const clonedItem = deepClone(item);
            const contentType = clonedItem.ContentInfo.Content.ContentType;

            clonedItem.ContentInfo.Content.ContentTypeInfo = contentTypesMap[contentType._href];

            return clonedItem;
        });
    }

    /**
     * Handles selected contet item removal action
     *
     * @method onItemRemove
     * @param {String} id
     */
    onItemRemove(id) {
        this.setState((state) => ({ ...state, selectedContent: state.selectedContent.filter((item) => item.id !== id) }));
    }

    /**
     * Handles item selected action
     *
     * @method onItemSelect
     * @param {Object} contentMeta
     */
    onItemSelect(contentMeta) {
        const isLocationAllowed = !this.props.cotfAllowedLocations.length || this.props.cotfAllowedLocations.includes(contentMeta.id);
        const contentMetaWithContentTypeInfo = this.addContentTypeInfo([contentMeta])[0];

        this.setState((state) => ({
            ...state,
            contentMeta: contentMetaWithContentTypeInfo,
            isLocationAllowed,
            isPreviewMetaReady: false,
        }));
    }

    /**
     * Fires `ez-bookmark-change` event
     *
     * @method dispatchBookmarkChangeEvent
     * @param {Number} locationId
     * @param {Boolean} bookmarked
     */
    dispatchBookmarkChangeEvent(locationId, bookmarked) {
        const event = new CustomEvent('ez-bookmark-change', { detail: { bookmarked, locationId } });

        document.body.dispatchEvent(event);
    }

    /**
     * Sets loading status of bookmark
     *
     * @method setBookmarkLoadingStatus
     * @param {String} locationId
     * @param {Boolean} isLoading
     * @memberof UniversalDiscoveryModule
     */
    setBookmarkLoadingStatus(locationId, isLoading) {
        this.loadingBookmarksLocationsIds[locationId] = isLoading;
    }

    /**
     * Returns true if bookmark is loading, otherwise returns false
     *
     * @method isBookmarkLoading
     * @param {String} locationId
     * @memberof UniversalDiscoveryModule
     */
    isBookmarkLoading(locationId) {
        return !!this.loadingBookmarksLocationsIds[locationId];
    }

    /**
     * Checks whether location is already bookmarked
     *
     * @method fetchBookmarkStatus
     * @param {String} locationId
     * @memberof UniversalDiscoveryModule
     */
    fetchBookmarkStatus(locationId) {
        if (this.isBookmarkLoading(locationId)) {
            return;
        }

        this.setBookmarkLoadingStatus(locationId, true);

        const { restInfo } = this.props;
        const checked = new Promise((resolve) => checkIsBookmarked(restInfo, locationId, resolve));

        checked
            .then((isBookmarked) => {
                this.setIsBookmarked(locationId, isBookmarked);
                this.setBookmarkLoadingStatus(locationId, false);
            })
            .catch(showErrorNotification);
    }

    /**
     * Sets bookmark value in the state
     *
     * @method setIsBookmarked
     * @param {String} locationId
     * @param {Boolean} isBookmarked
     * @memberof ContentMetaPreviewComponent
     */
    setIsBookmarked(locationId, isBookmarked) {
        this.setState((state) => {
            const bookmarked = { ...state.bookmarked };

            bookmarked[locationId] = isBookmarked;

            return { ...state, bookmarked };
        });
    }

    /**
     * Removes or adds bookmark depending on if it exists or not
     *
     * @method toggleBookmark
     * @param {Object} location
     * @memberof UniversalDiscoveryModule
     */
    toggleBookmark(location) {
        const locationId = location.id;
        const isBookmarked = this.isBookmarked(locationId);

        if (this.isBookmarkLoading(locationId)) {
            return;
        }

        this.setBookmarkLoadingStatus(locationId, true);

        const { restInfo } = this.props;
        const toggleBookmark = isBookmarked ? removeBookmark : addBookmark;
        const onBookmarkToggled = isBookmarked ? this.onBookmarkRemoved : this.onBookmarkAdded;
        const bookmarkToggled = new Promise((resolve) => toggleBookmark(restInfo, locationId, resolve));

        bookmarkToggled
            .then(() => {
                onBookmarkToggled(location);
                this.setBookmarkLoadingStatus(locationId, false);
            })
            .catch(showErrorNotification);
    }

    /**
     * Returns
     *
     * @method isBookmarked
     * @param {String} locationId
     * @returns {Boolean}
     * @memberof UniversalDiscoveryModule
     */
    isBookmarked(locationId) {
        const { bookmarked } = this.state;
        const locationBookmarkChecked = locationId in bookmarked;

        if (!locationBookmarkChecked) {
            this.fetchBookmarkStatus(locationId);
            return null;
        }

        return bookmarked[locationId];
    }

    /**
     * Called on bookmarked removed
     *
     * @method onBookmarkRemoved
     * @param {Object} itemToRemoveLocation
     * @memberof UniversalDiscoveryModule
     */
    onBookmarkRemoved(itemToRemoveLocation) {
        this.setState(
            (state) => ({
                ...state,
                userBookmarksCount: state.userBookmarksCount - 1,
                userBookmarksItems: state.userBookmarksItems.filter((item) => !areSameLocations(item.Location, itemToRemoveLocation)),
            }),
            () => {
                this.setIsBookmarked(itemToRemoveLocation.id, false);

                const { activeTab } = this.state;

                if (activeTab === TAB_BOOKMARKS) {
                    this.closeContentMetaPreview();
                }

                this.dispatchBookmarkChangeEvent(itemToRemoveLocation.id, false);
            }
        );
    }

    /**
     * Called on bookmarked added
     *
     * @method onBookmarkAdded
     * @param {Object} addedBookmarkLocation
     * @memberof UniversalDiscoveryModule
     */
    onBookmarkAdded(addedBookmarkLocation) {
        this.setState(
            (state) => ({
                ...state,
                userBookmarksCount: state.userBookmarksCount + 1,
                userBookmarksItems: [{ Location: addedBookmarkLocation }, ...state.userBookmarksItems],
            }),
            () => {
                this.setIsBookmarked(addedBookmarkLocation.id, true);
                this.dispatchBookmarkChangeEvent(addedBookmarkLocation.id, true);
            }
        );
    }

    /**
     * Called on bookmarks loaded
     *
     * @method onBookmarksLoaded
     * @param {Object} { BookmarksList }
     * @memberof UniversalDiscoveryModule
     */
    onBookmarksLoaded({ BookmarkList }) {
        const { items } = BookmarkList;

        this.setState(
            (state) => ({
                ...state,
                bookmarksDuringLoadingCount: state.bookmarksDuringLoadingCount - items.length,
                userBookmarksItems: [...items, ...state.userBookmarksItems],
            }),
            () => items.forEach((bookmarkLocation) => this.setIsBookmarked(bookmarkLocation.Location.id, true))
        );
    }

    /**
     * Loads bookmarks
     *
     * @method loadBookmarks
     * @param {Number} itemsToLoadCount
     * @memberof UniversalDiscoveryModule
     */
    loadBookmarks(itemsToLoadCount) {
        const { restInfo } = this.props;
        const offset = this.state.userBookmarksItems.length;
        const bookmarksLoaded = new Promise((resolve) => loadBookmarks(restInfo, itemsToLoadCount, offset, resolve));

        bookmarksLoaded.then(this.onBookmarksLoaded).catch(showErrorNotification);
    }

    /**
     * Ensures that enough bookmarks are loaded
     *
     * @method requireBookmarksCount
     * @param {String} locationId
     * @memberof UniversalDiscoveryModule
     */
    requireBookmarksCount(count) {
        this.setState((state) => {
            const { bookmarksRequiredCount, bookmarksDuringLoadingCount, userBookmarksItems } = state;
            const loadedBookmarksCount = userBookmarksItems.length;
            const newBookmarksRequiredCount = Math.max(count, bookmarksRequiredCount);
            const bookmarksToLoadCount = newBookmarksRequiredCount - loadedBookmarksCount - bookmarksDuringLoadingCount;

            if (!!bookmarksToLoadCount) {
                this.loadBookmarks(bookmarksToLoadCount);
            }

            return {
                ...state,
                bookmarksDuringLoadingCount: bookmarksDuringLoadingCount + bookmarksToLoadCount,
                bookmarksRequiredCount: newBookmarksRequiredCount,
            };
        });
    }

    /**
     * Updates language selected state
     *
     * @method onLanguageSelected
     * @param {String} selectedLanguage
     */
    onLanguageSelected(selectedLanguage) {
        this.setState((state) => ({ ...state, selectedLanguage }));
    }

    /**
     * Updates selected content type state
     *
     * @method onContentTypeSelected
     * @param {Object} selectedContentType
     */
    onContentTypeSelected(selectedContentType) {
        this.setState((state) => ({ ...state, selectedContentType }));
    }

    /**
     * Updates selected content state
     *
     * @method updateSelectedContent
     */
    updateSelectedContent(location) {
        const selectedContent = !this.props.multiple ? [location] : [...this.state.selectedContent, location];

        this.setState((state) => ({ ...state, selectedContent }));
    }

    /**
     * Does checking whether a content can be selected
     *
     * @method canSelectContent
     * @param {Object} data
     * @param {Function} callback
     * @returns {Boolean}
     */
    canSelectContent(data, callback) {
        if (!data) {
            return callback(false);
        }

        const { selectedContent, contentTypesMap } = this.state;
        const isAlreadySelected = selectedContent.find((item) => item.ContentInfo.Content._id === data.ContentInfo.Content._id);
        const isOverLimit = !!this.props.selectedItemsLimit && selectedContent.length >= this.props.selectedItemsLimit;
        const contentTypeInfo = contentTypesMap[data.ContentInfo.Content.ContentType._href];
        const isAllowedContentType =
            !this.props.cotfAllowedContentTypes.length || this.props.cotfAllowedContentTypes.includes(contentTypeInfo.identifier);

        if (isAlreadySelected || isOverLimit || !isAllowedContentType) {
            return callback(false);
        }

        data.ContentInfo.Content.ContentTypeInfo = contentTypeInfo;

        return this.props.canSelectContent({ item: data, itemsCount: selectedContent.length }, callback);
    }

    /**
     * Toggles visible panel state
     *
     * @method togglePanel
     * @param {String} activeTab
     */
    togglePanel(activeTab) {
        this.setState((state) => ({ ...state, activeTab, ...CONTENT_META_PREVIEW_BASE_STATE }));
    }

    /**
     * Closes CMP (Content Meta Preview)
     *
     * @method closeContentMetaPreview
     */
    closeContentMetaPreview() {
        this.setState((state) => ({ ...state, ...CONTENT_META_PREVIEW_BASE_STATE }));
    }

    /**
     * Sets content types map state
     *
     * @method setContentTypesMap
     * @param {Object} response
     */
    setContentTypesMap(response) {
        if (!response || !response.ContentTypeInfoList) {
            return;
        }

        const contentTypesMap = response.ContentTypeInfoList.ContentType.reduce((total, item) => {
            total[item._href] = item;

            return total;
        }, {});

        this.setState((state) => ({ ...state, contentTypesMap }));
    }

    /**
     * Renders content meta preview
     *
     * @method renderContentMetaPreview
     * @returns {Element}
     */
    renderContentMetaPreview() {
        if (!this.state.contentMeta) {
            return null;
        }

        const { contentTypesMap, maxHeight, activeTab, contentMeta, isPreviewMetaReady } = this.state;
        const { loadContentInfo, restInfo, languages, labels } = this.props;
        const isContentBookmarked = this.isBookmarked(contentMeta.id);

        return (
            <div className="m-ud__preview">
                <ContentMetaPreviewComponent
                    data={contentMeta}
                    isBookmarked={isContentBookmarked}
                    canSelectContent={this.canSelectContent}
                    toggleBookmark={this.toggleBookmark}
                    loadContentInfo={loadContentInfo}
                    restInfo={restInfo}
                    contentTypesMap={contentTypesMap}
                    languages={languages}
                    labels={labels.contentMetaPreview}
                    maxHeight={maxHeight}
                    activeTab={activeTab}
                    ready={isPreviewMetaReady}
                />
            </div>
        );
    }

    /**
     * Renders selected content list
     *
     * @method renderSelectedContent
     * @returns {Element}
     */
    renderSelectedContent() {
        const items = this.state.selectedContent;
        const { selectedItemsLimit, labels, multiple } = this.props;

        if (this.state.activeTab === TAB_CREATE) {
            return null;
        }

        return (
            <div className="m-ud__selected-content">
                <SelectedContentComponent
                    items={items}
                    itemsLimit={selectedItemsLimit}
                    onItemRemove={this.onItemRemove}
                    multiple={multiple}
                    contentTypesMap={this.state.contentTypesMap}
                    labels={labels}
                />
            </div>
        );
    }

    /**
     * Gets a specific tab config
     *
     * @method getTabConfig
     * @param {String} id
     * @param {String} iconIdentifier
     * @returns {Object}
     */
    getTabConfig(id, iconIdentifier) {
        return {
            id,
            iconIdentifier: iconIdentifier ? iconIdentifier : id,
            title: this.props.labels.udw[id],
            onClick: this.togglePanel,
            isSelected: this.state.activeTab === id,
        };
    }

    /**
     * Renders tabs
     *
     * @method renderTabs
     * @returns {Element}
     */
    renderTabs() {
        const { extraTabs, visibleTabs, onlyContentOnTheFly } = this.props;

        const browseTabConfig = this.getTabConfig(TAB_BROWSE);
        const searchTabConfig = this.getTabConfig(TAB_SEARCH);
        const createTabConfig = this.getTabConfig(TAB_CREATE);
        const bookmarksTabConfig = this.getTabConfig(TAB_BOOKMARKS, 'bookmark');

        let tabsToRender = [browseTabConfig, searchTabConfig, createTabConfig, bookmarksTabConfig, ...extraTabs];

        // @Deprecated - `onlyContentOnTheFly` will be removed in 2.0
        if (visibleTabs.length === 1 || onlyContentOnTheFly) {
            return null;
        }

        if (visibleTabs.length) {
            tabsToRender = visibleTabs.map((tab) => {
                return tabsToRender.find((config) => config.id === tab);
            });
        }

        return <nav className="m-ud__nav">{tabsToRender.map(this.renderSingleTab)}</nav>;
    }

    /**
     * Renders a single tabs
     *
     * @method renderSingleTab
     * @param {Object} tab
     * @returns {Element}
     */
    renderSingleTab(tab) {
        const attrs = { id: tab.id, title: tab.title, onClick: this.togglePanel, isSelected: this.state.activeTab === tab.id };

        if (tab.iconIdentifier) {
            attrs.iconIdentifier = tab.iconIdentifier;
        }

        return <TabNavItemComponent key={`panel-${tab.id}`} {...attrs} />;
    }

    /**
     * Renders panels
     *
     * @method renderPanels
     * @returns {Element}
     */
    renderPanels() {
        const {
            extraTabs,
            visibleTabs,
            sortFieldMappings,
            sortOrderMappings,
            languages,
            contentTypes,
            cotfPreselectedContentType,
            cotfForcedLanguage,
            cotfAllowedLanguages,
            cotfPreselectedLanguage,
            cotfAllowedContentTypes,
            cotfPreselectedLocation,
            cotfAllowedLocations,
            onlyContentOnTheFly,
        } = this.props;
        const { userBookmarksItems, userBookmarksCount } = this.state;
        const browsePanelConfig = { id: TAB_BROWSE, panel: FinderPanelComponent, attrs: { sortFieldMappings, sortOrderMappings } };
        const searchPanelConfig = { id: TAB_SEARCH, panel: SearchPanelComponent };
        const bookmarksPanelConfig = {
            id: TAB_BOOKMARKS,
            panel: BookmarksPanelComponent,
            attrs: { userBookmarksItems, userBookmarksCount, requireBookmarksCount: this.requireBookmarksCount },
        };
        const createPanelConfig = {
            id: TAB_CREATE,
            panel: CreatePanelComponent,
            attrs: {
                languages,
                contentTypes,
                onLanguageSelected: this.onLanguageSelected,
                onContentTypeSelected: this.onContentTypeSelected,
                contentTypesMap: this.state.contentTypesMap,
                forcedLanguage: cotfForcedLanguage,
                preselectedLanguage: cotfPreselectedLanguage,
                allowedLanguages: cotfAllowedLanguages,
                preselectedContentType: cotfPreselectedContentType,
                allowedContentTypes: cotfAllowedContentTypes,
                preselectedLocation: cotfPreselectedLocation,
                allowedLocations: cotfAllowedLocations,
                sortFieldMappings,
                sortOrderMappings,
            },
        };
        let panelsToRender = [browsePanelConfig, searchPanelConfig, createPanelConfig, bookmarksPanelConfig, ...extraTabs];

        if (onlyContentOnTheFly) {
            console.warn('[DEPRECATED] onlyContentOnTheFly parameter is deprecated');
            console.warn('[DEPRECATED] it will be removed from ezplatform-admin-ui-modules 2.0');
            console.warn('[DEPRECATED] use visibleTabs instead');

            return <div className="m-ud__panels">{this.renderSinglePanel(createPanelConfig)}</div>;
        }

        if (visibleTabs.length) {
            panelsToRender = visibleTabs.map((tab) => panelsToRender.find((config) => config.id === tab));
        }

        return <div className="m-ud__panels">{panelsToRender.map(this.renderSinglePanel)}</div>;
    }

    /**
     * Renders a single panel
     *
     * @method renderSinglePanel
     * @param {Object} item
     * @returns {Element}
     */
    renderSinglePanel(item) {
        const Panel = item.panel;
        const {
            startingLocationId,
            findLocationsByParentLocationId,
            findContentBySearchQuery,
            multiple,
            searchResultsPerPage,
            bookmarksPerPage,
            labels,
            restInfo,
            allowContainersOnly,
        } = this.props;
        const { activeTab, maxHeight, contentTypesMap, selectedContent } = this.state;
        const attrs = {
            isVisible: activeTab === item.id,
            onItemSelect: this.onItemSelect,
            maxHeight: maxHeight - 32,
            id: item.id,
            allowContainersOnly,
            startingLocationId,
            findLocationsByParentLocationId,
            findContentBySearchQuery,
            contentTypesMap,
            multiple,
            searchResultsPerPage,
            bookmarksPerPage,
            labels,
            restInfo,
            selectedContent,
            onSelectContent: this.updateSelectedContent,
            canSelectContent: this.canSelectContent,
            onItemRemove: this.onItemRemove,
            ...item.attrs,
        };

        return <Panel key={`panel-${item.id}`} {...attrs} />;
    }

    /**
     * Renders a confirm button
     *
     * @method renderConfirmBtn
     * @returns {Element}
     */
    renderConfirmBtn() {
        const { activeTab, selectedContent, contentMeta, canSelectContent, isPreviewMetaReady } = this.state;
        const { multiple } = this.props;
        const onClick = multiple ? this.handleConfirm : this.handleSingleConfirm;
        const attrs = { className: 'm-ud__action--confirm', onClick };

        if (activeTab === TAB_CREATE) {
            return null;
        }

        if ((multiple && !selectedContent.length) || (!multiple && (!isPreviewMetaReady || !canSelectContent))) {
            attrs.disabled = true;
        }

        return <button {...attrs}>{this.props.labels.udw.confirm}</button>;
    }

    /**
     * Does a permission checking
     *
     * @method renderSinglePanel
     * @param {Object} item
     * @returns {Element}
     */
    checkPermission() {
        checkCreatePermission(
            {
                token: this.props.restInfo.token,
                contentTypeIdentifier: this.state.selectedContentType.identifier,
                languageCode: this.state.selectedLanguage.languageCode,
                locationId: this.state.contentMeta.id,
            },
            this.updatePermissionsState
        );
    }

    /**
     * Updates a permission state
     *
     * @method updatePermissionsState
     * @param {Object} response
     */
    updatePermissionsState(response) {
        this.setState((state) => ({ ...state, hasPermission: response.access }));
    }

    /**
     * Renders a create content button
     *
     * @method renderCreateBtn
     * @returns {Element}
     */
    renderCreateBtn() {
        const isDataSelected = this.state.selectedLanguage && this.state.selectedContentType.identifier && this.state.contentMeta;
        const attrs = {
            className: 'm-ud__action--create-content',
            onClick: this.setCreateModeState,
            disabled: !this.state.hasPermission || !isDataSelected || !this.state.isLocationAllowed,
        };

        if (this.state.activeTab !== TAB_CREATE) {
            return null;
        }

        if (isDataSelected) {
            this.checkPermission();
        }

        return <button {...attrs}>{this.props.labels.contentOnTheFly.createContent}</button>;
    }

    /**
     * Renders permission error
     *
     * @method renderPermissionError
     * @returns {Element}
     */
    renderPermissionError() {
        const isDataSelected = this.state.selectedLanguage && this.state.selectedContentType && this.state.contentMeta;

        if (this.state.hasPermission || !isDataSelected) {
            return null;
        }

        return <span className="m-ud__no-permission">{this.props.labels.contentOnTheFly.noPermission}</span>;
    }

    /**
     * Renders not allowed location error
     *
     * @method renderNotAllowedLocationError
     * @returns {Element}
     */
    renderNotAllowedLocationError() {
        const isDataSelected = this.state.selectedLanguage && this.state.selectedContentType && this.state.contentMeta;

        if (this.state.isLocationAllowed || !isDataSelected || this.state.activeTab !== TAB_CREATE) {
            return null;
        }

        return <span className="m-ud__location-not-allowed">{this.props.labels.contentOnTheFly.locationNotAllowed}</span>;
    }

    render() {
        const componentClassName = 'm-ud';
        const metaPreviewClassName = !!this.state.contentMeta ? `${componentClassName}--with-preview` : '';
        const selectedContentClassName = this.state.selectedContent.length ? `${componentClassName}--with-selected-content` : '';
        const containerClassName = `${componentClassName} ${selectedContentClassName} ${metaPreviewClassName}`;
        const isDataSelected = this.state.selectedLanguage && this.state.selectedContentType.identifier && this.state.contentMeta;

        if (this.state.isCreateMode && this.state.activeTab === TAB_CREATE && isDataSelected && this.state.hasPermission) {
            return (
                <ContentCreatorComponent
                    maxHeight={this.state.maxHeight}
                    labels={this.props.labels}
                    selectedLanguage={this.state.selectedLanguage}
                    selectedContentType={this.state.selectedContentType}
                    selectedLocationId={this.state.contentMeta.id}
                    onCancel={this.props.onCancel}
                    handlePublish={this.handlePublish}
                    restInfo={this.props.restInfo}
                />
            );
        }
        return (
            <div className="m-ud__wrapper">
                <div className={containerClassName}>
                    <h1 className="m-ud__title">{this.props.title}</h1>
                    <div className="m-ud__content-wrapper">
                        {this.renderTabs()}
                        <div className="m-ud__content" ref={(ref) => (this._refContentContainer = ref)}>
                            {this.renderPanels()}
                            {this.renderContentMetaPreview()}
                        </div>
                        <div className="m-ud__actions">
                            {this.renderSelectedContent()}
                            <div className="m-ud__btns">
                                {this.renderPermissionError()}
                                {this.renderNotAllowedLocationError()}
                                <button className="m-ud__action--cancel" onClick={this.props.onCancel}>
                                    {this.props.labels.udw.cancel}
                                </button>
                                {this.renderConfirmBtn()}
                                {this.renderCreateBtn()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

UniversalDiscoveryModule.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    restInfo: PropTypes.shape({
        token: PropTypes.string.isRequired,
        siteaccess: PropTypes.string.isRequired,
    }).isRequired,
    title: PropTypes.string,
    multiple: PropTypes.bool,
    activeTab: PropTypes.string,
    loadContentInfo: PropTypes.func,
    loadContentTypes: PropTypes.func,
    canSelectContent: PropTypes.func,
    selectedItemsLimit: PropTypes.number,
    startingLocationId: PropTypes.number,
    findContentBySearchQuery: PropTypes.func,
    findLocationsByParentLocationId: PropTypes.func,
    extraTabs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            panel: PropTypes.func.isRequired,
            attrs: PropTypes.object,
        })
    ),
    labels: PropTypes.shape({
        udw: PropTypes.shape({
            confirm: PropTypes.string.isRequired,
            cancel: PropTypes.string.isRequired,
            search: PropTypes.string.isRequired,
            browse: PropTypes.string.isRequired,
            create: PropTypes.string.isRequired,
            bookmarks: PropTypes.string.isRequired,
        }).isRequired,
        selectedContentItem: PropTypes.object.isRequired,
        contentMetaPreview: PropTypes.object.isRequired,
        search: PropTypes.object.isRequired,
        searchPagination: PropTypes.object.isRequired,
        searchResults: PropTypes.object.isRequired,
        searchResultsItem: PropTypes.object.isRequired,
        bookmarks: PropTypes.object.isRequired,
        contentTablePagination: PropTypes.object.isRequired,
        contentTableHeader: PropTypes.object.isRequired,
        contentTableItem: PropTypes.object.isRequired,
        finderBranch: PropTypes.object.isRequired,
        contentOnTheFly: PropTypes.object.isRequired,
    }),
    maxHeight: PropTypes.number,
    searchResultsPerPage: PropTypes.number,
    bookmarksPerPage: PropTypes.number,
    languages: PropTypes.object,
    contentTypes: PropTypes.object,
    allowContainersOnly: PropTypes.bool.isRequired,

    // @Deprecated - to be removed in 2.0
    onlyContentOnTheFly: PropTypes.bool,
    // @Deprecated - to be removed in 2.0
    cotfForcedLanguage: PropTypes.string,

    cotfPreselectedLanguage: PropTypes.string,
    cotfAllowedLanguages: PropTypes.array,
    cotfPreselectedContentType: PropTypes.string,
    cotfAllowedContentTypes: PropTypes.array,
    cotfPreselectedLocation: PropTypes.number,
    cotfAllowedLocations: PropTypes.array,
    visibleTabs: PropTypes.array,
    sortFieldMappings: PropTypes.object.isRequired,
    sortOrderMappings: PropTypes.object.isRequired,
};

UniversalDiscoveryModule.defaultProps = {
    title: 'Find content',
    multiple: true,
    selectedItemsLimit: 0,
    activeTab: TAB_BROWSE,
    loadContentInfo,
    loadContentTypes,
    findContentBySearchQuery,
    findLocationsByParentLocationId,
    canSelectContent: (item, callback) => callback(true),
    extraTabs: window.eZ.adminUiConfig.universalDiscoveryWidget.extraTabs || [],
    startingLocationId: 1,
    maxHeight: 500,
    searchResultsPerPage: 10,
    bookmarksPerPage: 10,
    languages: window.eZ.adminUiConfig.languages,
    contentTypes: window.eZ.adminUiConfig.contentTypes,
    allowContainersOnly: false,
    onlyContentOnTheFly: false,
    cotfForcedLanguage: '',
    cotfPreselectedLanguage: '',
    cotfAllowedLanguages: [],
    cotfPreselectedContentType: '',
    cotfAllowedContentTypes: [],
    cotfPreselectedLocation: null,
    cotfAllowedLocations: [],
    visibleTabs: [],
    sortFieldMappings: window.eZ.adminUiConfig.sortFieldMappings,
    sortOrderMappings: window.eZ.adminUiConfig.sortOrderMappings,
    labels: {
        udw: {
            confirm: 'Confirm',
            cancel: 'Cancel',
            browse: 'Browse',
            search: 'Search',
            create: 'Create',
            bookmarks: 'Bookmarks',
        },
        selectedContent: {
            confirmedItems: 'Confirmed items',
            limit: 'Limit {items} max',
            noConfirmedContent: 'No confirmed content yet',
        },
        selectedContentItem: {
            notAvailable: 'N/A',
        },
        contentMetaPreview: {
            title: 'Content Meta Preview',
            selectContent: 'Select content',
            notAvailable: 'N/A',
            creationDate: 'Creation date',
            lastModified: 'Last modified',
            translations: 'Translations',
            imagePreviewNotAvailable: 'Content preview is not available',
        },
        search: {
            title: 'Search',
            tableTitle: 'Search results',
            searchBtnLabel: 'Search',
        },
        searchPagination: {
            first: 'First',
            prev: 'Previous',
            next: 'Next',
            last: 'Last',
        },
        searchResults: {
            headerName: 'Name',
            headerType: 'Content Type',
            resultsTitle: 'Search results',
        },
        searchResultsItem: {
            notAvailable: 'N/A',
        },
        bookmarks: {
            noBookmarks: 'No content items. Content items you bookmark will appear here.',
            tableTitle: 'Bookmarks',
        },
        contentTablePagination: {
            first: 'First',
            prev: 'Previous',
            next: 'Next',
            last: 'Last',
        },
        contentTableHeader: {
            name: 'Name',
            type: 'Content Type',
        },
        contentTableItem: {
            notAvailable: 'N/A',
        },
        finderBranch: {
            loadMore: 'Load more',
        },
        contentOnTheFly: {
            chooseLangaugeAndContentType: 'Choose Language and Content Type',
            selectLocation: 'Select Location',
            selectLanguage: 'Select a language',
            selectContentType: 'Select a Content Type',
            creatingContent: 'Creating - {contentType} in {language}',
            publish: 'Publish',
            createContent: 'Create content',
            noPermission: "Sorry, but you don't have permission for this action. Please contact your site Admin.",
            locationNotAllowed: 'Sorry, but this location is not selectable.',
            typeToRefine: 'Type to refine',
        },
    },
};
