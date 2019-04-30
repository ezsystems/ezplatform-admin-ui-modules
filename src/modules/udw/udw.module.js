import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { classnames } from '../common/classnames/classnames';
import Popup from '../common/popup/popup.component';

const UDWModule = ({ title, onClose, tabs, maxHeight }) => {
    // useReducer maybe?
    const [state, setState] = useState(() => {
        let activeTabId = null;

        if (tabs.length) {
            const tab = tabs.find((tab) => tab.active);

            activeTabId = tab ? tab.id : tabs[0].id;
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
        const btnClassName = classnames({
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

        const attrs = {
            key: tab.id,
            maxHeight,
            ...tab.attrs,
        };

        console.log('renderPanel', { ...attrs });

        return <Panel {...attrs} />;
    };
    const renderPopupContent = () => {
        return (
            <Fragment>
                <div className="udw-popup__tabs" data-testid="udw-tabs">
                    {tabs.map(renderTab)}
                </div>
                <div className="udw-popup__panels" data-testid="udw-panels">
                    {tabs.map(renderPanel)}
                </div>
            </Fragment>
        );
    };
    const renderNoTabsMessage = () => (
        <div className="udw-popup__message udw-popup__message--no-tabs">Nothing to display. There are no tabs defined.</div>
    );

    return <Popup {...attrs}>{tabs.length ? renderPopupContent() : renderNoTabsMessage()}</Popup>;
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
        })
    ),
    maxHeight: PropTypes.number,
    onClose: PropTypes.func,
};

UDWModule.defaultProps = {
    title: 'Find content',
    tabs: window.eZ.adminUiConfig.universalDiscoveryWidget.extraTabs || [],
    maxHeight: 500,
    onClose: () => {},
};

eZ.addConfig('modules.UDW', UDWModule);

export default UDWModule;
