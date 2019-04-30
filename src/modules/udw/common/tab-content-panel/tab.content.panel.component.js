import React from 'react';
import PropTypes from 'prop-types';

const TabContentPanelComponent = ({ id, isVisible, children }) => {
    const attrs = {
        id,
        className: 'c-tab-content-panel',
    };

    if (!isVisible) {
        attrs.hidden = true;
    }

    return <div {...attrs}>{children}</div>;
};

TabContentPanelComponent.propTypes = {
    id: PropTypes.string.isRequired,
    isVisible: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
};

export default TabContentPanelComponent;
