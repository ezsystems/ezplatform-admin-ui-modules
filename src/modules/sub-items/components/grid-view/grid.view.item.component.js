import React from 'react';
import PropTypes from 'prop-types';

import IconComponent from '../../components/icon/icon.component';
import ICONS from '../../components/icon/icons.constants.json';
import './css/grid.view.item.component.css';

const GridViewItemComponent = (props) => {
    const {content, contentTypesMap, labels} = props;
    const imageField = content.CurrentVersion.Version.Fields.field.find(item => item.fieldDefinitionIdentifier === 'image');
    const imageClassName = 'c-grid-view-item__image';
    let image = <div className={`${imageClassName} ${imageClassName}--none`}>{labels.noImage}</div>;

    if (imageField) {
        image = <img className={imageClassName} src={imageField.fieldValue.uri} alt={`${imageField.fieldValue.path}`} />;
    }

    return (
        <a className="c-grid-view-item" href={`/admin/view/content/${content._id}`}>
            <div className="c-grid-view-item__content-type">
                <IconComponent icon={ICONS.CATEGORY} />
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
    })
};

export default GridViewItemComponent;
