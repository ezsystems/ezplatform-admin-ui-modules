import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import Icon from '../../../common/icon/icon';
import Thumbnail from '../../../common/thumbnail/thumbnail';

import { SelectedLocationsContext, ContentTypesMapContext } from '../../universal.discovery.module';

const SelectedLocationsItem = ({ location }) => {
    const [selectedLocations, dispatchSelectedLocationsAction] = useContext(SelectedLocationsContext);
    const contentTypesMap = useContext(ContentTypesMapContext);
    const removeFromSelection = () => {
        dispatchSelectedLocationsAction({ type: 'REMOVE_SELECTED_LOCATION', id: location.id });
    };
    const sortedActions = useMemo(() => {
        const { selectedItemActions } = window.eZ.adminUiConfig.universalDiscoveryWidget;
        const actions = selectedItemActions ? [...selectedItemActions] : [];

        return actions.sort((actionA, actionB) => {
            return actionB.priority - actionA.priority;
        });
    }, []);
    const version = location.ContentInfo.Content.CurrentVersion.Version;
    const thumbnailData = version ? version.Thumbnail : {};

    return (
        <div className="c-selected-locations-item">
            <div className="c-selected-locations-item__image-wrapper">
                <Thumbnail thumbnailData={thumbnailData} />
            </div>
            <div className="c-selected-locations-item__info">
                <span className="c-selected-locations-item__info-name">{location.ContentInfo.Content.TranslatedName}</span>
                <span className="c-selected-locations-item__info-description">
                    {contentTypesMap[location.ContentInfo.Content.ContentType._href].name}
                </span>
            </div>
            <div className="c-selected-locations-item__actions-wrapper">
                {sortedActions.map((action) => {
                    const Component = action.component;

                    return <Component key={action.id} location={location} />;
                })}
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
