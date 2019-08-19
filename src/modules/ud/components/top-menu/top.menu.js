import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import Icon from '../../../common/icon/icon';
import ContentCreate from '../content-create/content.create';
import SortSwitcher from '../sort-switcher/sort.switcher';
import ViewSwitcher from '../view-switcher/view.switcher';

import { TitleContext, CancelContext } from '../../universal.discovery.module';

const TopMenu = ({ isContentOnTheFlyDisabled, isSortSwitcherDisabled, isViewSwitcherDisabled }) => {
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
                <ContentCreate isDisabled={isContentOnTheFlyDisabled} />
                <SortSwitcher isDisabled={isSortSwitcherDisabled} />
                <ViewSwitcher isDisabled={isViewSwitcherDisabled} />
            </div>
        </div>
    );
};

TopMenu.propTypes = {
    isContentOnTheFlyDisabled: PropTypes.bool,
    isSortSwitcherDisabled: PropTypes.bool,
    isViewSwitcherDisabled: PropTypes.bool,
};

TopMenu.defaultProps = {
    isContentOnTheFlyDisabled: false,
    isSortSwitcherDisabled: false,
    isViewSwitcherDisabled: false,
};

export default TopMenu;
