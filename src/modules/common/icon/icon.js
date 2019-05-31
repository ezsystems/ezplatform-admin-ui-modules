import React from 'react';
import PropTypes from 'prop-types';

const Icon = (props) => {
    const linkHref = props.customPath ? props.customPath : `/bundles/ezplatformadminui/img/ez-icons.svg#${props.name}`;
    let className = 'ez-icon';

    if (props.extraClasses) {
        className = `${className} ${props.extraClasses}`;
    }

    return (
        <svg className={className} style={props.style}>
            <use xlinkHref={linkHref} />
        </svg>
    );
};

Icon.propTypes = {
    extraClasses: PropTypes.string.isRequired,
    name: PropTypes.string,
    customPath: PropTypes.string,
    style: PropTypes.object,
};

Icon.defaultProps = {
    customPath: null,
    name: null,
    style: null,
};

export default Icon;
