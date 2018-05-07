import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TabNavItemComponent from './components/tab-nav/tab.nav.item.component';
import FinderPanelComponent from './components/tab-content/finder.panel.component';
import SearchPanelComponent from './components/tab-content/search.panel.component';
import CreatePanelComponent from './components/tab-content/create.panel.component';
import ContentCreatorComponent from './components/content-creator/content.creator.component';
import SelectedContentComponent from './components/selected-content/selected.content.component';
import ContentMetaPreviewComponent from './components/content-meta-preview/content.meta.preview.component';
import {
    loadContentInfo,
    loadContentTypes,
    findLocationsByParentLocationId,
    findContentBySearchQuery,
    checkCreatePermission
} from './services/universal.discovery.service';

import './css/universal.discovery.module.css';

const TAB_BROWSE = 'browse';
const TAB_SEARCH = 'search';
const TAB_CREATE = 'create';

export default class UniversalDiscoveryModule extends Component {
    constructor(props) {
        super(props);

        let selectedContentType = {};
        let contentMeta = null;
        const isForcedLanguage = props.cotfAllowedLanguages.length === 1 || props.cotfForcedLanguage;
        const isForcedContentType = props.cotfAllowedContentTypes.length === 1;
        const isForcedLocation = props.cotfAllowedLocations.length === 1;

        this.onLanguageSelected = this.onLanguageSelected.bind(this);
        this.onContentTypeSelected = this.onContentTypeSelected.bind(this);
        this.handlePublish = this.handlePublish.bind(this);

        if (isForcedContentType) {
            selectedContentType = this.findContentType(props.cotfAllowedContentTypes[0]);
        }

        this.state = {
            activeTab: props.activeTab,
            contentMeta,
            contentTypesMap: {},
            selectedContent: [],
            maxHeight: props.maxHeight,
            selectedLanguage: {},
            selectedContentType,
            isCreateMode: isForcedLanguage && isForcedContentType && isForcedLocation,
            hasPermission: true,
            isLocationAllowed: true
        };
    }

    componentDidMount() {
        this.props.loadContentTypes(this.props.restInfo, this.setContentTypesMap.bind(this));

        if (!this._refContentContainer) {
            return null;
        }

        this.setState(state => Object.assign({}, state, {maxHeight: this._refContentContainer.clientHeight}));
    }

    findContentType(identifier) {
        let contentType = null;

        Object.values(this.props.contentTypes).forEach(group => {
            const result = group.find(contentType => contentType.identifier === identifier);

            if (result) {
                contentType = result;
            }
        });

        return contentType;
    }

    handleConfirm() {
        this.props.onConfirm(this.addContentTypeInfo(this.state.selectedContent));
    }

    handleCreateContent() {
        this.setState(state => Object.assign({}, state, {isCreateMode: true}));
    }

    handlePublish(location) {
        this.props.onConfirm(this.addContentTypeInfo([location]));
    }

    addContentTypeInfo(content) {
        return content.map(item => {
            item.ContentInfo.Content.ContentTypeInfo = this.state.contentTypesMap[item.ContentInfo.Content.ContentType._href];

            return item;
        });
    }

    onItemRemove(id) {
        this.setState(state => Object.assign({}, state, {
            selectedContent: state.selectedContent.filter(item => item.id !== id)
        }));
    }

    onItemSelect(contentMeta) {
        const isLocationAllowed = !this.props.cotfAllowedLocations.length || this.props.cotfAllowedLocations.includes(contentMeta.id);

        this.setState(state => Object.assign({}, state, { contentMeta, isLocationAllowed }));
    }

    onLanguageSelected(selectedLanguage) {
        this.setState(state => Object.assign({}, state, {selectedLanguage}));
    }

    onContentTypeSelected(selectedContentType) {
        this.setState(state => Object.assign({}, state, {selectedContentType}));
    }

    updateSelectedContent() {
        const selectedContent = !this.props.multiple ?
            [this.state.contentMeta] :
            [...this.state.selectedContent, this.state.contentMeta];

        this.setState(state => Object.assign({}, state, {selectedContent}));
    }

    canSelectContent(data, callback) {
        const {selectedContent} = this.state;
        const isAlreadySelected = selectedContent.find(item => item.ContentInfo.Content._id === data.ContentInfo.Content._id);
        const isOverLimit = (!!this.props.selectedItemsLimit && selectedContent.length >= this.props.selectedItemsLimit);
        const contentTypeInfo = this.state.contentTypesMap[data.ContentInfo.Content.ContentType._href];
        const isAllowedContentType = !this.props.cotfAllowedContentTypes.length || this.props.cotfAllowedContentTypes.includes(contentTypeInfo.identifier);

        if (isAlreadySelected || isOverLimit || !isAllowedContentType) {
            return callback(false);
        }

        data.ContentInfo.Content.ContentTypeInfo = contentTypeInfo;

        return this.props.canSelectContent({
            item: data,
            itemsCount: selectedContent.length
        }, callback);
    }

