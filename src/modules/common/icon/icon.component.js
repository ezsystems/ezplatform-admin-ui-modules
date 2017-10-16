import React from 'react';
import PropTypes from 'prop-types';

import './css/icon.component.css';

const IconComponent = props => {
    return (
        <svg className="c-icon" width={`${props.width}px`} height={`${props.height}px`} viewBox="0 0 1024 1024" transform="rotate(180 0 0) scale(-1,1)">
            <path d={props.icon}></path>
        </svg>
    );
};

IconComponent.propTypes = {
    icon: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number
};

IconComponent.defaultProps = {
    width: 16,
    height: 16,
};

export default IconComponent;
