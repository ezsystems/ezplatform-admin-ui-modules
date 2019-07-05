import React, { useContext } from 'react';

import MenuButton from '../menu-button/menu.button';

import { SortingContext, SORTING_OPTIONS } from '../../universal.discovery.module';

const SortSwitcher = () => {
    const [sorting, setSorting] = useContext(SortingContext);

    return (
        <div className="c-sort-switcher">
            {SORTING_OPTIONS.map((option) => {
                const extraClasses = option.id === sorting ? 'c-menu-button--selected' : '';
                const onClick = () => {
                    setSorting(option.id);
                };

                return (
                    <MenuButton key={option.id} extraClasses={extraClasses} onClick={onClick}>
                        {option.label}
                    </MenuButton>
                );
            })}
        </div>
    );
};

export default SortSwitcher;
