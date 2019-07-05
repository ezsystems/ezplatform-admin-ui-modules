import React, { useEffect, useState, createContext } from 'react';
import PropTypes from 'prop-types';

const CLASS_SCROLL_DISABLED = 'ez-scroll-disabled';

export const SORTING_OPTIONS = [{ id: 'date', label: 'Date' }, { id: 'type', label: 'Type' }, { id: 'name', label: 'Name' }];
export const VIEWS = [{ id: 'grid', icon: 'view-grid' }, { id: 'finder', icon: 'content-tree' }, { id: 'tree', icon: 'content-tree' }];

export const ActiveTabContext = createContext();
export const TabsConfigContext = createContext();
export const TitleContext = createContext();
export const CancelContext = createContext();
export const SortingContext = createContext();
export const CurrentViewContext = createContext();

const UniversalDiscoveryModule = (props) => {
    const [activeTab, setActiveTab] = useState(props.activeTab);
    const [sorting, setSorting] = useState(SORTING_OPTIONS[0].id);
    const [currentView, setCurrentView] = useState(VIEWS[0].id);
    const activeTabConfig = props.tabs.find((tab) => tab.id === activeTab);
    const Tab = activeTabConfig.component;

    useEffect(() => {
        window.document.body.classList.add(CLASS_SCROLL_DISABLED);

        return () => {
            window.document.body.classList.remove(CLASS_SCROLL_DISABLED);
        };
    });

    return (
        <div className="m-ud">
            <ActiveTabContext.Provider value={[activeTab, setActiveTab]}>
                <TabsConfigContext.Provider value={props.tabs}>
                    <TitleContext.Provider value={props.title}>
                        <CancelContext.Provider value={props.onCancel}>
                            <SortingContext.Provider value={[sorting, setSorting]}>
                                <CurrentViewContext.Provider value={[currentView, setCurrentView]}>
                                    <Tab />
                                </CurrentViewContext.Provider>
                            </SortingContext.Provider>
                        </CancelContext.Provider>
                    </TitleContext.Provider>
                </TabsConfigContext.Provider>
            </ActiveTabContext.Provider>
        </div>
    );
};

UniversalDiscoveryModule.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    activeTab: PropTypes.string,
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            component: PropTypes.func.isRequired,
            label: PropTypes.string.isRequired,
            icon: PropTypes.string.isRequired,
        })
    ).isRequired,
};

UniversalDiscoveryModule.defaultProps = {
    activeTab: 'browse',
};

eZ.addConfig('modules.UDW', UniversalDiscoveryModule);

export default UniversalDiscoveryModule;
