import React, { useContext } from 'react';

import Icon from '../../../common/icon/icon';
import ContentCreate from '../content-create/content.create';
import SortSwitcher from '../sort-switcher/sort.switcher';
import ViewSwitcher from '../view-switcher/view.switcher';

import { TitleContext, CancelContext } from '../../universal.discovery.module';

const TopMenu = () => {
    const title = useContext(TitleContext);
    const cancelUDW = useContext(CancelContext);

    return (
        <div className="c-top-menu">
            <span className="c-top-menu__cancel-btn-wrapper">
                <button className="c-top-menu__cancel-btn" type="button" onClick={cancelUDW}>
                    <Icon name="caret-back" />
                </button>
            </span>
            <span className="c-top-menu__title-wrapper">{title}</span>
            <div className="c-top-menu__actions-wrapper">
                <ContentCreate />
                <SortSwitcher />
                <ViewSwitcher />
            </div>
        </div>
    );
};

export default TopMenu;
