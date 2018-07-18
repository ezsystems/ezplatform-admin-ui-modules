import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SelectContentButtonComponent from '../select-content-button/select.content.button.component';

import './css/content.table.item.component.css';

const renderSelectContentBtn = (props) => {
    const { multiple, selectedContent, data, onSelectContent, onItemRemove, canSelectContent } = props;

    return (
        <SelectContentButtonComponent
            multiple={multiple}
            selectedContent={selectedContent}
            location={data}
            onSelectContent={onSelectContent}
            onItemRemove={onItemRemove}
            canSelectContent={canSelectContent}
        />
    );
};

const ContentTableItemComponent = (props) => {
    const { onItemClick, onPreview, data, contentTypesMap, labels, multiple, selectedContent } = props;
    const item = data.ContentInfo.Content;
    const contentType = contentTypesMap ? contentTypesMap[item.ContentType._href] : false;
    const contentTypeName = contentType ? contentType.names.value[0]['#text'] : labels.contentTableItem.notAvailable;
    const onClick = !!onItemClick ? onItemClick.bind(null, data) : null;
    const isSelectedContent = selectedContent.find((content) => content.id === data.id);
    const iconId = isSelectedContent ? 'checkmark' : 'create';

    return (
        <div className="c-content-table-item" onClick={() => onPreview(data)}>
            <div className="c-content-table-item__name" title={item.Name}>
                {item.Name}
            </div>
            <div className="c-content-table-item__type" title={contentTypeName}>
                {contentTypeName}
            </div>
            <div className="c-content-table-item__actions">{renderSelectContentBtn(props)}</div>
        </div>
    );
};

ContentTableItemComponent.propTypes = {
    data: PropTypes.object.isRequired,
    onPreview: PropTypes.func.isRequired,
    contentTypesMap: PropTypes.object.isRequired,
    onItemClick: PropTypes.func,
    labels: PropTypes.shape({
        contentTableItem: PropTypes.shape({
            notAvailable: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    selectedContent: PropTypes.array.isRequired,
    onSelectContent: PropTypes.func.isRequired,
    canSelectContent: PropTypes.func.isRequired,
    onItemRemove: PropTypes.func.isRequired,
    multiple: PropTypes.bool.isRequired,
};

export default ContentTableItemComponent;
