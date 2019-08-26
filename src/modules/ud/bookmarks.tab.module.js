import React, { useContext, useRef, useEffect } from 'react';

import Tab from './components/tab/tab';
import BookmarksList from './components/bookmarks-list/bookmarks.list';
import GridView from './components/grid-view/grid.view';
import Finder from './components/finder/finder';
import ContentTree from './components/content-tree/content.tree';

import { CurrentViewContext, MarkedLocationContext } from './universal.discovery.module';

const views = {
    grid: <GridView />,
    finder: <Finder />,
    'content-tree': <ContentTree />,
};

const BookmarksTabModule = () => {
    const [currentView, setCurrentView] = useContext(CurrentViewContext);
    const [markedLocation, setMarkedLocation] = useContext(MarkedLocationContext);
    const isFirstRun = useRef(true);
    const renderBrowseLocations = () => {
        if (!markedLocation) {
            return null;
        }

        return views[currentView];
    };

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;

            setMarkedLocation(null);
        }
    });

    return (
        <div className="m-bookmarks-tab">
            <Tab>
                <BookmarksList />
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
            label: 'Bookmarks',
            icon: '/bundles/ezplatformadminui/img/ez-icons.svg#bookmark',
        },
    ],
    true
);

export default BookmarksTabModule;
