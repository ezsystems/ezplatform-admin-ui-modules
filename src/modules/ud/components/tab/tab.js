import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import TopMenu from '../top-menu/top.menu';
import TabSelector from '../tab-selector/tab.selector';
import ContentMetaPreview from '../content-meta-preview/content.meta.preview';
import SelectedLocations from '../selected-locations/selected.locations';

import { SelectedLocationsContext } from '../../universal.discovery.module';

const Tab = (props) => {
    const [selectedLocations, dispatchSelectedLocationsAction] = useContext(SelectedLocationsContext);
    const selectedLocationsComponent = !!selectedLocations.length ? <SelectedLocations /> : null;

    return (
        <div className="c-tab">
            <div className="c-tab__top-bar">
                <TopMenu />
            </div>
            <div className="c-tab__left-sidebar">
                {selectedLocationsComponent}
                <TabSelector />
            </div>
            <div className="c-tab__main">{props.children}</div>
            <div className="c-tab__right-sidebar">
                <ContentMetaPreview />
            </div>
        </div>
    );
};

Tab.propTypes = {
    children: PropTypes.any.isRequired,
};

Tab.defaultProps = {};

export default Tab;
