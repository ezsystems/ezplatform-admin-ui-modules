import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import Icon from '../../../common/icon/icon';

import { createCssClassNames } from '../../../common/helpers/css.class.names';
import { SelectedLocationsContext, MultipleConfigContext } from '../../universal.discovery.module';

const ToggleSelectionButton = ({ location }) => {
    const [selectedLocations, dispatchSelectedLocationsAction] = useContext(SelectedLocationsContext);
    const [multiple, multipleItemsLimit] = useContext(MultipleConfigContext);
    const isSelected = selectedLocations.some((selectedLocation) => selectedLocation.id === location.id);
    const iconName = isSelected ? 'checkmark' : 'create';
    const className = createCssClassNames({
        'c-toggle-selection-button': true,
        'c-toggle-selection-button--selected': isSelected,
    });
    const toggleSelection = () => {
        const action = isSelected ? { type: 'REMOVE_SELECTED_LOCATION', id: location.id } : { type: 'ADD_SELECTED_LOCATION', location };

        dispatchSelectedLocationsAction(action);
    };

    if (multiple && !isSelected && selectedLocations.length >= multipleItemsLimit) {
        return null;
    }

    return (
        <button className={className} onClick={toggleSelection}>
            <Icon name={iconName} extraClasses="ez-icon--small" />
        </button>
    );
};

ToggleSelectionButton.propTypes = {
    location: PropTypes.object.isRequired,
};

export default ToggleSelectionButton;
