import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TabContentPanelComponent from './tab.content.panel.component.js';
import FinderComponent from '../finder/finder.component.js';

import './css/finder.panel.component.css';

export default class FinderPanelComponent extends Component {
    render() {
        const attrs = {className: 'finder-panel-component'};
        const {canSelectContent, multiple, startingLocationId, minDiscoverDepth, shouldLoadContent, onItemSelect} = this.props;
        const finderAttrs = Object.assign({}, {canSelectContent, multiple, startingLocationId, minDiscoverDepth, shouldLoadContent, onItemSelect});

        if (!this.props.isVisible) {
            attrs.hidden = true;
        }

        return (
            <div {...attrs}>
                <TabContentPanelComponent {...this.props}>
                    <FinderComponent {...finderAttrs}/>
                </TabContentPanelComponent>
            </div>
        );
    }
}

FinderPanelComponent.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    canSelectContent: PropTypes.func,
    multiple: PropTypes.bool,
    startingLocationId: PropTypes.string,
    minDiscoverDepth: PropTypes.number,
    shouldLoadContent: PropTypes.bool,
    onItemSelect: PropTypes.func.isRequired
};
