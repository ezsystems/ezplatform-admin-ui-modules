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

        let selectedLanguage = props.languages[0];

        this.onLanguageSelected = this.onLanguageSelected.bind(this);
        this.onContentTypeSelected = this.onContentTypeSelected.bind(this);
        this.handlePublish = this.handlePublish.bind(this);

        if (props.cotfForcedLanguage) {
            selectedLanguage = props.languages.find(language => language.languageCode === props.cotfForcedLanguage);
        }

        this.state = {
            activeTab: props.activeTab,
            contentMeta: null,
            contentTypesMap: {},
            selectedContent: [],
            maxHeight: props.maxHeight,
            selectedLanguage: selectedLanguage,
            selectedContentType: '',
            isCreateMode: false,
            hasPermission: true
        };
    }

    componentDidMount() {
        this.props.loadContentTypes(this.props.restInfo, this.setContentTypesMap.bind(this));

        if (!this._refContentContainer) {
            return null;
        }

        this.setState(state => Object.assign({}, state, {maxHeight: this._refContentContainer.clientHeight}));
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
        this.setState(state => Object.assign({}, state, {contentMeta}));
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

        if (isAlreadySelected || (!!this.props.selectedItemsLimit && selectedContent.length >= this.props.selectedItemsLimit)) {
            return callback(false);
        }

        data.ContentInfo.Content.ContentTypeInfo = this.state.contentTypesMap[data.ContentInfo.Content.ContentType._href];

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
        const isBrowseVisible = this.state.activeTab === TAB_BROWSE;
        const isSearchVisible = this.state.activeTab === TAB_SEARCH;
        const isCreateVisible = this.state.activeTab === TAB_CREATE;
        const { extraTabs } = this.props;

        if (this.props.onlyContentOnTheFly) {
            return null;
        }

        return (
            <nav className="m-ud__nav">
                <TabNavItemComponent
                    id={TAB_BROWSE}
                    title={this.props.labels.udw.browse}
                    onClick={this.togglePanel.bind(this)}
                    isSelected={isBrowseVisible}
                    iconIdentifier={TAB_BROWSE} />
                <TabNavItemComponent
                    id={TAB_SEARCH}
                    title={this.props.labels.udw.search}
                    onClick={this.togglePanel.bind(this)}
                    isSelected={isSearchVisible}
                    iconIdentifier={TAB_SEARCH} />
                <TabNavItemComponent
                    id={TAB_CREATE}
                    title={this.props.labels.udw.create}
                    onClick={this.togglePanel.bind(this)}
                    isSelected={isCreateVisible}
                    iconIdentifier={TAB_CREATE} />
                {extraTabs.map(this.renderSingleTab.bind(this))}
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
                forcedLanguage: this.props.cotfForcedLanguage
            }
        };

        if (this.props.onlyContentOnTheFly) {
            return (
                <div className="m-ud__panels">
                    {this.renderSinglePanel(createPanelConfig)}
                </div>
            );
        }

        return (
            <div className="m-ud__panels">
                {this.renderSinglePanel(browsePanelConfig)}
                {this.renderSinglePanel(searchPanelConfig)}
                {this.renderSinglePanel(createPanelConfig)}
                {extraTabs.map(this.renderSinglePanel.bind(this))}
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
        const isDataSelected = this.state.selectedLanguage && this.state.selectedContentType  && this.state.contentMeta;
        const attrs = {
            className: 'm-ud__action--create-content',
            onClick: this.handleCreateContent.bind(this),
            disabled: !this.state.hasPermission || !isDataSelected
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

    render() {
        const componentClassName = 'm-ud';
        const metaPreviewClassName = (!!this.state.contentMeta) ? `${componentClassName}--with-preview` : '';
        const selectedContentClassName = this.state.selectedContent.length ? `${componentClassName}--with-selected-content` : '';
        const containerClassName = `${componentClassName} ${selectedContentClassName} ${metaPreviewClassName}`;

        if (this.state.isCreateMode) {
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
    languages: PropTypes.array,
    contentTypes: PropTypes.object,
    allowContainersOnly: PropTypes.bool.isRequired,
    onlyContentOnTheFly: PropTypes.bool,
    cotfForcedLanguage: PropTypes.string,
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
    languages: window.eZ.adminUiConfig.universalDiscoveryWidget.contentOnTheFly.languages,
    contentTypes: window.eZ.adminUiConfig.universalDiscoveryWidget.contentOnTheFly.contentTypes,
    allowContainersOnly: false,
    onlyContentOnTheFly: false,
    cotfForcedLanguage: '',
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
            typeToRefine: 'Type to refine'
        }
    }
};
