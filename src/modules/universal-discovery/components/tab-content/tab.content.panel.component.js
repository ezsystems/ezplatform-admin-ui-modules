import React from 'react';
import PropTypes from 'prop-types';

import './css/tab.content.panel.component.css';

const TabContentPanelComponent = (props) => {
    const attrs = {
        id: props.id,
        className: 'c-tab-content-panel'
    };

    if (!props.isVisible) {
        attrs.hidden = true;
    }

    return (
        <div {...attrs}>
            {props.children}
        </div>
    );
};

TabContentPanelComponent.propTypes = {
    id: PropTypes.string.isRequired,
    isVisible: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired
};

export default TabContentPanelComponent;
