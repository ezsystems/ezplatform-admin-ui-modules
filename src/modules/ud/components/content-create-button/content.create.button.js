import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import Icon from '../../../common/icon/icon';

import {
    CreateContentWidgetContext,
    MarkedLocationContext,
    LoadedLocationsMapContext,
    ContentOnTheFlyConfigContext,
} from '../../universal.discovery.module';

const ContentCreateButton = ({ isDisabled }) => {
    const [markedLocation, setMarkedLocation] = useContext(MarkedLocationContext);
    const [loadedLocationsMap, dispatchLoadedLocationsAction] = useContext(LoadedLocationsMapContext);
    const [createContentVisible, setCreateContentVisible] = useContext(CreateContentWidgetContext);
    const { hidden, allowedLocations } = useContext(ContentOnTheFlyConfigContext);
    const toggleContentCreateVisibility = () => {
        setCreateContentVisible((prevState) => !prevState);
    };
    const selectedLocation = loadedLocationsMap.find((loadedLocation) => loadedLocation.parentLocationId === markedLocation);
    const isAllowedLocation = !allowedLocations || allowedLocations.includes(selectedLocation.parentLocationId);
    const hasAccess =
        !selectedLocation || !selectedLocation.permissions || (selectedLocation.permissions && selectedLocation.permissions.hasAccess);

    if (hidden) {
        return null;
    }

    return (
        <div className="c-content-create-button">
            <button
                className="c-content-create-button__btn btn btn-primary"
                disabled={isDisabled || !hasAccess || !isAllowedLocation}
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
