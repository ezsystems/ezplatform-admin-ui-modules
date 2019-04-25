import React from 'react';
import PropTypes from 'prop-types';

import TabContentPanelComponent from '../../../../common/tab-content-panel/tab.content.panel.component';
import FinderComponent from '../finder/finder.component';

const BrowsePanelComponent = (props) => {
    const wrapperAttrs = { className: 'c-finder-panel' };

    return (
        <div {...wrapperAttrs}>
            <TabContentPanelComponent {...props}>
                <FinderComponent {...props} />
            </TabContentPanelComponent>
        </div>
    );
};

BrowsePanelComponent.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    multiple: PropTypes.bool.isRequired,
    startingLocationId: PropTypes.number.isRequired,
    findLocationsByParentLocationId: PropTypes.func.isRequired,
    onItemSelect: PropTypes.func.isRequired,
    maxHeight: PropTypes.number.isRequired,
    restInfo: PropTypes.shape({
        token: PropTypes.string.isRequired,
        siteaccess: PropTypes.string.isRequired,
    }).isRequired,
    allowContainersOnly: PropTypes.bool.isRequired,
    sortFieldMappings: PropTypes.object.isRequired,
    sortOrderMappings: PropTypes.object.isRequired,
    selectedContent: PropTypes.array.isRequired,
    onSelectContent: PropTypes.func.isRequired,
    canSelectContent: PropTypes.func.isRequired,
    onItemRemove: PropTypes.func.isRequired,
};

export default BrowsePanelComponent;
