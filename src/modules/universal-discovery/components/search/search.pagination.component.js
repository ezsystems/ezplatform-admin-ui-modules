import React from 'react';
import PropTypes from 'prop-types';

import './css/search.pagination.component.css';

const SearchPaginationComponent = (props) => {
        const {minIndex, activeIndex, maxIndex, onChange, labels} = props;
        const btnClass = 'c-search-pagination__btn--';
        const firstAttrs = {
            onClick: () => onChange(minIndex),
            className: `${btnClass}first`
        };

        const prevAttrs = {
            onClick: () => onChange(activeIndex - 1),
            className: `${btnClass}prev`
        };

        const nextAttrs = {
            onClick: () => onChange(activeIndex + 1),
            className: `${btnClass}next`
        };

        const lastAttrs = {
            onClick: () => onChange(maxIndex),
            className: `${btnClass}last`
        };

        if (activeIndex === minIndex) {
            firstAttrs.disabled = true;
            prevAttrs.disabled = true;
        }

        if (activeIndex === maxIndex) {
            nextAttrs.disabled = true;
            lastAttrs.disabled = true;
        }

        return (
            <div className="c-search-pagination">
                <button {...firstAttrs}>&laquo; {labels.first}</button>
                <button {...prevAttrs}>&lsaquo; {labels.prev}</button>
                <button {...nextAttrs}>{labels.next} &rsaquo;</button>
                <button {...lastAttrs}>{labels.last} &raquo;</button>
            </div>
        );
}

SearchPaginationComponent.propTypes = {
    minIndex: PropTypes.number.isRequired,
    maxIndex: PropTypes.number.isRequired,
    activeIndex: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    labels: PropTypes.shape({
        first: PropTypes.string.isRequired,
        prev: PropTypes.string.isRequired,
        next: PropTypes.string.isRequired,
        last: PropTypes.string.isRequired
    }).isRequired
};

export default SearchPaginationComponent;
