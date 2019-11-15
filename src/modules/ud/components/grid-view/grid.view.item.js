import React, { useContext, Fragment } from 'react';
import PropTypes from 'prop-types';

import ToggleSelectionButton from '../toggle-selection-button/toggle.selection.button';
import Icon from '../../../common/icon/icon';

import { createCssClassNames } from '../../../common/helpers/css.class.names';
import {
    LoadedLocationsMapContext,
    MarkedLocationContext,
    ContentTypesMapContext,
    SelectedLocationsContext,
    MultipleConfigContext,
    ContainersOnlyContext,
    AllowedContentTypesContext,
} from '../../universal.discovery.module';

const isSelectionButtonClicked = (event) => {
    return event.target.closest('.c-toggle-selection-button');
};

const GridViewItem = ({ location, version }) => {
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
    const className = createCssClassNames({
        'c-grid-item': true,
        'c-grid-item--marked': markedLocation === location.id,
        'c-grid-item--not-selectable': isNotSelectable,
    });
    const markLocation = ({ nativeEvent }) => {
        if (isSelectionButtonClicked(nativeEvent)) {
            return;
        }

        setMarkedLocation(location.id);

        if (!multiple && !isNotSelectable) {
            dispatchSelectedLocationsAction({ type: 'CLEAR_SELECTED_LOCATIONS' });
            dispatchSelectedLocationsAction({ type: 'ADD_SELECTED_LOCATION', location });
        }
    };
    const loadLocation = ({ nativeEvent }) => {
        if (isSelectionButtonClicked(nativeEvent) || (containersOnly && !isContainer)) {
            return;
        }

        dispatchLoadedLocationsAction({ type: 'UPDATE_LOCATIONS', data: { parentLocationId: location.id, subitems: [] } });
    };
    const renderPreview = () => {
        if (!version.Thumbnail) {
            return (
                <Icon
                    extraClasses="ez-icon--extra-large"
                    customPath={contentTypesMap[location.ContentInfo.Content.ContentType._href].thumbnail}
                />
            );
        }

        return (
            <Fragment>
                <div className="c-grid-item__icon-wrapper">
                    <Icon
                        extraClasses="ez-icon--small"
                        customPath={contentTypesMap[location.ContentInfo.Content.ContentType._href].thumbnail}
                    />
                </div>
                <img src={version.Thumbnail} />
            </Fragment>
        );
    };
    const renderToggleSelectionButton = () => {
        if (!multiple || isNotSelectable) {
            return null;
        }

        return <ToggleSelectionButton location={location} />;
    };

    return (
        <div className={className} onClick={markLocation} onDoubleClick={loadLocation}>
            <div className="c-grid-item__preview">{renderPreview()}</div>
            <div className="c-grid-item__name">{location.ContentInfo.Content.Name}</div>
            {renderToggleSelectionButton()}
        </div>
    );
};

GridViewItem.propTypes = {
    location: PropTypes.object.isRequired,
    version: PropTypes.object,
};

GridViewItem.defaultProps = {
    version: {},
};

export default GridViewItem;
