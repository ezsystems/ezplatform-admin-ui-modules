import React from 'react';
import PropTypes from 'prop-types';

import './css/content.table.pagination.component.css';

const ContentTablePaginationComponent = (props) => {
    const { minIndex, activeIndex, maxIndex, onChange } = props;
    const paginationLabels = props.labels.contentTablePagination;
    const btnClass = 'c-content-table-pagination__btn';
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
        <div className="c-content-table-pagination">
            <button {...firstAttrs}>&laquo; {paginationLabels.first}</button>
            <button {...prevAttrs}>&lsaquo; {paginationLabels.prev}</button>
            <button {...nextAttrs}>{paginationLabels.next} &rsaquo;</button>
            <button {...lastAttrs}>{paginationLabels.last} &raquo;</button>
        </div>
    );
};

ContentTablePaginationComponent.propTypes = {
    minIndex: PropTypes.number.isRequired,
    maxIndex: PropTypes.number.isRequired,
    activeIndex: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    labels: PropTypes.shape({
        contentTablePagination: PropTypes.shape({
            first: PropTypes.string.isRequired,
            prev: PropTypes.string.isRequired,
            next: PropTypes.string.isRequired,
            last: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
};

export default ContentTablePaginationComponent;
