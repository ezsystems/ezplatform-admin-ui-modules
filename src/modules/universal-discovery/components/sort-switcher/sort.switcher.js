import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import MenuButton from '../menu-button/menu.button';

import { createCssClassNames } from '../../../common/helpers/css.class.names';
import { SortingContext, SortOrderContext, SORTING_OPTIONS } from '../../universal.discovery.module';

const SortSwitcher = ({ isDisabled }) => {
    const [sorting, setSorting] = useContext(SortingContext);
    const [sortOrder, setSortOrder] = useContext(SortOrderContext);

    const ascendingOrder = 'ascending';
    const descendingOrder = 'descending';
    const className = createCssClassNames({
        'c-sort-switcher': true,
        'c-sort-switcher--disabled': isDisabled,
    });

    return (
        <div className={className}>
            {SORTING_OPTIONS.map((option) => {
                const extraClasses = createCssClassNames({
                    'c-menu-button--selected': option.sortClause === sorting,
                    'c-menu-button--sorted-asc': sortOrder === ascendingOrder,
                    'c-menu-button--sorted-desc': sortOrder === descendingOrder,
                });
                const onClick = () => {
                    setSorting(option.sortClause);

                    if (sorting === option.sortClause) {
                        setSortOrder(sortOrder === ascendingOrder ? descendingOrder : ascendingOrder);
                    }
                };

                return (
                    <MenuButton key={option.sortClause} extraClasses={extraClasses} onClick={onClick} isDisabled={isDisabled}>
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
