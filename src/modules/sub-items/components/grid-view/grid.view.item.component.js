import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../common/icon/icon';

const GridViewItemComponent = ({ content, location, generateLink, contentTypesMap }) => {
    const imageField = content.CurrentVersion.Version.Fields.field.find((item) => item.fieldTypeIdentifier === 'ezimage');
    const imageClassName = 'c-grid-view-item__image';
    const hasImage = imageField && imageField.fieldValue && imageField.fieldValue.uri && imageField.fieldValue.path;
    const contentType = contentTypesMap ? contentTypesMap[content.ContentType._href] : null;
    const contentTypeIdentifier = contentType ? contentType.identifier : null;
    const contentTypeIconUrl = eZ.helpers.contentType.getContentTypeIconUrl(contentTypeIdentifier);
    let image = (
        <div className={`${imageClassName} ${imageClassName}--none`}>
            <Icon customPath={contentTypeIconUrl} extraClasses="ez-icon--extra-large" />
        </div>
    );
    let contentTypeIcon = '';

    if (hasImage) {
        image = <img className={imageClassName} src={imageField.fieldValue.uri} alt={`${imageField.fieldValue.path}`} />;
        contentTypeIcon = (
            <div className="c-grid-view-item__content-type">
                <Icon customPath={contentTypeIconUrl} extraClasses="ez-icon--small" />
            </div>
        );
    }

    return (
        <a className="c-grid-view-item" href={generateLink(location.id)}>
            {contentTypeIcon}
            <div className="c-grid-view-item__image-wrapper">{image}</div>
            <div className="c-grid-view-item__title">{content.Name}</div>
        </a>
    );
};

GridViewItemComponent.propTypes = {
    content: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    contentTypesMap: PropTypes.object.isRequired,
    generateLink: PropTypes.func.isRequired,
};

export default GridViewItemComponent;
