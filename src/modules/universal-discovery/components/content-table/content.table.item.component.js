import React from 'react';
import PropTypes from 'prop-types';

import './css/content.table.item.component.css';

const ContentTableItemComponent = (props) => {
    const { onItemClick, onPreview, data, contentTypesMap, labels } = props;

    const item = data.ContentInfo.Content;
    const contentType = contentTypesMap ? contentTypesMap[item.ContentType._href] : false;
    const contentTypeName = contentType ? contentType.names.value[0]['#text'] : labels.notAvailable;
    const onClick = !!onItemClick ? onItemClick.bind(null, data) : null;

    return (
        <div className="c-content-table-item" onClick={onClick}>
            <div className="c-content-table-item__name" title={item.Name}>{item.Name}</div>
            <div className="c-content-table-item__type" title={contentTypeName}>{contentTypeName}</div>
            <div className="c-content-table-item__actions">
                <button className="c-content-table-item__btn--preview" onClick={() => onPreview(props.data)}>
                    <svg className="ez-icon">
                        <use xlinkHref="/bundles/ezplatformadminui/img/ez-icons.svg#view"></use>
                    </svg>
                </button>
            </div>
        </div>
    );
};

ContentTableItemComponent.propTypes = {
    data: PropTypes.object.isRequired,
    onPreview: PropTypes.func.isRequired,
    contentTypesMap: PropTypes.object.isRequired,
    onItemClick: PropTypes.func.isRequired,
    labels: PropTypes.shape({
        notAvailable: PropTypes.string.isRequired
    }).isRequired
};

export default ContentTableItemComponent;