    togglePanel(activeTab) {
        this.setState(state => Object.assign({}, state, {
            activeTab,
            contentMeta: null
        }));
    }

    setContentTypesMap(response) {
        if (!response || !response.ContentTypeInfoList) {
            return;
        }

        const contentTypesMap = response.ContentTypeInfoList.ContentType.reduce((total, item) => {
            total[item._href] = item;

            return total;
        }, {});

        return this.setState(state => Object.assign({}, state, {contentTypesMap}));
    }

    renderContentMetaPreview() {
        if (!this.state.contentMeta) {
            return null;
        }

        return (
            <div className="m-ud__preview">
                <ContentMetaPreviewComponent
                    data={this.addContentTypeInfo([this.state.contentMeta])[0]}
                    canSelectContent={this.canSelectContent.bind(this)}
                    onSelectContent={this.updateSelectedContent.bind(this)}
                    loadContentInfo={this.props.loadContentInfo}
                    restInfo={this.props.restInfo}
                    contentTypesMap={this.state.contentTypesMap}
                    languages={this.props.languages}
                    labels={this.props.labels.contentMetaPreview}
                    maxHeight={this.state.maxHeight}
                    activeTab={this.state.activeTab}/>
            </div>
        );
    }

    renderSelectedContent() {
        const items = this.state.selectedContent;
        const {selectedItemsLimit, labels, multiple} = this.props;

        if (this.state.activeTab === TAB_CREATE) {
            return null;
        }

        return (
            <div className="m-ud__selected-content">
                <SelectedContentComponent
                    items={items}
                    itemsLimit={selectedItemsLimit}
                    onItemRemove={this.onItemRemove.bind(this)}
                    multiple={multiple}
                    contentTypesMap={this.state.contentTypesMap}
                    labels={labels} />
            </div>
        );
    }

    renderTabs() {
        const browseTabConfig = {
            id: TAB_BROWSE,
            iconIdentifier: TAB_BROWSE,
            title: this.props.labels.udw.browse,
            onClick: this.togglePanel.bind(this),
            isSelected: this.state.activeTab === TAB_BROWSE,
        };
        const searchTabConfig = {
            id: TAB_SEARCH,
            iconIdentifier: TAB_SEARCH,
            title: this.props.labels.udw.search,
            onClick: this.togglePanel.bind(this),
            isSelected: this.state.activeTab === TAB_SEARCH,
        };
        const createTabConfig = {
            id: TAB_CREATE,
            iconIdentifier: TAB_CREATE,
            title: this.props.labels.udw.create,
            onClick: this.togglePanel.bind(this),
            isSelected: this.state.activeTab === TAB_CREATE,
        };
        const { extraTabs } = this.props;
        let tabsToRender = [browseTabConfig, searchTabConfig, createTabConfig, ...extraTabs];

        // @Deprecated - `onlyContentOnTheFly` will be removed in 2.0
        if (this.props.visibleTabs.length === 1 || this.props.onlyContentOnTheFly) {
            return null;
        }

        if (this.props.visibleTabs.length) {
            tabsToRender = this.props.visibleTabs.map(tab => {
                return tabsToRender.find(config => config.id === tab);
            });
        }

        return (
            <nav className="m-ud__nav">
                {tabsToRender.map(this.renderSingleTab.bind(this))}
            </nav>
        );
    }

    renderSingleTab(tab) {
        const attrs = {
            id: tab.id,
            title: tab.title,
            onClick: this.togglePanel.bind(this),
            isSelected: this.state.activeTab === tab.id
        };

        if (tab.iconIdentifier) {
            attrs.iconIdentifier = tab.iconIdentifier;
        }

        return <TabNavItemComponent key={`panel-${tab.id}`} {...attrs} />;
    }

