import React, { useContext, Fragment } from 'react';
import PropTypes from 'prop-types';

import ToggleSelectionButton from '../toggle-selection-button/toggle.selection.button';
import Icon from '../../../common/icon/icon';

import { createCssClassNames } from '../../../common/helpers/css.class.names';
import { LoadedLocationsMapContext, MarkedLocationContext, ContentTypesMapContext } from '../../universal.discovery.module';

const isSelectionButtonClicked = (event) => {
    return event.target.closest('.c-toggle-selection-button');
};

const GridViewItem = ({ location, version }) => {
    const [markedLocation, setMarkedLocation] = useContext(MarkedLocationContext);
    const [loadedLocationsMap, dispatchLoadedLocationsAction] = useContext(LoadedLocationsMapContext);
    const contentTypesMap = useContext(ContentTypesMapContext);
    const className = createCssClassNames({
        'c-grid-item': true,
        'c-grid-item--marked': markedLocation === location.id,
    });
    const markLocation = ({ nativeEvent }) => {
        if (isSelectionButtonClicked(nativeEvent)) {
            return;
        }

        setMarkedLocation(location.id);
    };
    const loadLocation = ({ nativeEvent }) => {
        if (isSelectionButtonClicked(nativeEvent)) {
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

    return (
        <div className={className} onClick={markLocation} onDoubleClick={loadLocation}>
            <div className="c-grid-item__preview">{renderPreview()}</div>
            <div className="c-grid-item__name">{location.ContentInfo.Content.Name}</div>
            <ToggleSelectionButton location={location} />
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
