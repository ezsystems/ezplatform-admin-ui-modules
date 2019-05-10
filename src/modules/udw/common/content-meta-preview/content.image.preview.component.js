import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import LoadingSpinnerComponent from '../../../common/loading-spinner/loading.spinner.component';

const getImageUri = (version) => {
    if (!version) {
        return '';
    }

    const imageField = version.Fields.field.find((field) => field.fieldTypeIdentifier === 'ezimage');

    return imageField && imageField.fieldValue ? imageField.fieldValue.uri : '';
};

const ContentImagePreviewComponent = ({ version }) => {
    if (!version) {
        return <LoadingSpinnerComponent />;
    }

    const imageUri = getImageUri(version);
    const imagePreviewNotAvailableLabel = Translator.trans(
        /*@Desc("Content preview is not available")*/ 'content_meta_preview.image_preview_not_available.info',
        {},
        'universal_discovery_widget'
    );

    if (!imageUri.length) {
        return <Fragment>{imagePreviewNotAvailableLabel}</Fragment>;
    }

    return <img className="c-content-image-preview" src={imageUri} alt="" />;
};

ContentImagePreviewComponent.propTypes = {
    version: PropTypes.shape({
        Fields: PropTypes.shape({
            field: PropTypes.array.isRequired,
        }).isRequired,
    }),
};

ContentImagePreviewComponent.defaultProps = {
    version: null,
};

export default ContentImagePreviewComponent;