    renderPanels() {
        const { extraTabs } = this.props;
        const browsePanelConfig = {
            id: TAB_BROWSE,
            panel: FinderPanelComponent
        };
        const searchPanelConfig = {
            id: TAB_SEARCH,
            panel: SearchPanelComponent
        };
        const createPanelConfig = {
            id: TAB_CREATE,
            panel: CreatePanelComponent,
            attrs: {
                languages: this.props.languages,
                contentTypes: this.props.contentTypes,
                onLanguageSelected: this.onLanguageSelected,
                onContentTypeSelected: this.onContentTypeSelected,
                contentTypesMap: this.state.contentTypesMap,
                forcedLanguage: this.props.cotfForcedLanguage,
                preselectedLanguage: this.props.cotfPreselectedLanguage,
                allowedLanguages: this.props.cotfAllowedLanguages,
                preselectedContentType: this.props.cotfPreselectedContentType,
                allowedContentTypes: this.props.cotfAllowedContentTypes,
                preselectedLocation: this.props.cotfPreselectedLocation,
                allowedLocations: this.props.cotfAllowedLocations,
            }
        };
        let panelsToRender = [browsePanelConfig, searchPanelConfig, createPanelConfig, ...extraTabs];

        if (this.props.onlyContentOnTheFly) {
            console.warn('[DEPRECATED] onlyContentOnTheFly parameter is deprecated');
            console.warn('[DEPRECATED] it will be removed from ezplatform-admin-ui-modules 2.0');
            console.warn('[DEPRECATED] use visibleTabs instead');

            return (
                <div className="m-ud__panels">
                    {this.renderSinglePanel(createPanelConfig)}
                </div>
            );
        }

        if (this.props.visibleTabs.length) {
            panelsToRender = this.props.visibleTabs.map(tab => {
                return panelsToRender.find(config => config.id === tab);
            });
        }

        return (
            <div className="m-ud__panels">
                {panelsToRender.map(this.renderSinglePanel.bind(this))}
            </div>
        );
    }

    renderSinglePanel(item) {
        const Panel = item.panel;
        const {
            startingLocationId,
            findLocationsByParentLocationId,
            findContentBySearchQuery,
            multiple,
            searchResultsPerPage,
            labels,
            restInfo
        } = this.props;
        const {activeTab, maxHeight, contentTypesMap} = this.state;
        const attrs = Object.assign({}, {
            isVisible: activeTab === item.id,
            onItemSelect: this.onItemSelect.bind(this),
            maxHeight: maxHeight - 32,
            id: item.id,
            allowContainersOnly: this.props.allowContainersOnly,
            startingLocationId,
            findLocationsByParentLocationId,
            findContentBySearchQuery,
            contentTypesMap,
            multiple,
            searchResultsPerPage,
            labels,
            restInfo
        }, item.attrs);

        return <Panel key={`panel-${item.id}`} {...attrs} />;
    }

    renderConfirmBtn() {
        const attrs = {
            className: 'm-ud__action--confirm',
            onClick: this.handleConfirm.bind(this)
        };

        if (this.state.activeTab === TAB_CREATE) {
            return null;
        }

        if (!this.state.selectedContent.length) {
            attrs.disabled = true;
        }

        return <button {...attrs}>{this.props.labels.udw.confirm}</button>
    }

    checkPermission() {
        checkCreatePermission({
           token: this.props.restInfo.token,
           contentTypeIdentifier: this.state.selectedContentType.identifier,
           languageCode: this.state.selectedLanguage.languageCode,
           locationId: this.state.contentMeta.id
        }, (response) => {
            if (this.state.hasPermission !== response.access) {
               this.setState(state => Object.assign({}, state, {hasPermission: response.access}));
            }
        });
    }

    renderCreateBtn() {
        const isDataSelected = this.state.selectedLanguage && this.state.selectedContentType.identifier  && this.state.contentMeta;
        const attrs = {
            className: 'm-ud__action--create-content',
            onClick: this.handleCreateContent.bind(this),
            disabled: !this.state.hasPermission || !isDataSelected || !this.state.isLocationAllowed
        };

        if (this.state.activeTab !== TAB_CREATE) {
            return null;
        }

        if (isDataSelected) {
            this.checkPermission();
        }

        return <button {...attrs}>{this.props.labels.contentOnTheFly.createContent}</button>
    }

    renderPermissionError() {
        const isDataSelected = this.state.selectedLanguage && this.state.selectedContentType  && this.state.contentMeta;

        if (this.state.hasPermission || !isDataSelected) {
            return null;
        }

        return (
            <span className="m-ud__no-permission">{this.props.labels.contentOnTheFly.noPermission}</span>
        );
    }

    renderNotAllowedLocationError() {
        const isDataSelected = this.state.selectedLanguage && this.state.selectedContentType  && this.state.contentMeta;

        if (this.state.isLocationAllowed || !isDataSelected || this.state.activeTab !== TAB_CREATE) {
            return null;
        }

        return (
            <span className="m-ud__location-not-allowed">{this.props.labels.contentOnTheFly.locationNotAllowed}</span>
        );
    }

