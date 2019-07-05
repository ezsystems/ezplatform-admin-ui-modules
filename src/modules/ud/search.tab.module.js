import React from 'react';

import Tab from './components/tab/tab';

const SearchTabModule = () => {
    return (
        <div className="m-bookmarks-tab">
            <Tab>Search</Tab>
        </div>
    );
};

eZ.addConfig(
    'adminUiConfig.universalDiscoveryWidget.tabs',
    [
        {
            id: 'search',
            component: SearchTabModule,
            label: 'Search',
            icon: '/bundles/ezplatformadminui/img/ez-icons.svg#search',
        },
    ],
    true
);

export default SearchTabModule;
