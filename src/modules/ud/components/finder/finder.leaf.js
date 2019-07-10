import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import Icon from '../../../common/icon/icon';

import { createCssClassNames } from '../../../common/helpers/css.class.names';
import { MarkedLocationContext, LoadedLocationsMapContext, SelectedLocationsContext } from '../../universal.discovery.module';

const FinderLeaf = ({ location }) => {
    const [markedLocation, setMarkedLocation] = useContext(MarkedLocationContext);
    const [loadedLocationsMap, dispatchLoadedLocationsAction] = useContext(LoadedLocationsMapContext);
    const [selectedLocations, dispatchSelectedLocationsAction] = useContext(SelectedLocationsContext);
    const markLocation = ({ nativeEvent }) => {
        const isSelectionButtonClicked = nativeEvent.target.closest('.c-finder-leaf__selection-button');

        if (isSelectionButtonClicked) {
            return;
        }

        setMarkedLocation(location.id);
        dispatchLoadedLocationsAction({ type: 'CUT_LOCATIONS', locationId: markedLocation });
        dispatchLoadedLocationsAction({ type: 'UPDATE_LOCATIONS', data: { parentLocationId: location.id, offset: 0, items: [] } });
    };
    const className = createCssClassNames({
        'c-finder-leaf': true,
        'c-finder-leaf--marked': !!loadedLocationsMap.find((loadedLocation) => loadedLocation.parentLocationId === location.id),
    });
    const isSelected = selectedLocations.some((selectedLocation) => selectedLocation.id === location.id);
    const iconName = isSelected ? 'checkmark' : 'create';
    const buttonClassName = createCssClassNames({
        'c-finder-leaf__selection-button': true,
        'c-finder-leaf__selection-button--selected': isSelected,
    });
    const toggleSelection = () => {
        const action = isSelected ? { type: 'REMOVE_SELECTED_LOCATION', id: location.id } : { type: 'ADD_SELECTED_LOCATION', location };

        dispatchSelectedLocationsAction(action);
    };

    return (
        <div className={className} onClick={markLocation}>
            {location.ContentInfo.Content.Name}
            <button className={buttonClassName} onClick={toggleSelection}>
                <Icon name={iconName} extraClasses="ez-icon--small" />
            </button>
        </div>
    );
};

FinderLeaf.propTypes = {
    location: PropTypes.object.isRequired,
};

export default FinderLeaf;
