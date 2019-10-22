import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import Icon from '../../../common/icon/icon';

import { CreateContentWidgetContext, MarkedLocationContext, LoadedLocationsMapContext } from '../../universal.discovery.module';

const ContentCreateButton = ({ isDisabled }) => {
    const [markedLocation, setMarkedLocation] = useContext(MarkedLocationContext);
    const [loadedLocationsMap, dispatchLoadedLocationsAction] = useContext(LoadedLocationsMapContext);
    const [createContentVisible, setCreateContentVisible] = useContext(CreateContentWidgetContext);
    const toggleContentCreateVisibility = () => {
        setCreateContentVisible((prevState) => !prevState);
    };
    const selectedLocation = loadedLocationsMap.find((loadedLocation) => loadedLocation.parentLocationId === markedLocation);
    const hasAccess = !selectedLocation.permissions || (selectedLocation.permissions && selectedLocation.permissions.hasAccess);

    return (
        <div className="c-content-create-button">
            <button
                className="c-content-create-button__btn btn btn-primary"
                disabled={isDisabled || !hasAccess}
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
