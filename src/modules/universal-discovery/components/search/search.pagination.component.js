import React from 'react';
import PropTypes from 'prop-types';

import './css/search.pagination.component.css';

const SearchPaginationComponent = (props) => {
    console.warn('[DEPRECATED] SearchPaginationComponent is deprecated');
    console.warn('[DEPRECATED] it will be removed from ezplatform-admin-ui-modules 2.0');
    console.warn('[DEPRECATED] use ContentTablePaginationComponent instead');

    const { minIndex, activeIndex, maxIndex, onChange } = props;
    const btnFirstLabel = Translator.trans(/*@Desc("First")*/ 'pagination.first', {}, 'universal_discovery_widget');
    const btnPrevLabel = Translator.trans(/*@Desc("Previous")*/ 'pagination.prev', {}, 'universal_discovery_widget');
    const btnNextLabel = Translator.trans(/*@Desc("Next")*/ 'pagination.next', {}, 'universal_discovery_widget');
    const btnLastLabel = Translator.trans(/*@Desc("Last")*/ 'pagination.last', {}, 'universal_discovery_widget');
    const btnClass = 'c-search-pagination__btn';
    const firstAttrs = {
        onClick: () => onChange(minIndex),
        className: `${btnClass}--first`,
    };

    const prevAttrs = {
        onClick: () => onChange(activeIndex - 1),
        className: `${btnClass}--prev ${btnClass}--middle`,
    };

    const nextAttrs = {
        onClick: () => onChange(activeIndex + 1),
        className: `${btnClass}--next ${btnClass}--middle`,
    };

    const lastAttrs = {
        onClick: () => onChange(maxIndex),
        className: `${btnClass}--last`,
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
            <button {...firstAttrs}>&laquo; {btnFirstLabel}</button>
            <button {...prevAttrs}>&lsaquo; {btnPrevLabel}</button>
            <button {...nextAttrs}>{btnNextLabel} &rsaquo;</button>
            <button {...lastAttrs}>{btnLastLabel} &raquo;</button>
        </div>
    );
};

SearchPaginationComponent.propTypes = {
    minIndex: PropTypes.number.isRequired,
    maxIndex: PropTypes.number.isRequired,
    activeIndex: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default SearchPaginationComponent;
