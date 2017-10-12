import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TabNavItemComponent from './components/tab-nav/tab.nav.item.component';
import FinderPanelComponent from './components/tab-content/finder.panel.component';
import SearchPanelComponent from './components/tab-content/search.panel.component';
import SelectedContentComponent from './components/selected-content/selected.content.component';
import ContentMetaPreviewComponent from './components/content-meta-preview/content.meta.preview.component';
import {
    loadContentInfo,
    loadContentTypes,
    findLocationsByParentLocationId,
    findContentBySearchQuery
} from './services/universal.discovery.service';

import './css/universal.discovery.module.css';

const TAB_BROWSE = 'browse';
const TAB_SEARCH = 'search';

export default class UniversalDiscoveryModule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: props.activeTab,
            contentMeta: null,
            contentTypesMap: {},
            selectedContent: [],
            maxHeight: props.maxHeight
        };
    }

    componentDidMount() {
        this.props.loadContentTypes(this.setContentTypesMap.bind(this));

        if (!this._refContentContainer) {
            return null;
        }

        this.setState(state => Object.assign({}, state, {maxHeight: this._refContentContainer.clientHeight}));
    }

    handleConfirm() {
        this.props.onConfirm(this.state.selectedContent);
    }

    onItemRemove(id) {
        this.setState(state => Object.assign({}, state, {
            selectedContent: state.selectedContent.filter(item => item.id !== id)
        }));
    }

    onItemSelect(contentMeta) {
        this.setState(state => Object.assign({}, state, {contentMeta}));
    }

    updateSelectedContent() {
        const selectedContent = !this.props.multiple ?
            [this.state.contentMeta] :
            [...this.state.selectedContent, this.state.contentMeta];

        this.setState(state => Object.assign({}, state, {selectedContent}));
    }

    canSelectContent(content) {
        const isAlreadySelected = this.state.selectedContent.find(item => item.ContentInfo.Content._id === content._id);

        if (isAlreadySelected) {
            return false;
        }

        return this.props.canSelectContent(content);
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
                    data={this.state.contentMeta}
                    canSelectContent={this.canSelectContent.bind(this)}
                    onSelectContent={this.updateSelectedContent.bind(this)}
                    loadContentInfo={this.props.loadContentInfo}
                    contentTypesMap={this.state.contentTypesMap}
                    labels={this.props.labels.contentMetaPreview} />
            </div>
        );
    }

    renderSelectedContent() {
        const items = this.state.selectedContent;

        if (!items.length) {
            return null;
        }

        return (
            <div className="m-ud__selected-content">
                <SelectedContentComponent
                    items={items}
                    onItemRemove={this.onItemRemove.bind(this)}
                    contentTypesMap={this.state.contentTypesMap}
                    labels={this.props.labels} />
            </div>
        );
    }

    renderTabs() {
        const isBrowseVisible = this.state.activeTab === TAB_BROWSE;
        const isSearchVisible = this.state.activeTab === TAB_SEARCH;

        return (
            <nav className="m-ud__nav">
                <TabNavItemComponent
                    id={TAB_BROWSE}
                    title={this.props.labels.udw.browse}
                    onClick={this.togglePanel.bind(this)}
                    isSelected={isBrowseVisible} />
                <TabNavItemComponent
                    id={TAB_SEARCH}
                    title={this.props.labels.udw.search}
                    onClick={this.togglePanel.bind(this)}
                    isSelected={isSearchVisible} />
                {this.props.extraTabs && this.props.extraTabs.map(this.renderSingleTab.bind(this))}
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

        return <TabNavItemComponent key={`panel-${tab.id}`} {...attrs}/>;
    }

    renderPanels() {
        const browsePanelConfig = {
            id: TAB_BROWSE,
            panel: FinderPanelComponent
        };
        const searchPanelConfig = {
            id: TAB_SEARCH,
            panel: SearchPanelComponent
        };

        return (
            <div className="m-ud__panels">
                {this.renderSinglePanel(browsePanelConfig)}
                {this.renderSinglePanel(searchPanelConfig)}
                {this.props.extraTabs && this.props.extraTabs.map(this.renderSinglePanel.bind(this))}
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
            labels
        } = this.props;
        const {activeTab, maxHeight, contentTypesMap} = this.state;
        const attrs = Object.assign({}, {
            isVisible: activeTab === item.id,
            onItemSelect: this.onItemSelect.bind(this),
            maxHeight: maxHeight - 32,
            id: item.id,
            startingLocationId,
            findLocationsByParentLocationId,
            findContentBySearchQuery,
            contentTypesMap,
            multiple,
            searchResultsPerPage,
            labels
        }, item.attrs);

        return <Panel key={`panel-${item.id}`} {...attrs} />;
    }

    renderConfirmBtn() {
        const attrs = {
            className: 'm-ud__action--confirm',
            onClick: this.handleConfirm.bind(this)
        };

        if (!this.state.selectedContent.length) {
            attrs.disabled = true;
        }

        return <button {...attrs}>{this.props.labels.udw.confirm}</button>
    }

    render() {
        const componentClassName = 'm-ud';
        const metaPreviewClassName = (!!this.state.contentMeta) ? `${componentClassName}--with-preview` : '';
        const selectedContentClassName = this.state.selectedContent.length ? `${componentClassName}--with-selected-content` : '';
        const containerClassName = `${componentClassName} ${selectedContentClassName} ${metaPreviewClassName}`;

        return (
            <div className="m-ud__wrapper">
                <div className={containerClassName}>
                    <h1 className="m-ud__title">{this.props.title}</h1>
                    {this.renderTabs()}
                    <div className="m-ud__content" ref={ref => this._refContentContainer = ref}>
                        {this.renderPanels()}
                        {this.renderContentMetaPreview()}
                    </div>
                    <div className="m-ud__actions">
                        {this.renderSelectedContent()}
                        <div className="m-ud__btns">
                            <button className="m-ud__action--cancel" onClick={this.props.onCancel}>{this.props.labels.udw.cancel}</button>
                            {this.renderConfirmBtn()}
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
    title: PropTypes.string,
    multiple: PropTypes.bool,
    activeTab: PropTypes.string,
    loadContentInfo: PropTypes.func,
    loadContentTypes: PropTypes.func,
    canSelectContent: PropTypes.func,
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
            browse: PropTypes.string.isRequired
        }).isRequired,
        selectedContentItem: PropTypes.object.isRequired,
        contentMetaPreview: PropTypes.object.isRequired,
        search: PropTypes.object.isRequired,
        searchPagination: PropTypes.object.isRequired,
        searchResults: PropTypes.object.isRequired,
        searchResultsItem: PropTypes.object.isRequired
    }),
    maxHeight: PropTypes.number,
    searchResultsPerPage: PropTypes.number
};

UniversalDiscoveryModule.defaultProps = {
    title: 'Find content',
    multiple: true,
    activeTab: TAB_BROWSE,
    loadContentInfo,
    loadContentTypes,
    findContentBySearchQuery,
    findLocationsByParentLocationId,
    canSelectContent: () => true,
    startingLocationId: 1,
    maxHeight: 500,
    searchResultsPerPage: 10,
    labels: {
        udw: {
            confirm: 'Confirm',
            cancel: 'Cancel',
            browse: 'Browse',
            search: 'Search'
        },
        selectedContent: {
            confirmedItems: 'Confirmed items'
        },
        selectedContentItem: {
            notAvailable: 'N/A'
        },
        contentMetaPreview: {
            title: 'Content Meta Preview',
            selectContent: 'Select content',
            notAvailable: 'N/A'
        },
        search: {
            title: 'Search'
        },
        searchPagination: {
            first: 'First',
            prev: 'Previous',
            next: 'Next',
            last: 'Last'
        },
        searchResults: {
            headerName: 'Name',
            headerType: 'Type',
            resultsTitle: 'Search results'
        },
        searchResultsItem: {
            notAvailable: 'N/A'
        }
    }
};
