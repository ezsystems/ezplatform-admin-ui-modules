import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './css/tab.content.panel.component.css';

export default class TabContentPanelComponent extends Component {
    render() {
        const attrs = {
            id: this.props.id,
            className: 'tab-content-panel-component'
        };

        if (!this.props.isVisible) {
            attrs.hidden = true;
        }

        return (
            <div {...attrs}>
                {this.props.children}
            </div>
        );
    }
}

TabContentPanelComponent.propTypes = {
    id: PropTypes.string.isRequired,
    isVisible: PropTypes.bool.isRequired,
    children: PropTypes.any
};
