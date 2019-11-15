import React, { useEffect, useState, createContext } from 'react';
import PropTypes from 'prop-types';

import { createCssClassNames } from '../common/helpers/css.class.names';
import { useLoadedLocationsReducer } from './hooks/useLoadedLocationsReducer';
import { useSelectedLocationsReducer } from './hooks/useSelectedLocationsReducer';
import { loadAccordionData } from './services/universal.discovery.service';

const CLASS_SCROLL_DISABLED = 'ez-scroll-disabled';

export const SORTING_OPTIONS = [
    {
        id: 'date',
        label: 'Date',
        sortClause: 'DatePublished',
    },
    {
        id: 'name',
        label: 'Name',
        sortClause: 'ContentName',
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
export const MultipleConfigContext = createContext();
export const ContainersOnlyContext = createContext();
export const AllowedContentTypesContext = createContext();
export const ActiveTabContext = createContext();
export const TabsConfigContext = createContext();
export const TabsContext = createContext();
export const TitleContext = createContext();
export const CancelContext = createContext();
export const ConfirmContext = createContext();
export const SortingContext = createContext();
export const SortOrderContext = createContext();
export const CurrentViewContext = createContext();
export const MarkedLocationContext = createContext();
export const LoadedLocationsMapContext = createContext();
export const RootLocationIdContext = createContext();
export const SelectedLocationsContext = createContext();
export const CreateContentWidgetContext = createContext();
export const ContentOnTheFlyDataContext = createContext();
export const ContentOnTheFlyConfigContext = createContext();

const UniversalDiscoveryModule = (props) => {
    const [activeTab, setActiveTab] = useState(props.activeTab);
    const [sorting, setSorting] = useState(props.activeSortClause);
    const [sortOrder, setSortOrder] = useState(props.activeSortOrder);
    const [currentView, setCurrentView] = useState(props.activeView);
    const [markedLocation, setMarkedLocation] = useState(props.startingLocationId || props.rootLocationId);
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

    useEffect(() => {
        if (!props.startingLocationId) {
            return;
        }

        loadAccordionData({ ...restInfo, parentLocationId: props.startingLocationId, gridView: currentView === 'grid' }, (locationsMap) => {
            dispatchLoadedLocationsAction({ type: 'SET_LOCATIONS', data: locationsMap });
            setMarkedLocation(props.startingLocationId);
        });
    }, [props.startingLocationId]);

    return (
        <div className={className}>
            <RestInfoContext.Provider value={restInfo}>
                <ContentTypesMapContext.Provider value={contentTypesMap}>
                    <MultipleConfigContext.Provider value={[props.multiple, props.multipleItemsLimit]}>
                        <ContainersOnlyContext.Provider value={props.containersOnly}>
                            <AllowedContentTypesContext.Provider value={props.allowedContentTypes}>
                                <ActiveTabContext.Provider value={[activeTab, setActiveTab]}>
                                    <TabsContext.Provider value={props.tabs}>
                                        <TabsConfigContext.Provider value={props.tabsConfig}>
                                            <TitleContext.Provider value={props.title}>
                                                <CancelContext.Provider value={props.onCancel}>
                                                    <ConfirmContext.Provider value={props.onConfirm}>
                                                        <SortingContext.Provider value={[sorting, setSorting]}>
                                                            <SortOrderContext.Provider value={[sortOrder, setSortOrder]}>
                                                                <CurrentViewContext.Provider value={[currentView, setCurrentView]}>
                                                                    <MarkedLocationContext.Provider
                                                                        value={[markedLocation, setMarkedLocation]}>
                                                                        <LoadedLocationsMapContext.Provider
                                                                            value={[loadedLocationsMap, dispatchLoadedLocationsAction]}>
                                                                            <RootLocationIdContext.Provider value={props.rootLocationId}>
                                                                                <SelectedLocationsContext.Provider
                                                                                    value={[
                                                                                        selectedLocations,
                                                                                        dispatchSelectedLocationsAction,
                                                                                    ]}>
                                                                                    <CreateContentWidgetContext.Provider
                                                                                        value={[
                                                                                            createContentVisible,
                                                                                            setCreateContentVisible,
                                                                                        ]}>
                                                                                        <ContentOnTheFlyDataContext.Provider
                                                                                            value={[
                                                                                                contentOnTheFlyData,
                                                                                                setContentOnTheFlyData,
                                                                                            ]}>
                                                                                            <ContentOnTheFlyConfigContext.Provider
                                                                                                value={props.contentOnTheFly}>
                                                                                                <Tab />
                                                                                            </ContentOnTheFlyConfigContext.Provider>
                                                                                        </ContentOnTheFlyDataContext.Provider>
                                                                                    </CreateContentWidgetContext.Provider>
                                                                                </SelectedLocationsContext.Provider>
                                                                            </RootLocationIdContext.Provider>
                                                                        </LoadedLocationsMapContext.Provider>
                                                                    </MarkedLocationContext.Provider>
                                                                </CurrentViewContext.Provider>
                                                            </SortOrderContext.Provider>
                                                        </SortingContext.Provider>
                                                    </ConfirmContext.Provider>
                                                </CancelContext.Provider>
                                            </TitleContext.Provider>
                                        </TabsConfigContext.Provider>
                                    </TabsContext.Provider>
                                </ActiveTabContext.Provider>
                            </AllowedContentTypesContext.Provider>
                        </ContainersOnlyContext.Provider>
                    </MultipleConfigContext.Provider>
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
    startingLocationId: PropTypes.number,
    multiple: PropTypes.bool,
    multipleItemsLimit: PropTypes.number,
    containersOnly: PropTypes.bool,
    allowedContentTypes: PropTypes.array.isRequired,
    activeSortClause: PropTypes.string,
    activeSortOrder: PropTypes.string,
    activeView: PropTypes.string,
    contentOnTheFly: PropTypes.shape({
        allowedLanguages: PropTypes.array.isRequired,
        allowedLocations: PropTypes.array.isRequired,
        preselectedLocation: PropTypes.string.isRequired,
        preselectedContentType: PropTypes.string.isRequired,
        hidden: PropTypes.bool.isRequired,
    }).isRequired,
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            component: PropTypes.func.isRequired,
            label: PropTypes.string.isRequired,
            icon: PropTypes.string.isRequired,
        })
    ).isRequired,
    tabsConfig: PropTypes.objectOf(
        PropTypes.shape({
            itemsPerPage: PropTypes.number.isRequired,
            priority: PropTypes.number.isRequired,
            hidden: PropTypes.bool.isRequired,
        })
    ).isRequired,
};

UniversalDiscoveryModule.defaultProps = {
    activeTab: 'browse',
    rootLocationId: 2,
    startingLocationId: null,
    multiple: false,
    multipleItemsLimit: 1,
    containersOnly: false,
    activeSortClause: 'date',
    activeSortOrder: 'ascending',
    activeView: 'finder',
};

eZ.addConfig('modules.UDW', UniversalDiscoveryModule);

export default UniversalDiscoveryModule;
