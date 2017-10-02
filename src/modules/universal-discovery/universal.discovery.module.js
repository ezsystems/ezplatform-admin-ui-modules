import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TabNavItemComponent from './components/tab-nav/tab.nav.item.component.js';
import FinderPanelComponent from './components/tab-content/finder.panel.component.js';
import SearchPanelComponent from './components/tab-content/search.panel.component.js';
import SelectedContentComponent from './components/selected-content/selected.content.component.js';
import ContentMetaPreviewComponent from './components/content-meta-preview/content.meta.preview.component.js';

import './universal.discovery.module.css';

export default class UniversalDiscoveryModule extends Component {
    constructor(props) {
        super();

        this.state = {
            activeTab: props.activeTab || 'search',
            contentMeta: null,
            selectedContent: []
        };
    }

    handleConfirm() {
        this.props.contentDiscoverHandler(this.state.selectedContent);
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

    renderContentMetaPreview() {
        if (!this.state.contentMeta) {
            return;
        }

        return (
            <div className="universal-discovery-module__preview">
                <ContentMetaPreviewComponent 
                    data={this.state.contentMeta} 
                    canSelectContent={this.props.canSelectContent}
                    onSelectContent={this.updateSelectedContent.bind(this)} />
            </div>
        );
    }

    renderSelectedContent() {
        const items = this.state.selectedContent;

        if (!items.length) {
            return;
        }

        return (
            <div className="universal-discovery-module__selected-content">
                <SelectedContentComponent 
                    items={items} 
                    onItemRemove={this.onItemRemove.bind(this)}/>
            </div>
        );
    }

    togglePanel(identifier) {
        this.setState(state => Object.assign({}, state, {activeTab: identifier}));
    }

    renderTabs() {
        const isBrowseVisible = this.state.activeTab === 'browse';
        const isSearchVisible = this.state.activeTab === 'search';

        return (
            <nav className="universal-discovery-module__nav">
                <TabNavItemComponent onClick={this.togglePanel.bind(this)} id="browse" title="Browse" isSelected={isBrowseVisible} />
                <TabNavItemComponent onClick={this.togglePanel.bind(this)} id="search" title="Search" isSelected={isSearchVisible} />
                {this.props.extraTabs && this.props.extraTabs.map(this.renderSingleTab.bind(this))}
            </nav>
        );
    }

    renderSingleTab(tab) {
        const attrs = {
            id: tab.id,
            title: tab.label,
            onClick: this.togglePanel.bind(this),
            isSelected: this.state.activeTab === tab.id
        };

        return <TabNavItemComponent key={`panel-${tab.id}`} {...attrs}/>;
    }

    renderPanels() {
        const browsePanelConfig = {
            id: 'browse',
            panel: FinderPanelComponent
        };
        const searchPanelConfig = {
            id: 'search',
            panel: SearchPanelComponent
        };

        return (
            <div className="universal-discovery-module__panels">
                {this.renderSinglePanel(browsePanelConfig)}
                {this.renderSinglePanel(searchPanelConfig)}
                {this.props.extraTabs && this.props.extraTabs.map(this.renderSinglePanel.bind(this))}
            </div>
        );
    }

    renderSinglePanel(item) {
        const {canSelectContent, multiple, startingLocationId, minDiscoverDepth, shouldLoadContent} = this.props;
        const attrs = Object.assign({}, {
            id: item.id,
            isVisible: this.state.activeTab === item.id,
            onItemSelect: this.onItemSelect.bind(this),
            multiple, 
            canSelectContent, 
            minDiscoverDepth, 
            shouldLoadContent,
            startingLocationId
        }, item.attrs);
        const Element = item.panel;

        return <Element key={`panel-${item.id}`} {...attrs} />;
    }

    render() {
        const componentClassName = 'universal-discovery-module';
        const metaPreviewClassName = (!!this.state.contentMeta) ? `${componentClassName}--with-preview` : '';
        const selectedContentClassName = this.state.selectedContent.length ? `${componentClassName}--with-selected-content` : '';
        const containerClassName = `${componentClassName} ${selectedContentClassName} ${metaPreviewClassName}`;

        return (
            <div className={containerClassName}>
                <h1 className="universal-discovery-module__title">{this.props.title}</h1>
                {this.renderTabs()}
                <div className="universal-discovery-module__content">
                    {this.renderPanels()}
                    {this.renderContentMetaPreview()}
                </div>
                <div className="universal-discovery-module__actions">
                    {this.renderSelectedContent()}
                    <div className="universal-discovery-module__btns">
                        <button className="universal-discovery-module__action--cancel" onClick={this.props.cancelDiscoverHandler}>Cancel</button>
                        <button className="universal-discovery-module__action--confirm" onClick={this.handleConfirm.bind(this)}>{this.props.confirmLabel || 'Confirm'}</button>
                    </div>
                </div>
            </div>
        );
    }
}

UniversalDiscoveryModule.propTypes = {
    activeTab: PropTypes.string,
    title: PropTypes.string.isRequired,
    contentDiscoverHandler: PropTypes.func.isRequired,
    cancelDiscoverHandler: PropTypes.func,
    canSelectContent: PropTypes.func,
    confirmLabel: PropTypes.string,
    multiple: PropTypes.bool,
    startingLocationId: PropTypes.string,
    minDiscoverDepth: PropTypes.number,
    shouldLoadContent: PropTypes.bool,
    extraTabs: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        panel: PropTypes.func.isRequired,
        attrs: PropTypes.object
    }))
};
