import React, { useState, Fragment, useEffect, createContext } from 'react';
import PropTypes from 'prop-types';
import { createCssClassNames } from '../common/css-class-names/css.class.names';
import Popup from '../common/popup/popup.component';
import { loadContentTypes } from './services/universal.discovery.service';
import { restInfo } from '../common/rest-info/rest.info';

export const ContentTypesContext = createContext();

const TEXT_NO_TABS_DEFINED = Translator.trans(
    /*@Desc("Nothing to display. There are no tabs defined.")*/ 'no.tabs.defined',
    {},
    'universal_discovery_widget'
);
const TEXT_DEFAULT_TITLE = Translator.trans(/*@Desc("Find content")*/ 'udw.default.title', {}, 'universal_discovery_widget');
const getContentTypesFromResponse = (response) => {
    if (!response || !response.ContentTypeInfoList) {
        return {};
    }

    const contentTypesMap = response.ContentTypeInfoList.ContentType.reduce((total, item) => {
        total[item._href] = item;

        return total;
    }, {});

    return contentTypesMap;
};

const UDWModule = ({ title, onClose, tabs, maxHeight }) => {
    const [contentTypesMap, setContentTypesMap] = useState(null);
    const [activeTabId, setActiveTabId] = useState(() => {
        let id = null;

        if (tabs.length) {
            const tab = tabs.find((tab) => tab.active);

            id = tab ? tab.id : tabs[0].id;
        }

        return id;
    });
    const setActiveTab = ({ target }) => setActiveTabId(target.dataset.tabId);
    const renderTab = (tab) => {
        const btnClassName = createCssClassNames({
            'ez-udw-module__tab': true,
            'ez-udw-module__tab--is-active': activeTabId === tab.id,
        });
        const attrs = {
            className: btnClassName,
            type: 'button',
            onClick: setActiveTab,
            'data-tab-id': tab.id,
            key: `${tab.id}-${activeTabId}`,
        };

        return <button {...attrs}>{tab.title}</button>;
    };
    const renderPanel = (tab) => {
        const Panel = tab.panel;

        if (tab.id !== activeTabId) {
            return null;
        }

        const attrs = {
            key: tab.id,
            maxHeight,
            ...tab.attrs,
        };

        return <Panel {...attrs} />;
    };
    const renderPopupContent = () => {
        return (
            <Fragment>
                <div className="ez-udw-module__tabs" data-testid="udw-tabs">
                    {tabs.map(renderTab)}
                </div>
                <div className="ez-udw-module__panels" data-testid="udw-panels">
                    {tabs.map(renderPanel)}
                </div>
            </Fragment>
        );
    };
    const renderNoTabsMessage = () => <div className="ez-udw-module__message ez-udw-module__message--no-tabs">{TEXT_NO_TABS_DEFINED}</div>;
    const popupAttrs = { isVisible: true, title, onClose };

    useEffect(() => loadContentTypes(restInfo, (response) => setContentTypesMap(getContentTypesFromResponse(response))), []);

    return (
        <ContentTypesContext.Provider value={contentTypesMap}>
            <div className="ez-udw-module">
                <Popup {...popupAttrs}>{tabs.length ? renderPopupContent() : renderNoTabsMessage()}</Popup>
            </div>
        </ContentTypesContext.Provider>
    );
};

UDWModule.propTypes = {
    title: PropTypes.string,
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            panel: PropTypes.func.isRequired,
            attrs: PropTypes.object,
            active: PropTypes.bool,
        }).isRequired
    ),
    maxHeight: PropTypes.number,
    onClose: PropTypes.func,
};

UDWModule.defaultProps = {
    title: TEXT_DEFAULT_TITLE,
    tabs: window.eZ.adminUiConfig.universalDiscoveryWidget.extraTabs || [],
    maxHeight: 500,
    onClose: () => {},
};

eZ.addConfig('modules.UDW', UDWModule);

export default UDWModule;
