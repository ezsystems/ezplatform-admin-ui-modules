import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../common/icon/icon';
import { classnames } from '../../../common/classnames/classnames';

const SelectContentButtonComponent = ({ canSelectContent, location, onSelect, onDeselect, isSelected }) => {
    const [isSelectContentEnabled, setIsSelectContentEnabled] = useState(true);
    const handleSelect = () => onSelect(location);
    const handleDeselect = () => onDeselect(location.id);
    const toggleEnabledState = (selectContentEnabled) => {
        if (isSelectContentEnabled === selectContentEnabled) {
            return;
        }

        setIsSelectContentEnabled(selectContentEnabled);
    };

    useEffect(() => {
        canSelectContent(location, toggleEnabledState);
    });

    const iconId = isSelected ? 'checkmark' : 'create';
    const attrs = {
        type: 'button',
        className: classnames({
            'c-select-content-button': true,
            'c-select-content-button--selected': isSelected,
        }),
        onClick: isSelected ? handleDeselect : handleSelect,
    };

    if (!isSelected && !isSelectContentEnabled) {
        return null;
    }

    return (
        <button {...attrs}>
            <Icon name={iconId} extraClasses="ez-icon--small" />
        </button>
    );
};

SelectContentButtonComponent.propTypes = {
    canSelectContent: PropTypes.func.isRequired,
    location: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }).isRequired,
    onSelect: PropTypes.func.isRequired,
    onDeselect: PropTypes.func.isRequired,
    isSelected: PropTypes.bool.isRequired,
};

SelectContentButtonComponent.defaultProps = {
    isSelected: false,
};

export default SelectContentButtonComponent;
