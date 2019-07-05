import React from 'react';

import Tab from './components/tab/tab';

const BrowseTabModule = () => {
    return (
        <div className="m-browse-tab">
            <Tab>main finder</Tab>
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
