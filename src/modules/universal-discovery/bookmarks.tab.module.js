import React, { useContext, useState, useRef, useEffect } from 'react';

import Tab from './components/tab/tab';
import BookmarksList from './components/bookmarks-list/bookmarks.list';
import GridView from './components/grid-view/grid.view';
import Finder from './components/finder/finder';

import {
    CurrentViewContext,
    MarkedLocationContext,
    RestInfoContext,
    LoadedLocationsMapContext,
    SortingContext,
    SortOrderContext,
    RootLocationIdContext,
} from './universal.discovery.module';
import { loadAccordionData } from './services/universal.discovery.service';

const views = {
    grid: <GridView />,
    finder: <Finder />,
};

const BookmarksTabModule = () => {
    const restInfo = useContext(RestInfoContext);
    const [currentView, setCurrentView] = useContext(CurrentViewContext);
    const [markedLocation, setMarkedLocation] = useContext(MarkedLocationContext);
    const [sorting, setSorting] = useContext(SortingContext);
    const [sortOrder, setSortOrder] = useContext(SortOrderContext);
    const rootLocationId = useContext(RootLocationIdContext);
    const [loadedLocationsMap, dispatchLoadedLocationsAction] = useContext(LoadedLocationsMapContext);
    const [bookmarkedLocationMarked, setBookmarkedLocationMarked] = useState(null);
    const renderBrowseLocations = () => {
        if (!markedLocation) {
            return null;
        }

        return views[currentView];
    };

    useEffect(() => {
        if (!bookmarkedLocationMarked) {
            return;
        }

        setMarkedLocation(bookmarkedLocationMarked);
        loadAccordionData(
            {
                ...restInfo,
                parentLocationId: bookmarkedLocationMarked,
                sortClause: sorting,
                sortOrder: sortOrder,
                gridView: currentView === 'grid',
                rootLocationId,
            },
            (locationsMap) => {
                dispatchLoadedLocationsAction({ type: 'SET_LOCATIONS', data: locationsMap });
            }
        );
    }, [bookmarkedLocationMarked, currentView, restInfo, dispatchLoadedLocationsAction, setMarkedLocation]);

    useEffect(() => {
        if (markedLocation !== bookmarkedLocationMarked) {
            dispatchLoadedLocationsAction({ type: 'CUT_LOCATIONS', locationId: markedLocation });
            setBookmarkedLocationMarked(null);
        }
    }, [markedLocation, setBookmarkedLocationMarked, bookmarkedLocationMarked, dispatchLoadedLocationsAction]);

    return (
        <div className="m-bookmarks-tab">
            <Tab>
                <BookmarksList setBookmarkedLocationMarked={setBookmarkedLocationMarked} />
                {renderBrowseLocations()}
            </Tab>
        </div>
    );
};

eZ.addConfig(
    'adminUiConfig.universalDiscoveryWidget.tabs',
    [
        {
            id: 'bookmarks',
            component: BookmarksTabModule,
            label: Translator.trans(/*@Desc("Bookmarks")*/ 'bookmarks.label', {}, 'universal_discovery_widget'),
            icon: '/bundles/ezplatformadminui/img/ez-icons.svg#bookmark',
        },
    ],
    true
);

export default BookmarksTabModule;
