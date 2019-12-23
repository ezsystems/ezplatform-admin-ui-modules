import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import TopMenu from '../top-menu/top.menu';
import TabSelector from '../tab-selector/tab.selector';
import SelectedLocations from '../selected-locations/selected.locations';
import ContentCreateWidget from '../content-create-widget/content.create.widget';

import { SelectedLocationsContext, CreateContentWidgetContext } from '../../universal.discovery.module';

const Tab = ({ children, isContentOnTheFlyDisabled, isSortSwitcherDisabled, isViewSwitcherDisabled }) => {
    const ContentMetaPreview = window.eZ.adminUiConfig.universalDiscoveryWidget.contentMetaPreview;
    const [selectedLocations, dispatchSelectedLocationsAction] = useContext(SelectedLocationsContext);
    const [createContentVisible, setCreateContentVisible] = useContext(CreateContentWidgetContext);
    const selectedLocationsComponent = !!selectedLocations.length ? <SelectedLocations /> : null;
    const renderCreateWidget = () => {
        if (!createContentVisible) {
            return null;
        }

        return <ContentCreateWidget />;
    };

    return (
        <div className="c-udw-tab">
            <div className="c-udw-tab__top-bar">
                <TopMenu
                    isContentOnTheFlyDisabled={isContentOnTheFlyDisabled}
                    isSortSwitcherDisabled={isSortSwitcherDisabled}
                    isViewSwitcherDisabled={isViewSwitcherDisabled}
                />
            </div>
            <div className="c-udw-tab__left-sidebar">
                {renderCreateWidget()}
                <TabSelector />
            </div>
            <div className="c-udw-tab__main">{children}</div>
            <div className="c-udw-tab__right-sidebar">
                {ContentMetaPreview && <ContentMetaPreview />}
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
