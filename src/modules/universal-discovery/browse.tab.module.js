import React, { useContext } from 'react';

import Tab from './components/tab/tab';
import GridView from './components/grid-view/grid.view';
import Finder from './components/finder/finder';

import { CurrentViewContext } from './universal.discovery.module';

const views = {
    grid: <GridView />,
    finder: <Finder />,
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
            label: Translator.trans(/*@Desc("Browse")*/ 'browse.label', {}, 'universal_discovery_widget'),
            icon: '/bundles/ezplatformadminui/img/ez-icons.svg#browse',
        },
    ],
    true
);

export default BrowseTabModule;
