import React from 'react';
import PropTypes from 'prop-types';

import { createCssClassNames } from '../../../common/helpers/css.class.names';

const MenuButton = ({ extraClasses, onClick, isDisabled, children }) => {
    const className = createCssClassNames({
        'c-menu-button': true,
        [extraClasses]: !!extraClasses,
    });

    return (
        <button className={className} onClick={onClick} disabled={isDisabled}>
            {children}
        </button>
    );
};

MenuButton.propTypes = {
    extraClasses: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool,
    children: PropTypes.any,
};

MenuButton.defaultProps = {
    children: [],
    extraClasses: '',
    isDisabled: false,
};

export default MenuButton;
