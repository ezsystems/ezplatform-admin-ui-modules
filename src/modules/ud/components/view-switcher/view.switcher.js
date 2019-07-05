import React, { useContext } from 'react';

import Icon from '../../../common/icon/icon';
import MenuButton from '../menu-button/menu.button';

import { CurrentViewContext, VIEWS } from '../../universal.discovery.module';

const ViewSwitcher = () => {
    const [currentView, setCurrentView] = useContext(CurrentViewContext);

    return (
        <div className="c-udw-view-switcher">
            {VIEWS.map((view) => {
                const extraClasses = view.id === currentView ? 'c-menu-button--selected' : '';
                const onClick = () => {
                    setCurrentView(view.id);
                };

                return (
                    <MenuButton key={view.id} extraClasses={extraClasses} onClick={onClick}>
                        <Icon name={view.icon} extraClasses="ez-icon--small-medium" />
                    </MenuButton>
                );
            })}
        </div>
    );
};

export default ViewSwitcher;
