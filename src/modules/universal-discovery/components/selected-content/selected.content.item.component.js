import React from 'react';
import PropTypes from 'prop-types';

import './css/selected.content.item.component.css';

const SelectedContentItemComponent = ({ data, onRemove, labels }) => {
    const contentTypeInfo = data.ContentInfo.Content.ContentTypeInfo;
    const contentTypeName = contentTypeInfo ? contentTypeInfo.names.value[0]['#text'] : labels.notAvailable;
    let icon;

    if (contentTypeInfo) {
        icon = (
            <svg className="ez-icon c-selected-content-item__icon">
                <use xlinkHref={`/bundles/ezplatformadminui/img/ez-icons.svg#${contentTypeInfo.identifier}`} />
            </svg>
        );
    }

    return (
        <div className="c-selected-content-item">
            <div className="c-selected-content-item__wrapper">
                <div className="c-selected-content-item__name">{data.ContentInfo.Content.Name}</div>
                <div className="c-selected-content-item__type">
                    {icon} {contentTypeName}
                </div>
            </div>
            <div className="c-selected-content-item__remove" onClick={() => onRemove(data.id)}>
                <svg className="ez-icon">
                    <use xlinkHref="/bundles/ezplatformadminui/img/ez-icons.svg#discard" />
                </svg>
            </div>
        </div>
    );
};

SelectedContentItemComponent.propTypes = {
    data: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired,
    labels: PropTypes.shape({
        notAvailable: PropTypes.string.isRequired,
    }).isRequired,
};

export default SelectedContentItemComponent;
