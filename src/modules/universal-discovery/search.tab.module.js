import React from 'react';

import Tab from './components/tab/tab';
import Search from './components/search/search';

const SearchTabModule = () => {
    return (
        <div className="m-search-tab">
            <Tab isContentOnTheFlyDisabled={true} isSortSwitcherDisabled={true} isViewSwitcherDisabled={true}>
                <Search />
            </Tab>
        </div>
    );
};

eZ.addConfig(
    'adminUiConfig.universalDiscoveryWidget.tabs',
    [
        {
            id: 'search',
            component: SearchTabModule,
            label: Translator.trans(/*@Desc("Search")*/ 'search.label', {}, 'universal_discovery_widget'),
            icon: '/bundles/ezplatformadminui/img/ez-icons.svg#search',
        },
    ],
    true
);

export default SearchTabModule;
