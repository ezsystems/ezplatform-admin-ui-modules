import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Popup from '../common/popup/popup.component';

const UDWModule = ({ title, ...props }) => {
    const [state, setState] = useState({ activeTab: props.tabs.find((tab) => tab.active).id });
    const attrs = {
        isVisible: true,
        title,
    };
    const setActiveTab = ({ target }) => setState({ activeTab: target.dataset.tabId });
    const renderTab = (tab) => {
        const btnClassName = classNames({
            'udw-popup__tab': true,
            'udw-popup__tab--is-active': state.activeTab === tab.id,
        });
        const attrs = {
            className: btnClassName,
            type: 'button',
            onClick: setActiveTab,
            'data-tab-id': tab.id,
            key: `${tab.id}-${state.activeTab}`,
        };

        return <button {...attrs}>{tab.title}</button>;
    };
    const renderPanel = (tab) => {
        const Panel = tab.panel;

        if (tab.id !== state.activeTab) {
            return null;
        }

        return <Panel key={tab.id} {...tab.attrs} />;
    };

    return (
        <Popup {...attrs}>
            <div className="udw-popup__tabs">{props.tabs.map(renderTab)}</div>
            <div className="udw-popup__panels">{props.tabs.map(renderPanel)}</div>
        </Popup>
    );
};

UDWModule.propTypes = {
    restInfo: PropTypes.shape({
        token: PropTypes.string.isRequired,
        siteaccess: PropTypes.string.isRequired,
    }).isRequired,
    title: PropTypes.string,
    multiple: PropTypes.bool,
    selectedItemsLimit: PropTypes.number,
    canSelectContent: PropTypes.func,
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            panel: PropTypes.func.isRequired,
            attrs: PropTypes.object,
        })
    ),
    startingLocationId: PropTypes.number,
    maxHeight: PropTypes.number,
    languages: PropTypes.object,
    contentTypes: PropTypes.object,
};

UDWModule.defaultProps = {
    title: 'Find content',
    multiple: true,
    selectedItemsLimit: 0,
    canSelectContent: (item, callback) => callback(true),
    tabs: window.eZ.adminUiConfig.universalDiscoveryWidget.extraTabs || [],
    startingLocationId: 1,
    maxHeight: 500,
    languages: window.eZ.adminUiConfig.languages,
    contentTypes: window.eZ.adminUiConfig.contentTypes,
};

eZ.addConfig('modules.UDW', UDWModule);

export default UDWModule;
