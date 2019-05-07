import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import SelectContentButtonComponent from '../../../../common/select-content-button/select.content.button.component';
import Icon from '../../../../../common/icon/icon';
import { ContentTypesContext } from '../../../../udw.module';

const TEXT_NOT_AVAILABLE = Translator.trans(/*@Desc("N/A")*/ 'content_table.not_available.label', {}, 'universal_discovery_widget');

const ContentTableItemComponent = (props) => {
    const contentTypesMap = useContext(ContentTypesContext);
    const { onContainerClick, location, shouldDisplaySelectContentBtn, onItemSelect, onItemDeselect, canSelectContent } = props;
    const item = location.ContentInfo.Content;
    const contentType = contentTypesMap ? contentTypesMap[item.ContentType._href] : null;
    const contentTypeIdentifier = contentType ? contentType.identifier : null;
    const contentTypeName = contentTypeIdentifier ? window.eZ.adminUiConfig.contentTypeNames[contentTypeIdentifier] : TEXT_NOT_AVAILABLE;
    const contentTypeIconUrl = window.eZ.helpers.contentType.getContentTypeIconUrl(contentTypeIdentifier);
    const handleContainerClick = () => onContainerClick(location);
    const selectContentBtn = shouldDisplaySelectContentBtn ? (
        <SelectContentButtonComponent
            location={location}
            onSelect={onItemSelect}
            onDeselect={onItemDeselect}
            canSelectContent={canSelectContent}
        />
    ) : null;

    return (
        <div className="c-content-table-item" onClick={handleContainerClick} tabIndex="-1">
            <div className="c-content-table-item__icon">
                <Icon customPath={contentTypeIconUrl} extraClasses="ez-icon--medium" />
            </div>
            <div className="c-content-table-item__name" title={item.Name}>
                {item.Name}
            </div>
            <div className="c-content-table-item__type" title={contentTypeName}>
                {contentTypeName}
            </div>
            <div className="c-content-table-item__actions">{selectContentBtn}</div>
        </div>
    );
};

ContentTableItemComponent.propTypes = {
    location: PropTypes.object.isRequired,
    onContainerClick: PropTypes.func.isRequired,
    onItemSelect: PropTypes.func.isRequired,
    canSelectContent: PropTypes.func.isRequired,
    onItemDeselect: PropTypes.func.isRequired,
    shouldDisplaySelectContentBtn: PropTypes.bool.isRequired,
};

export default ContentTableItemComponent;
