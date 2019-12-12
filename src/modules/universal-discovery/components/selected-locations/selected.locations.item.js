import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import Icon from '../../../common/icon/icon';

import { SelectedLocationsContext, ContentTypesMapContext } from '../../universal.discovery.module';

const SelectedLocationsItem = ({ location }) => {
    const [selectedLocations, dispatchSelectedLocationsAction] = useContext(SelectedLocationsContext);
    const contentTypesMap = useContext(ContentTypesMapContext);
    const removeFromSelection = () => {
        dispatchSelectedLocationsAction({ type: 'REMOVE_SELECTED_LOCATION', id: location.id });
    };

    return (
        <div className="c-selected-locations-item">
            <div className="c-selected-locations-item__image-wrapper"></div>
            <div className="c-selected-locations-item__info">
                <span className="c-selected-locations-item__info-name">{location.ContentInfo.Content.Name}</span>
                <span className="c-selected-locations-item__info-description">
                    {contentTypesMap[location.ContentInfo.Content.ContentType._href].name}
                </span>
            </div>
            <div className="c-selected-locations-item__actions-wrapper">
                <button type="button" className="c-selected-locations-item__remove-button" onClick={removeFromSelection}>
                    <Icon name="discard" extraClasses="ez-icon--small-medium" />
                </button>
            </div>
        </div>
    );
};

SelectedLocationsItem.propTypes = {
    location: PropTypes.object.isRequired,
};

export default SelectedLocationsItem;
