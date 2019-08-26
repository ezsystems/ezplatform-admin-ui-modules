import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import MenuButton from '../menu-button/menu.button';

import { createCssClassNames } from '../../../common/helpers/css.class.names';
import { SortingContext, SORTING_OPTIONS } from '../../universal.discovery.module';

const SortSwitcher = ({ isDisabled }) => {
    const [sorting, setSorting] = useContext(SortingContext);
    const className = createCssClassNames({
        'c-sort-switcher': true,
        'c-sort-switcher--disabled': isDisabled,
    });

    return (
        <div className={className}>
            {SORTING_OPTIONS.map((option) => {
                const extraClasses = option.id === sorting ? 'c-menu-button--selected' : '';
                const onClick = () => {
                    setSorting(option.id);
                };

                return (
                    <MenuButton key={option.id} extraClasses={extraClasses} onClick={onClick} isDisabled={isDisabled}>
                        {option.label}
                    </MenuButton>
                );
            })}
        </div>
    );
};

SortSwitcher.propTypes = {
    isDisabled: PropTypes.bool,
};

SortSwitcher.defaultProps = {
    isDisabled: false,
};

export default SortSwitcher;
