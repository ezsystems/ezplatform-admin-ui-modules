import React from 'react';
import PropTypes from 'prop-types';

import './css/grid.view.item.component.css';

const GridViewItemComponent = (props) => {
    const {content, contentTypesMap, labels, locationViewLink, location} = props;
    const imageField = content.CurrentVersion.Version.Fields.field.find(item => item.fieldTypeIdentifier === 'ezimage');
    const imageClassName = 'c-grid-view-item__image';
    let image = <div className={`${imageClassName} ${imageClassName}--none`}>{labels.noImage}</div>;

    if (imageField && imageField.fieldValue && imageField.fieldValue.uri && imageField.fieldValue.path) {
        image = <img className={imageClassName} src={imageField.fieldValue.uri} alt={`${imageField.fieldValue.path}`} />;
    }

    return (
        <a className="c-grid-view-item" href={locationViewLink.replace('{{locationId}}', location.id)}>
            <div className="c-grid-view-item__content-type">
                <svg className="ez-icon">
                    <use xlinkHref="/bundles/ezplatformadminui/img/ez-icons.svg#category"></use>
                </svg>
                {contentTypesMap[content.ContentType._href].identifier}
            </div>
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
    locationViewLink: PropTypes.string.isRequired
};

export default GridViewItemComponent;
