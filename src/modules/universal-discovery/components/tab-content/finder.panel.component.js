import React from 'react';
import PropTypes from 'prop-types';

import TabContentPanelComponent from './tab.content.panel.component';
import FinderComponent from '../finder/finder.component';

import './css/finder.panel.component.css';

const FinderPanelComponent = (props) => {
    const wrapperAttrs = {className: 'c-finder-panel'};
    const {multiple, startingLocationId, findLocationsByParentLocationId, onItemSelect, maxHeight} = props;
    const finderAttrs = Object.assign({}, {multiple, startingLocationId, findLocationsByParentLocationId, onItemSelect, maxHeight});

    if (!props.isVisible) {
        wrapperAttrs.hidden = true;
    }

    return (
        <div {...wrapperAttrs}>
            <TabContentPanelComponent {...props}>
                <FinderComponent {...finderAttrs}/>
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
    maxHeight: PropTypes.number.isRequired
};

export default FinderPanelComponent;
