import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import TopMenu from '../top-menu/top.menu';
import TabSelector from '../tab-selector/tab.selector';
import ContentMetaPreview from '../content-meta-preview/content.meta.preview';
import SelectedLocations from '../selected-locations/selected.locations';

import { SelectedLocationsContext } from '../../universal.discovery.module';

const Tab = ({ children, isContentOnTheFlyDisabled, isSortSwitcherDisabled, isViewSwitcherDisabled }) => {
    const [selectedLocations, dispatchSelectedLocationsAction] = useContext(SelectedLocationsContext);
    const selectedLocationsComponent = !!selectedLocations.length ? <SelectedLocations /> : null;

    return (
        <div className="c-tab">
            <div className="c-tab__top-bar">
                <TopMenu
                    isContentOnTheFlyDisabled={isContentOnTheFlyDisabled}
                    isSortSwitcherDisabled={isSortSwitcherDisabled}
                    isViewSwitcherDisabled={isViewSwitcherDisabled}
                />
            </div>
            <div className="c-tab__left-sidebar">
                <TabSelector />
            </div>
            <div className="c-tab__main">{children}</div>
            <div className="c-tab__right-sidebar">
                <ContentMetaPreview />
                {selectedLocationsComponent}
            </div>
        </div>
    );
};

Tab.propTypes = {
    children: PropTypes.any.isRequired,
    isContentOnTheFlyDisabled: PropTypes.bool,
    isSortSwitcherDisabled: PropTypes.bool,
    isViewSwitcherDisabled: PropTypes.bool,
};

Tab.defaultProps = {
    isContentOnTheFlyDisabled: false,
    isSortSwitcherDisabled: false,
    isViewSwitcherDisabled: false,
};

export default Tab;