    render() {
        const componentClassName = 'm-ud';
        const metaPreviewClassName = (!!this.state.contentMeta) ? `${componentClassName}--with-preview` : '';
        const selectedContentClassName = this.state.selectedContent.length ? `${componentClassName}--with-selected-content` : '';
        const containerClassName = `${componentClassName} ${selectedContentClassName} ${metaPreviewClassName}`;
        const isDataSelected = this.state.selectedLanguage && this.state.selectedContentType.identifier  && this.state.contentMeta;

        if (this.state.isCreateMode && this.state.activeTab === TAB_CREATE && isDataSelected && this.state.hasPermission) {
            return <ContentCreatorComponent
                maxHeight={this.state.maxHeight}
                labels={this.props.labels}
                selectedLanguage={this.state.selectedLanguage}
                selectedContentType={this.state.selectedContentType}
                selectedLocationId={this.state.contentMeta.id}
                onCancel={this.props.onCancel}
                handlePublish={this.handlePublish}
                restInfo={this.props.restInfo} />
        }

        return (
            <div className="m-ud__wrapper">
                <div className={containerClassName}>
                    <h1 className="m-ud__title">{this.props.title}</h1>
                    <div className="m-ud__content-wrapper">
                        {this.renderTabs()}
                        <div className="m-ud__content" ref={ref => this._refContentContainer = ref}>
                            {this.renderPanels()}
                            {this.renderContentMetaPreview()}
                        </div>
                        <div className="m-ud__actions">
                            {this.renderSelectedContent()}
                            <div className="m-ud__btns">
                                {this.renderPermissionError()}
                                {this.renderNotAllowedLocationError()}
                                <button className="m-ud__action--cancel" onClick={this.props.onCancel}>{this.props.labels.udw.cancel}</button>
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
        siteaccess: PropTypes.string.isRequired
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
    extraTabs: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        panel: PropTypes.func.isRequired,
        attrs: PropTypes.object
    })),
    labels: PropTypes.shape({
        udw: PropTypes.shape({
            confirm: PropTypes.string.isRequired,
            cancel: PropTypes.string.isRequired,
            search: PropTypes.string.isRequired,
            browse: PropTypes.string.isRequired,
            create: PropTypes.string.isRequired
        }).isRequired,
        selectedContentItem: PropTypes.object.isRequired,
        contentMetaPreview: PropTypes.object.isRequired,
        search: PropTypes.object.isRequired,
        searchPagination: PropTypes.object.isRequired,
        searchResults: PropTypes.object.isRequired,
        searchResultsItem: PropTypes.object.isRequired,
        finderBranch: PropTypes.object.isRequired,
        contentOnTheFly: PropTypes.object.isRequired
    }),
    maxHeight: PropTypes.number,
    searchResultsPerPage: PropTypes.number,
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
    visibleTabs: PropTypes.array
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
    labels: {
        udw: {
            confirm: 'Confirm',
            cancel: 'Cancel',
            browse: 'Browse',
            search: 'Search',
            create: 'Create'
        },
        selectedContent: {
            confirmedItems: 'Confirmed items',
            limit: 'Limit {items} max',
            noConfirmedContent: 'No confirmed content yet'
        },
        selectedContentItem: {
            notAvailable: 'N/A'
        },
        contentMetaPreview: {
            title: 'Content Meta Preview',
            selectContent: 'Select content',
            notAvailable: 'N/A',
            creationDate: 'Creation date',
            lastModified: 'Last modified',
            translations: 'Translations'
        },
        search: {
            title: 'Search',
            searchBtnLabel: 'Search'
        },
        searchPagination: {
            first: 'First',
            prev: 'Previous',
            next: 'Next',
            last: 'Last'
        },
        searchResults: {
            headerName: 'Name',
            headerType: 'Content Type',
            resultsTitle: 'Search results'
        },
        searchResultsItem: {
            notAvailable: 'N/A'
        },
        finderBranch: {
            loadMore: 'Load more'
        },
        contentOnTheFly: {
            chooseLangaugeAndContentType: 'Choose Language and Content Type',
            selectLocation: 'Select Location',
            selectLanguage: 'Select a language',
            selectContentType: 'Select a Content Type',
            creatingContent: 'Creating - {contentType} in {language}',
            publish: 'Publish',
            createContent: 'Create content',
            noPermission: 'Sorry, but you don\'t have permission for this action. Please contact your site Admin.',
            locationNotAllowed: 'Sorry, but this location is not selectable.',
            typeToRefine: 'Type to refine'
        }
    }
};
