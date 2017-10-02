import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TabContentPanelComponent from './tab.content.panel.component.js';

import './css/search.panel.component.css';

export default class CreatePanelComponent extends Component {
    render() {
        const attrs = {className: 'create-panel-component'};

        if (!this.props.isVisible) {
            attrs.hidden = true;
        }

        return (
            <div {...attrs}>
                <TabContentPanelComponent {...this.props}>
                    Create panel content
                </TabContentPanelComponent>
            </div>
        );
    }
}

CreatePanelComponent.propTypes = {
    isVisible: PropTypes.bool.isRequired,
};
