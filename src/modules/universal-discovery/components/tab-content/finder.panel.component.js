import React from 'react';
import PropTypes from 'prop-types';

import TabContentPanelComponent from './tab.content.panel.component';
import FinderComponent from '../finder/finder.component';

import './css/finder.panel.component.css';

const FinderPanelComponent = (props) => {
    const wrapperAttrs = {className: 'c-finder-panel'};

    if (!props.isVisible) {
        wrapperAttrs.hidden = true;
    }

    return (
        <div {...wrapperAttrs}>
            <TabContentPanelComponent {...props}>
                <FinderComponent {...props} />
            </TabContentPanelComponent>
        </div>
    );
};

FinderPanelComponent.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    multiple: PropTypes.bool.isRequired,
    startingLocationId: PropTypes.number.isRequired,
    findLocationsByParentLocationId: PropTypes.func.isRequired,
    onItemSelect: PropTypes.func.isRequired,
    maxHeight: PropTypes.number.isRequired,
    restInfo: PropTypes.shape({
        token: PropTypes.string.isRequired,
        siteaccess: PropTypes.string.isRequired
    }).isRequired,
    labels: PropTypes.object.isRequired,
    allowContainersOnly: PropTypes.bool.isRequired,
    sortFieldMappings: PropTypes.object,
    sortOrderMappings: PropTypes.object,
};

export default FinderPanelComponent;
