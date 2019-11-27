import React, { useContext } from 'react';

import Tab from './components/tab/tab';
import GridView from './components/grid-view/grid.view';
import Finder from './components/finder/finder';
import ContentTree from './components/content-tree/content.tree';

import { CurrentViewContext } from './universal.discovery.module';

const views = {
    grid: <GridView />,
    finder: <Finder />,
    'content-tree': <ContentTree />,
};

const BrowseTabModule = () => {
    const [currentView, setCurrentView] = useContext(CurrentViewContext);

    return (
        <div className="m-browse-tab">
            <Tab>{views[currentView]}</Tab>
        </div>
    );
};

eZ.addConfig(
    'adminUiConfig.universalDiscoveryWidget.tabs',
    [
        {
            id: 'browse',
            component: BrowseTabModule,
            label: 'Browse',
            icon: '/bundles/ezplatformadminui/img/ez-icons.svg#browse',
        },
    ],
    true
);

export default BrowseTabModule;
