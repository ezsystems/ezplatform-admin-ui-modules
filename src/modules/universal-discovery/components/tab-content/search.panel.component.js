import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TabContentPanelComponent from './tab.content.panel.component.js';
import SearchComponent from '../search/search.component.js';

import './css/search.panel.component.css';

export default class SearchPanelComponent extends Component {
    render() {
        const attrs = {className: 'search-panel-component'};
        const {canSelectContent, multiple, startingLocationId, minDiscoverDepth, shouldLoadContent, onItemSelect} = this.props;
        const searchAttrs = Object.assign({}, {canSelectContent, multiple, startingLocationId, minDiscoverDepth, shouldLoadContent, onItemSelect});

        if (!this.props.isVisible) {
            attrs.hidden = true;
        }

        return (
            <div {...attrs}>
                <TabContentPanelComponent {...this.props}>
                    <SearchComponent {...searchAttrs} />
                </TabContentPanelComponent>
            </div>
        );
    }
}

SearchPanelComponent.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    canSelectContent: PropTypes.func,
    multiple: PropTypes.bool,
    startingLocationId: PropTypes.string,
    minDiscoverDepth: PropTypes.number,
    shouldLoadContent: PropTypes.bool,
    onItemSelect: PropTypes.func.isRequired
};
