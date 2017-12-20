import React from 'react';
import PropTypes from 'prop-types';

import './css/tab.nav.item.component.css';

const TabNavItemComponent = (props) => {
    const attrs = {
        className: `c-tab-nav-item ${props.isSelected ? 'c-tab-nav-item--selected' : ''}`,
        onClick: () => props.onClick(props.id)
    };

    return (
        <div className="c-tab-nav-item__wrapper">
            <button {...attrs}>
                <svg className="ez-icon c-tab-nav-item__icon">
                    <use xlinkHref={`/bundles/ezplatformadminui/img/ez-icons.svg#${props.iconIdentifier}`}></use>
                </svg>
                {props.title}
            </button>
        </div>
    );
}

TabNavItemComponent.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    iconIdentifier: PropTypes.string.isRequired
};

export default TabNavItemComponent;
