import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../common/icon/icon';

const ContentTypeIconComponent = ({ identifier }) => {
    if (!identifier) {
        return null;
    }

    const contentTypeIconUrl = eZ.helpers.contentType.getContentTypeIconUrl(identifier);

    return <Icon customPath={contentTypeIconUrl} extraClasses="c-content-type-icon ez-icon--small" />;
};

ContentTypeIconComponent.propTypes = {
    identifier: PropTypes.string,
};

export default ContentTypeIconComponent;
