import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import ToggleSelectionButton from '../toggle-selection-button/toggle.selection.button';
import Icon from '../../../common/icon/icon';

import { createCssClassNames } from '../../../common/helpers/css.class.names';
import { MarkedLocationContext, ContentTypesMapContext } from '../../universal.discovery.module';

const ContentTableItem = ({ location }) => {
    const [markedLocation, setMarkedLocation] = useContext(MarkedLocationContext);
    const contentTypesMap = useContext(ContentTypesMapContext);
    const { formatShortDateTime } = window.eZ.helpers.timezone;
    const className = createCssClassNames({
        'c-content-table-item': true,
        'c-content-table-item--marked': markedLocation === location.id,
    });
    const markLocation = ({ nativeEvent }) => {
        const isSelectionButtonClicked = nativeEvent.target.closest('.c-toggle-selection-button');

        if (isSelectionButtonClicked) {
            return;
        }

        setMarkedLocation(location.id);
    };
    const contentTypeInfo = contentTypesMap[location.ContentInfo.Content.ContentType._href];

    return (
        <tr className={className} onClick={markLocation}>
            <td className="c-content-table-item__icon-wrapper">
                <Icon extraClasses="ez-icon--small" customPath={contentTypeInfo.thumbnail} />
            </td>
            <td>{location.ContentInfo.Content.Name}</td>
            <td>{formatShortDateTime(new Date(location.ContentInfo.Content.lastModificationDate))}</td>
            <td>{contentTypeInfo.name}</td>
            <td className="c-content-table-item__toggle-button-wrapper">
                <ToggleSelectionButton location={location} />
            </td>
        </tr>
    );
};

ContentTableItem.propTypes = {
    location: PropTypes.object.isRequired,
};

export default ContentTableItem;
