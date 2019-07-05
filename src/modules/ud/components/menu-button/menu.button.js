import React from 'react';
import PropTypes from 'prop-types';

import { createCssClassNames } from '../../../common/helpers/css.class.names';

const MenuButton = ({ extraClasses, onClick, children }) => {
    const className = createCssClassNames({
        'c-menu-button': true,
        [extraClasses]: !!extraClasses,
    });

    return (
        <button className={className} onClick={onClick}>
            {children}
        </button>
    );
};

MenuButton.propTypes = {
    extraClasses: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    children: PropTypes.any,
};

MenuButton.defaultProps = {
    children: [],
    extraClasses: '',
};

export default MenuButton;
