import React from 'react';
import PropTypes from 'prop-types';

import SelectContentButtonComponent from '../select-content-button/select.content.button.component';
import Icon from '../../../common/icon/icon';

const ContentTableItemComponent = (props) => {
    const { onPreview, data, contentTypesMap, multiple, selectedContent, onSelectContent, onItemRemove, canSelectContent } = props;
    const notAvailableLabel = Translator.trans(/*@Desc("N/A")*/ 'content_table.not_available.label', {}, 'universal_discovery_widget');
    const item = data.ContentInfo.Content;
    const contentType = contentTypesMap ? contentTypesMap[item.ContentType._href] : null;
    const contentTypeIdentifier = contentType ? contentType.identifier : null;
    const contentTypeName = contentTypeIdentifier ? window.eZ.adminUiConfig.contentTypeNames[contentTypeIdentifier] : notAvailableLabel;
    const contentTypeIconUrl = eZ.helpers.contentType.getContentTypeIconUrl(contentTypeIdentifier);

    return (
        <div className="c-content-table-item" onClick={onPreview} tabIndex="-1">
            <div className="c-content-table-item__icon">
                <Icon customPath={contentTypeIconUrl} extraClasses="ez-icon--medium" />
            </div>
            <div className="c-content-table-item__name" title={item.Name}>
                {item.Name}
            </div>
            <div className="c-content-table-item__type" title={contentTypeName}>
                {contentTypeName}
            </div>
            <div className="c-content-table-item__actions">
                <SelectContentButtonComponent
                    multiple={multiple}
                    isSelected={!!selectedContent.find((content) => content.id === data.id)}
                    location={data}
                    onSelectContent={onSelectContent}
                    onItemRemove={onItemRemove}
                    canSelectContent={canSelectContent}
                />
            </div>
        </div>
    );
};

ContentTableItemComponent.propTypes = {
    data: PropTypes.object.isRequired,
    onPreview: PropTypes.func.isRequired,
    contentTypesMap: PropTypes.object.isRequired,
    onItemClick: PropTypes.func,
    selectedContent: PropTypes.array.isRequired,
    onSelectContent: PropTypes.func.isRequired,
    canSelectContent: PropTypes.func.isRequired,
    onItemRemove: PropTypes.func.isRequired,
    multiple: PropTypes.bool.isRequired,
};

export default ContentTableItemComponent;
