import React from 'react';

import Tab from './components/tab/tab';

const BookmarksTabModule = () => {
    return (
        <div className="m-bookmarks-tab">
            <Tab>Bookmarks</Tab>
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
