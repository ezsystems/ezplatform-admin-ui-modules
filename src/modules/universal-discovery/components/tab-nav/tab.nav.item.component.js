import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../common/icon/icon';

const TabNavItemComponent = (props) => {
    const attrs = {
        type: 'button',
        className: `c-tab-nav-item ${props.isSelected ? 'c-tab-nav-item--selected' : ''}`,
        onClick: () => props.onClick(props.id),
    };

    return (
        <div className="c-tab-nav-item__wrapper">
            <button {...attrs}>
                <Icon name={props.iconIdentifier} extraClasses="c-tab-nav-item__icon ez-icon--small" />
                {props.title}
            </button>
        </div>
    );
};

TabNavItemComponent.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    iconIdentifier: PropTypes.string.isRequired,
};

export default TabNavItemComponent;
