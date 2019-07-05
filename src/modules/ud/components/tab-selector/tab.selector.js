import React, { useContext } from 'react';

import Icon from '../../../common/icon/icon';

import { createCssClassNames } from '../../../common/helpers/css.class.names';
import { TabsConfigContext, ActiveTabContext } from '../../universal.discovery.module';

const TabSelector = () => {
    const tabs = useContext(TabsConfigContext);
    const [activeTab, setActiveTab] = useContext(ActiveTabContext);

    return (
        <div className="c-tab-selector">
            {tabs.map((tab) => {
                const onClick = () => setActiveTab(tab.id);
                const className = createCssClassNames({
                    'c-tab-selector__item': true,
                    'c-tab-selector__item--selected': tab.id === activeTab,
                });

                return (
                    <div className={className} key={tab.id} onClick={onClick}>
                        <Icon customPath={tab.icon} extraClasses="ez-icon--medium" />
                        {tab.label}
                    </div>
                );
            })}
        </div>
    );
};

export default TabSelector;
