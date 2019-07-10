import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import Icon from '../../../common/icon/icon';

import { createCssClassNames } from '../../../common/helpers/css.class.names';
import { LoadedLocationsMapContext, SelectedLocationsContext, MarkedLocationContext } from '../../universal.discovery.module';

const GridViewItem = ({ location }) => {
    const [markedLocation, setMarkedLocation] = useContext(MarkedLocationContext);
    const [loadedLocationsMap, dispatchLoadedLocationsAction] = useContext(LoadedLocationsMapContext);
    const [selectedLocations, dispatchSelectedLocationsAction] = useContext(SelectedLocationsContext);
    const isSelected = selectedLocations.some((selectedLocation) => selectedLocation.id === location.id);
    const iconName = isSelected ? 'checkmark' : 'create';
    const buttonClassName = createCssClassNames({
        'c-grid-item__selection-button': true,
        'c-grid-item__selection-button--selected': isSelected,
    });
    const className = createCssClassNames({
        'c-grid-item': true,
        'c-grid-item--marked': markedLocation === location.id,
    });
    const markLocation = ({ nativeEvent }) => {
        const isSelectionButtonClicked = nativeEvent.target.closest('.c-grid-item__selection-button');

        if (isSelectionButtonClicked) {
            return;
        }

        setMarkedLocation(location.id);
    };
    const loadLocation = () => {
        dispatchLoadedLocationsAction({ type: 'UPDATE_LOCATIONS', data: { parentLocationId: location.id, offset: 0, items: [] } });
    };
    const toggleSelection = () => {
        const action = isSelected ? { type: 'REMOVE_SELECTED_LOCATION', id: location.id } : { type: 'ADD_SELECTED_LOCATION', location };

        dispatchSelectedLocationsAction(action);
    };

    return (
        <div className={className} onClick={markLocation} onDoubleClick={loadLocation}>
            <div className="c-grid-item__preview"></div>
            <div className="c-grid-item__name">{location.ContentInfo.Content.Name}</div>
            <button className={buttonClassName} onClick={toggleSelection}>
                <Icon name={iconName} extraClasses="ez-icon--small" />
            </button>
        </div>
    );
};

GridViewItem.propTypes = {
    location: PropTypes.object.isRequired,
};

export default GridViewItem;
