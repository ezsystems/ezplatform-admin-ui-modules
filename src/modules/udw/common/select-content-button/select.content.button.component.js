import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../common/icon/icon';
import { classnames } from '../../../common/classnames/classnames';

const SelectContentButtonComponent = ({ checkCanSelectContent, location, onSelect, onDeselect, isSelected }) => {
    const [isSelectContentEnabled, setIsSelectContentEnabled] = useState(true);
    const [isContentSelected, setIsContentSelected] = useState(false);
    const handleSelect = useCallback(
        (event) => {
            event.stopPropagation();

            setIsContentSelected(true);
            onSelect(location);
        },
        [location, onSelect]
    );
    const handleDeselect = useCallback(
        (event) => {
            event.stopPropagation();

            setIsContentSelected(false);
            onDeselect(location.id);
        },
        [location.id, onDeselect]
    );
    const toggleEnabledState = useCallback(
        (selectContentEnabled) => {
            if (isSelectContentEnabled === selectContentEnabled) {
                return;
            }

            setIsSelectContentEnabled(selectContentEnabled);
        },
        [isSelectContentEnabled]
    );

    useEffect(() => {
        checkCanSelectContent(location, toggleEnabledState);
    }, [checkCanSelectContent, location, toggleEnabledState]);

    const iconId = isSelected ? 'checkmark' : 'create';
    const attrs = {
        type: 'button',
        className: classnames({
            'c-select-content-button': true,
            'c-select-content-button--selected': isContentSelected || isSelected,
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
    checkCanSelectContent: PropTypes.func.isRequired,
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
