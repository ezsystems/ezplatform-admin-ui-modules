import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../common/icon/icon';

const ActionButton = (props) => {
    const { disabled, onClick, label, type } = props;
    const baseClassName = 'c-action-btn';
    const handleClick = () => {
        if (!disabled) {
            onClick();
        }
    };
    const attrs = {
        className: `${baseClassName}`,
        title: label,
        tabIndex: '-1',
        onClick: handleClick,
    };

    attrs.className = disabled ? `${attrs.className} ${baseClassName}--disabled` : attrs.className;
    attrs.className = type ? `${attrs.className} ${baseClassName}--${type}` : attrs.className;

    return (
        <div {...attrs}>
            <Icon name={type} extraClasses="ez-icon--light ez-icon--medium" />
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
