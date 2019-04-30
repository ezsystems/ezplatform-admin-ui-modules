import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../icon/icon';

const LoadingSpinnerComponent = ({ extraClasses }) => {
    const iconClasses = `c-loading-spinner ez-spin ez-icon-x2 ez-icon-spinner ${extraClasses}`;

    return <Icon name="spinner" extraClasses={iconClasses} />;
};

LoadingSpinnerComponent.propTypes = {
    extraClasses: PropTypes.string,
};

LoadingSpinnerComponent.defaultProps = {
    extraClasses: '',
};

export default LoadingSpinnerComponent;
