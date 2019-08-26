import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../../../common/icon/icon';

const ContentCreate = ({ isDisabled }) => {
    return (
        <div className="c-content-create">
            <button className="c-content-create__btn btn btn-primary" disabled={isDisabled}>
                <Icon name="create" extraClasses="ez-icon--medium ez-icon--light" />
            </button>
        </div>
    );
};

ContentCreate.propTypes = {
    isDisabled: PropTypes.bool,
};

ContentCreate.defaultProps = {
    isDisabled: false,
};

export default ContentCreate;
