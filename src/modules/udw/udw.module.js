import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Popup from '../common/popup/popup.component';

const UDWModule = ({ title, onClose, ...props }) => {
    const [state, setState] = useState(() => {
        let activeTabId = null;

        if (props.tabs.length) {
            const tab = props.tabs.find((tab) => tab.active);

            activeTabId = tab ? tab.id : null;
        }

        return { activeTabId };
    });
    const attrs = {
        isVisible: true,
        title,
        onClose,
    };
    const setActiveTab = ({ target }) => setState({ activeTabId: target.dataset.tabId });
    const renderTab = (tab) => {
        const btnClassName = classNames({
            'udw-popup__tab': true,
            'udw-popup__tab--is-active': state.activeTabId === tab.id,
        });
        const attrs = {
            className: btnClassName,
            type: 'button',
            onClick: setActiveTab,
            'data-tab-id': tab.id,
            key: `${tab.id}-${state.activeTabId}`,
        };

        return <button {...attrs}>{tab.title}</button>;
    };
    const renderPanel = (tab) => {
        const Panel = tab.panel;

        if (tab.id !== state.activeTabId) {
            return null;
        }

        return <Panel key={tab.id} {...tab.attrs} />;
    };
    const renderPopupContent = () => {
        return (
            <Fragment>
                <div className="udw-popup__tabs" data-testid="udw-tabs">
                    {props.tabs.map(renderTab)}
                </div>
                <div className="udw-popup__panels" data-testid="udw-panels">
                    {props.tabs.map(renderPanel)}
                </div>
            </Fragment>
        );
    };
    const renderNoTabsMessage = () => (
        <div className="udw-popup__message udw-popup__message--no-tabs">Nothing to display. There are no tabs defined.</div>
    );

    return <Popup {...attrs}>{props.tabs.length ? renderPopupContent() : renderNoTabsMessage()}</Popup>;
};

UDWModule.propTypes = {
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
    onClose: PropTypes.func,
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
    onClose: () => {},
};

eZ.addConfig('modules.UDW', UDWModule);

export default UDWModule;
