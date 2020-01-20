import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import Icon from '../../../common/icon/icon';

import {
    CreateContentWidgetContext,
    MarkedLocationContext,
    LoadedLocationsMapContext,
    ContentOnTheFlyConfigContext,
    SelectedLocationsContext,
    MultipleConfigContext,
} from '../../universal.discovery.module';

const ContentCreateButton = ({ isDisabled }) => {
    const [markedLocation, setMarkedLocation] = useContext(MarkedLocationContext);
    const [loadedLocationsMap, dispatchLoadedLocationsAction] = useContext(LoadedLocationsMapContext);
    const [createContentVisible, setCreateContentVisible] = useContext(CreateContentWidgetContext);
    const [selectedLocations, dispatchSelectedLocationsAction] = useContext(SelectedLocationsContext);
    const [multiple, multipleItemsLimit] = useContext(MultipleConfigContext);
    const { hidden, allowedLocations } = useContext(ContentOnTheFlyConfigContext);
    const toggleContentCreateVisibility = () => {
        setCreateContentVisible((prevState) => !prevState);
    };
    let selectedLocation = loadedLocationsMap.find((loadedLocation) => loadedLocation.parentLocationId === markedLocation);

    if (!selectedLocation && loadedLocationsMap.length) {
        selectedLocation = loadedLocationsMap[loadedLocationsMap.length - 1].subitems.find(
            (subitem) => subitem.location.id === markedLocation
        );
    }

    const isAllowedLocation = selectedLocation && (!allowedLocations || allowedLocations.includes(selectedLocation.parentLocationId));
    const hasAccess =
        !selectedLocation || !selectedLocation.permissions || (selectedLocation.permissions && selectedLocation.permissions.hasAccess);
    const isLimitReached = multiple && multipleItemsLimit !== 0 && selectedLocations.length >= multipleItemsLimit;

    if (hidden) {
        return null;
    }

    return (
        <div className="c-content-create-button">
            <button
                className="c-content-create-button__btn btn btn-primary"
                disabled={isDisabled || !hasAccess || !isAllowedLocation || isLimitReached}
                onClick={toggleContentCreateVisibility}>
                <Icon name="create" extraClasses="ez-icon--medium ez-icon--light" />
            </button>
        </div>
    );
};

ContentCreateButton.propTypes = {
    isDisabled: PropTypes.bool,
};

ContentCreateButton.defaultProps = {
    isDisabled: false,
};

export default ContentCreateButton;
