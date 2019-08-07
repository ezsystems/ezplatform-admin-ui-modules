import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import ToggleSelectionButton from '../toggle-selection-button/toggle.selection.button';
import Icon from '../../../common/icon/icon';

import { createCssClassNames } from '../../../common/helpers/css.class.names';
import { MarkedLocationContext, LoadedLocationsMapContext, ContentTypesMapContext } from '../../universal.discovery.module';

const FinderLeaf = ({ location }) => {
    const [markedLocation, setMarkedLocation] = useContext(MarkedLocationContext);
    const [loadedLocationsMap, dispatchLoadedLocationsAction] = useContext(LoadedLocationsMapContext);
    const contentTypesMap = useContext(ContentTypesMapContext);
    const markLocation = ({ nativeEvent }) => {
        const isSelectionButtonClicked = nativeEvent.target.closest('.c-toggle-selection-button');

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
        'c-finder-leaf--has-children': !!location.childCount,
    });
    return (
        <div className={className} onClick={markLocation}>
            <span className="c-finder-leaf__name">
                <Icon
                    extraClasses="ez-icon--small"
                    customPath={contentTypesMap[location.ContentInfo.Content.ContentType._href].thumbnail}
                />
                {location.ContentInfo.Content.Name}
            </span>
            <ToggleSelectionButton location={location} />
        </div>
    );
};

FinderLeaf.propTypes = {
    location: PropTypes.object.isRequired,
};

export default FinderLeaf;
