import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../common/icon/icon';

const LoadingSpinnerComponent = ({ extraClasses }) => {
    const iconClasses = `${extraClasses} c-loading-spinner ez-spin ez-icon-x2 ez-icon-spinner`;

    return <Icon name="spinner" extraClasses={iconClasses} />;
};

LoadingSpinnerComponent.propTypes = {
    extraClasses: PropTypes.string,
};

LoadingSpinnerComponent.defaultProps = {
    extraClasses: '',
};

export default LoadingSpinnerComponent;
