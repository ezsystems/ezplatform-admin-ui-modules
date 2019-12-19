import React, { useEffect, useState, createContext } from 'react';
import PropTypes from 'prop-types';

import deepClone from '../common/helpers/deep.clone.helper';
import { createCssClassNames } from '../common/helpers/css.class.names';
import { useLoadedLocationsReducer } from './hooks/useLoadedLocationsReducer';
import { useSelectedLocationsReducer } from './hooks/useSelectedLocationsReducer';
import { loadAccordionData, loadContentTypes, findLocationsById } from './services/universal.discovery.service';

const CLASS_SCROLL_DISABLED = 'ez-scroll-disabled';

export const SORTING_OPTIONS = [
    {
        label: Translator.trans(/*@Desc("Date")*/ 'sorting.date.label', {}, 'universal_discovery_widget'),
        sortClause: 'DatePublished',
    },
    {
        label: Translator.trans(/*@Desc("Name")*/ 'sorting.name.label', {}, 'universal_discovery_widget'),
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
export const AllowContentEditContext = createContext();
export const ContentTypesMapContext = createContext();
export const ContentTypesInfoMapContext = createContext();
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
    const tabs = window.eZ.adminUiConfig.universalDiscoveryWidget.tabs;
    const [activeTab, setActiveTab] = useState(props.activeTab);
    const [sorting, setSorting] = useState(props.activeSortClause);
    const [sortOrder, setSortOrder] = useState(props.activeSortOrder);
    const [currentView, setCurrentView] = useState(props.activeView);
    const [markedLocation, setMarkedLocation] = useState(props.startingLocationId || props.rootLocationId);
    const [createContentVisible, setCreateContentVisible] = useState(false);
    const [contentOnTheFlyData, setContentOnTheFlyData] = useState({});
    const [contentTypesInfoMap, setContentTypesInfoMap] = useState({});
    const [loadedLocationsMap, dispatchLoadedLocationsAction] = useLoadedLocationsReducer([
        { parentLocationId: props.rootLocationId, subitems: [] },
    ]);
    const [selectedLocations, dispatchSelectedLocationsAction] = useSelectedLocationsReducer();
    const activeTabConfig = tabs.find((tab) => tab.id === activeTab);
    const Tab = activeTabConfig.component;
    const className = createCssClassNames({
        'm-ud': true,
        'm-ud--locations-selected': !!selectedLocations.length,
    });
    const onConfirm = (locations = selectedLocations) => {
        const updatedLocations = locations.map((location) => {
            const clonedLocation = deepClone(location);
            const contentType = clonedLocation.ContentInfo.Content.ContentType;

            clonedLocation.ContentInfo.Content.ContentTypeInfo = contentTypesInfoMap[contentType._href];

            return clonedLocation;
        });

        props.onConfirm(updatedLocations);
    };

    useEffect(() => {
        const handleLoadContentTypes = (response) => {
            const contentTypesMap = response.ContentTypeInfoList.ContentType.reduce((contentTypesList, item) => {
                contentTypesList[item._href] = item;

                return contentTypesList;
            }, {});

            setContentTypesInfoMap(contentTypesMap);
        };

        loadContentTypes(restInfo, handleLoadContentTypes);
    }, []);

    useEffect(() => {
        if (!props.selectedLocations.length) {
            return;
        }

        findLocationsById(
            {
                ...restInfo,
                id: props.selectedLocations.join(','),
            },
            (locations) => dispatchSelectedLocationsAction({ type: 'REPLACE_SELECTED_LOCATIONS', locations })
        );
    }, [props.selectedLocations]);

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
        if (!props.startingLocationId || props.startingLocationId === 1) {
            return;
        }

        loadAccordionData(
            {
                ...restInfo,
                parentLocationId: props.startingLocationId,
                sortClause: sorting,
                sortOrder: sortOrder,
                gridView: currentView === 'grid',
            },
            (locationsMap) => {
                dispatchLoadedLocationsAction({ type: 'SET_LOCATIONS', data: locationsMap });
                setMarkedLocation(props.startingLocationId);
            }
        );
    }, [props.startingLocationId]);

    useEffect(() => {
        const locationsMap = loadedLocationsMap.map((loadedLocation) => {
            loadedLocation.subitems = [];

            return loadedLocation;
        });

        dispatchLoadedLocationsAction({ type: 'SET_LOCATIONS', data: locationsMap });
    }, [sorting]);

    return (
        <div className={className}>
            <RestInfoContext.Provider value={restInfo}>
                <AllowContentEditContext.Provider value={props.allowContentEdit}>
                    <ContentTypesInfoMapContext.Provider value={contentTypesInfoMap}>
                        <ContentTypesMapContext.Provider value={contentTypesMap}>
                            <MultipleConfigContext.Provider value={[props.multiple, props.multipleItemsLimit]}>
                                <ContainersOnlyContext.Provider value={props.containersOnly}>
                                    <AllowedContentTypesContext.Provider value={props.allowedContentTypes}>
                                        <ActiveTabContext.Provider value={[activeTab, setActiveTab]}>
                                            <TabsContext.Provider value={tabs}>
                                                <TabsConfigContext.Provider value={props.tabsConfig}>
                                                    <TitleContext.Provider value={props.title}>
                                                        <CancelContext.Provider value={props.onCancel}>
                                                            <ConfirmContext.Provider value={onConfirm}>
                                                                <SortingContext.Provider value={[sorting, setSorting]}>
                                                                    <SortOrderContext.Provider value={[sortOrder, setSortOrder]}>
                                                                        <CurrentViewContext.Provider value={[currentView, setCurrentView]}>
                                                                            <MarkedLocationContext.Provider
                                                                                value={[markedLocation, setMarkedLocation]}>
                                                                                <LoadedLocationsMapContext.Provider
                                                                                    value={[
                                                                                        loadedLocationsMap,
                                                                                        dispatchLoadedLocationsAction,
                                                                                    ]}>
                                                                                    <RootLocationIdContext.Provider
                                                                                        value={props.rootLocationId}>
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
                    </ContentTypesInfoMapContext.Provider>
                </AllowContentEditContext.Provider>
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
        autoConfirmAfterPublish: PropTypes.bool.isRequired,
    }).isRequired,
    tabsConfig: PropTypes.objectOf(
        PropTypes.shape({
            itemsPerPage: PropTypes.number.isRequired,
            priority: PropTypes.number.isRequired,
            hidden: PropTypes.bool.isRequired,
        })
    ).isRequired,
    selectedLocations: PropTypes.array,
    allowContentEdit: PropTypes.bool.isRequired,
};

UniversalDiscoveryModule.defaultProps = {
    activeTab: 'browse',
    rootLocationId: 1,
    startingLocationId: null,
    multiple: false,
    multipleItemsLimit: 1,
    containersOnly: false,
    activeSortClause: 'date',
    activeSortOrder: 'ascending',
    activeView: 'finder',
    tabs: window.eZ.adminUiConfig.universalDiscoveryWidget.tabs,
    selectedLocations: [],
};

eZ.addConfig('modules.UniversalDiscovery', UniversalDiscoveryModule);

export default UniversalDiscoveryModule;
