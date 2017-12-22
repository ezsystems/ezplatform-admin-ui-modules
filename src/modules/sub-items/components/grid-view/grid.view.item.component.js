import React from 'react';
import PropTypes from 'prop-types';

import './css/grid.view.item.component.css';

const GridViewItemComponent = (props) => {
    const { content, location, generateLink } = props;
    const imageField = content.CurrentVersion.Version.Fields.field.find(item => item.fieldTypeIdentifier === 'ezimage');
    const imageClassName = 'c-grid-view-item__image';
    const hasImage = imageField && imageField.fieldValue && imageField.fieldValue.uri && imageField.fieldValue.path;
    let image = (
        <div className={`${imageClassName} ${imageClassName}--none`}>
            <svg className="ez-icon">
                <use xlinkHref="/bundles/ezplatformadminui/img/ez-icons.svg#file"></use>
            </svg>
        </div>
    );
    let contentTypeIcon = '';

    if (hasImage) {
        image = <img className={imageClassName} src={imageField.fieldValue.uri} alt={`${imageField.fieldValue.path}`} />;
        contentTypeIcon = (
            <div className="c-grid-view-item__content-type">
                <svg className="ez-icon">
                    <use xlinkHref="/bundles/ezplatformadminui/img/ez-icons.svg#file"></use>
                </svg>
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
}

GridViewItemComponent.propTypes = {
    content: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    contentTypesMap: PropTypes.object.isRequired,
    labels: PropTypes.shape({
        noImage: PropTypes.string.isRequired
    }).isRequired,
    generateLink: PropTypes.func.isRequired
};

export default GridViewItemComponent;
