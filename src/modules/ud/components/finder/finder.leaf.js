import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import ToggleSelectionButton from '../toggle-selection-button/toggle.selection.button';
import Icon from '../../../common/icon/icon';

import { createCssClassNames } from '../../../common/helpers/css.class.names';
import {
    MarkedLocationContext,
    LoadedLocationsMapContext,
    ContentTypesMapContext,
    SelectedLocationsContext,
    MultipleConfigContext,
    ContainersOnlyContext,
    AllowedContentTypesContext,
} from '../../universal.discovery.module';

const FinderLeaf = ({ location }) => {
    const [markedLocation, setMarkedLocation] = useContext(MarkedLocationContext);
    const [loadedLocationsMap, dispatchLoadedLocationsAction] = useContext(LoadedLocationsMapContext);
    const contentTypesMap = useContext(ContentTypesMapContext);
    const [selectedLocations, dispatchSelectedLocationsAction] = useContext(SelectedLocationsContext);
    const [multiple, multipleItemsLimit] = useContext(MultipleConfigContext);
    const containersOnly = useContext(ContainersOnlyContext);
    const allowedContentTypes = useContext(AllowedContentTypesContext);
    const contentTypeInfo = contentTypesMap[location.ContentInfo.Content.ContentType._href];
    const isContainer = contentTypeInfo.isContainer;
    const isNotSelectable =
        (containersOnly && !isContainer) || (allowedContentTypes && !allowedContentTypes.includes(contentTypeInfo.identifier));
    const markLocation = ({ nativeEvent }) => {
        const isSelectionButtonClicked = nativeEvent.target.closest('.c-toggle-selection-button');

        if (isSelectionButtonClicked) {
            return;
        }

        setMarkedLocation(location.id);
        dispatchLoadedLocationsAction({ type: 'CUT_LOCATIONS', locationId: markedLocation });
        dispatchLoadedLocationsAction({ type: 'UPDATE_LOCATIONS', data: { parentLocationId: location.id, subitems: [] } });

        if (!multiple && !isNotSelectable) {
            dispatchSelectedLocationsAction({ type: 'CLEAR_SELECTED_LOCATIONS' });
            dispatchSelectedLocationsAction({ type: 'ADD_SELECTED_LOCATION', location });
        }
    };
    const renderToggleSelectionButton = () => {
        if (!multiple || isNotSelectable) {
            return null;
        }

        return <ToggleSelectionButton location={location} />;
    };
    const className = createCssClassNames({
        'c-finder-leaf': true,
        'c-finder-leaf--marked': !!loadedLocationsMap.find((loadedLocation) => loadedLocation.parentLocationId === location.id),
        'c-finder-leaf--has-children': !!location.childCount,
        'c-finder-leaf--not-selectable': isNotSelectable,
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
            {renderToggleSelectionButton()}
        </div>
    );
};

FinderLeaf.propTypes = {
    location: PropTypes.object.isRequired,
};

export default FinderLeaf;
