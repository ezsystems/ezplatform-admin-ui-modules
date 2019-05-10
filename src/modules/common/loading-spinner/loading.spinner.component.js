import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../icon/icon';
import { createCssClassNames } from '../css-class-names/css.class.names';

const LoadingSpinnerComponent = ({ extraClasses }) => {
    const iconClasses = createCssClassNames({
        'c-loading-spinner ez-spin': true,
        [extraClasses]: !!extraClasses.length,
    });

    return <Icon name="spinner" extraClasses={iconClasses} />;
};

LoadingSpinnerComponent.propTypes = {
    extraClasses: PropTypes.string,
};

LoadingSpinnerComponent.defaultProps = {
    extraClasses: '',
};

export default LoadingSpinnerComponent;
