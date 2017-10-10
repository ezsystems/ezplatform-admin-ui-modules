import React from 'react';
import PropTypes from 'prop-types';

import './css/selected.content.item.component.css';

const SelectedContentItemComponent = ({data, onRemove, contentTypesMap, labels}) => {
    const contentType = contentTypesMap ? contentTypesMap[data.ContentInfo.Content.ContentType._href] : false;
    const contentTypeName = contentType ? contentType.names.value[0]['#text'] : labels.notAvailable;

    return (
        <div className="c-selected-content-item">
            <div className="c-selected-content-item__remove" onClick={() => onRemove(data.id)}>&times;</div>
            <div className="c-selected-content-item__wrapper">
                <div className="c-selected-content-item__name">{data.ContentInfo.Content.Name}</div>
                <div className="c-selected-content-item__type">{contentTypeName}</div>
            </div>
        </div>
    );
}

SelectedContentItemComponent.propTypes = {
    data: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired,
    contentTypesMap: PropTypes.object.isRequired,
    labels: PropTypes.shape({
        notAvailable: PropTypes.string.isRequired
    }).isRequired
};

export default SelectedContentItemComponent;
