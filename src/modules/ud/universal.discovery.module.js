import React, { useEffect, useState, createContext } from 'react';
import PropTypes from 'prop-types';

import { createCssClassNames } from '../common/helpers/css.class.names';
import { useLoadedLocationsReducer } from './hooks/useLoadedLocationsReducer';
import { useSelectedLocationsReducer } from './hooks/useSelectedLocationsReducer';

const CLASS_SCROLL_DISABLED = 'ez-scroll-disabled';

export const SORTING_OPTIONS = [
    {
        id: 'date',
        label: 'Date',
        sortClause: 'DatePublished',
        sortOrder: 'ascending',
    },
    {
        id: 'name',
        label: 'Name',
        sortClause: 'ContentName',
        sortOrder: 'ascending',
    },
];
export const VIEWS = [{ id: 'grid', icon: 'view-grid' }, { id: 'finder', icon: 'panels' }];

const restInfo = {
    token: document.querySelector('meta[name="CSRF-Token"]').content,
    siteaccess: document.querySelector('meta[name="SiteAccess"]').content,
};
const contentTypesMap = Object.values(eZ.adminUiConfig.contentTypes).reduce((contentTypesMap, contentTypesGroup) => {
    contentTypesGroup.forEach((contentType) => {
        contentTypesMap[contentType.href] = contentType;
    });

    return contentTypesMap;
}, {});

export const RestInfoContext = createContext();
export const ContentTypesMapContext = createContext();
export const ActiveTabContext = createContext();
export const TabsConfigContext = createContext();
export const TitleContext = createContext();
export const CancelContext = createContext();
export const ConfirmContext = createContext();
export const SortingContext = createContext();
export const CurrentViewContext = createContext();
export const MarkedLocationContext = createContext();
export const LoadedLocationsMapContext = createContext();
export const RootLocationIdContext = createContext();
export const SelectedLocationsContext = createContext();
export const CreateContentWidgetContext = createContext();
export const ContentOnTheFlyDataContext = createContext();

const UniversalDiscoveryModule = (props) => {
    const [activeTab, setActiveTab] = useState(props.activeTab);
    const [sorting, setSorting] = useState(SORTING_OPTIONS[0].id);
    const [currentView, setCurrentView] = useState('finder');
    const [markedLocation, setMarkedLocation] = useState(props.rootLocationId);
    const [createContentVisible, setCreateContentVisible] = useState(false);
    const [contentOnTheFlyData, setContentOnTheFlyData] = useState({});
    const [loadedLocationsMap, dispatchLoadedLocationsAction] = useLoadedLocationsReducer([
        { parentLocationId: props.rootLocationId, subitems: [] },
    ]);
    const [selectedLocations, dispatchSelectedLocationsAction] = useSelectedLocationsReducer();
    const activeTabConfig = props.tabs.find((tab) => tab.id === activeTab);
    const Tab = activeTabConfig.component;
    const className = createCssClassNames({
        'm-ud': true,
        'm-ud--locations-selected': !!selectedLocations.length,
    });

    useEffect(() => {
        window.document.body.classList.add(CLASS_SCROLL_DISABLED);

        return () => {
            window.document.body.classList.remove(CLASS_SCROLL_DISABLED);
        };
    });

    useEffect(() => {
        if (currentView === 'grid') {
            loadedLocationsMap[loadedLocationsMap.length - 1].subitems = [];

            dispatchLoadedLocationsAction({ type: 'SET_LOCATIONS', data: loadedLocationsMap });
        }
    }, [currentView]);

    return (
        <div className={className}>
            <RestInfoContext.Provider value={restInfo}>
                <ContentTypesMapContext.Provider value={contentTypesMap}>
                    <ActiveTabContext.Provider value={[activeTab, setActiveTab]}>
                        <TabsConfigContext.Provider value={props.tabs}>
                            <TitleContext.Provider value={props.title}>
                                <CancelContext.Provider value={props.onCancel}>
                                    <ConfirmContext.Provider value={props.onConfirm}>
                                        <SortingContext.Provider value={[sorting, setSorting]}>
                                            <CurrentViewContext.Provider value={[currentView, setCurrentView]}>
                                                <MarkedLocationContext.Provider value={[markedLocation, setMarkedLocation]}>
                                                    <LoadedLocationsMapContext.Provider
                                                        value={[loadedLocationsMap, dispatchLoadedLocationsAction]}>
                                                        <RootLocationIdContext.Provider value={props.rootLocationId}>
                                                            <SelectedLocationsContext.Provider
                                                                value={[selectedLocations, dispatchSelectedLocationsAction]}>
                                                                <CreateContentWidgetContext.Provider
                                                                    value={[createContentVisible, setCreateContentVisible]}>
                                                                    <ContentOnTheFlyDataContext.Provider
                                                                        value={[contentOnTheFlyData, setContentOnTheFlyData]}>
                                                                        <Tab />
                                                                    </ContentOnTheFlyDataContext.Provider>
                                                                </CreateContentWidgetContext.Provider>
                                                            </SelectedLocationsContext.Provider>
                                                        </RootLocationIdContext.Provider>
                                                    </LoadedLocationsMapContext.Provider>
                                                </MarkedLocationContext.Provider>
                                            </CurrentViewContext.Provider>
                                        </SortingContext.Provider>
                                    </ConfirmContext.Provider>
                                </CancelContext.Provider>
                            </TitleContext.Provider>
                        </TabsConfigContext.Provider>
                    </ActiveTabContext.Provider>
                </ContentTypesMapContext.Provider>
            </RestInfoContext.Provider>
        </div>
    );
};

UniversalDiscoveryModule.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    activeTab: PropTypes.string,
    rootLocationId: PropTypes.number,
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            component: PropTypes.func.isRequired,
            label: PropTypes.string.isRequired,
            icon: PropTypes.string.isRequired,
        })
    ).isRequired,
};

UniversalDiscoveryModule.defaultProps = {
    activeTab: 'browse',
    rootLocationId: 2,
};

eZ.addConfig('modules.UDW', UniversalDiscoveryModule);

export default UniversalDiscoveryModule;
