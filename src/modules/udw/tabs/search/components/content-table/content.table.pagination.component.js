import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

const ContentTablePaginationComponent = ({ minIndex, activeIndex, maxIndex, onChange }) => {
    const btnFirstLabel = Translator.trans(/*@Desc("First")*/ 'pagination.first', {}, 'universal_discovery_widget');
    const btnPrevLabel = Translator.trans(/*@Desc("Previous")*/ 'pagination.prev', {}, 'universal_discovery_widget');
    const btnNextLabel = Translator.trans(/*@Desc("Next")*/ 'pagination.next', {}, 'universal_discovery_widget');
    const btnLastLabel = Translator.trans(/*@Desc("Last")*/ 'pagination.last', {}, 'universal_discovery_widget');
    const btnClass = 'c-content-table-pagination__btn';
    const firstAttrs = {
        type: 'button',
        onClick: useCallback(() => onChange(minIndex), [minIndex, onChange]),
        className: `${btnClass} ${btnClass}--first`,
    };
    const prevAttrs = {
        type: 'button',
        onClick: useCallback(() => onChange(activeIndex - 1), [activeIndex, onChange]),
        className: `${btnClass} ${btnClass}--prev ${btnClass}--middle`,
    };
    const nextAttrs = {
        type: 'button',
        onClick: useCallback(() => onChange(activeIndex + 1), [activeIndex, onChange]),
        className: `${btnClass} ${btnClass}--next ${btnClass}--middle`,
    };
    const lastAttrs = {
        type: 'button',
        onClick: useCallback(() => onChange(maxIndex), [maxIndex, onChange]),
        className: `${btnClass} ${btnClass}--last`,
    };

    if (!maxIndex) {
        return null;
    }

    if (activeIndex === minIndex) {
        firstAttrs.disabled = true;
        prevAttrs.disabled = true;
    }

    if (activeIndex === maxIndex) {
        nextAttrs.disabled = true;
        lastAttrs.disabled = true;
    }

    return (
        <div className="c-content-table-pagination">
            <button {...firstAttrs}>&laquo; {btnFirstLabel}</button>
            <button {...prevAttrs}>&lsaquo; {btnPrevLabel}</button>
            <button {...nextAttrs}>{btnNextLabel} &rsaquo;</button>
            <button {...lastAttrs}>{btnLastLabel} &raquo;</button>
        </div>
    );
};

ContentTablePaginationComponent.propTypes = {
    minIndex: PropTypes.number.isRequired,
    maxIndex: PropTypes.number.isRequired,
    activeIndex: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default ContentTablePaginationComponent;
