import React from 'react';
import PropTypes from 'prop-types';

import './css/action.btn.css';
import Icon from '../../../common/icon/icon';

const ActionButton = (props) => {
    const { disabled, onClick, label, type } = props;
    const baseClassName = 'c-action-btn';
    const handleClick = () => {
        if (!disabled) {
            onClick();
        }
    };
    let className = `${baseClassName}`;

    className = disabled ? `${className} ${baseClassName}--disabled` : className;
    className = type ? `${className} ${baseClassName}--${type}` : className;

    return (
        <div className={className} title={label} onClick={handleClick}>
            <Icon name={type} extraClasses="ez-icon--medium" />
        </div>
    );
};

ActionButton.propTypes = {
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default ActionButton;
