import React from 'react';
import PropTypes from 'prop-types';

import PaginationButtonComponent from './pagination.button.component';

const DOTS = '...';

/**
 * Computes array with pagination pages.
 *
 * Example 1: [ 1, "...", 5, 6, 7, 8, 9, 10 ] (for: proximity = 2; pagesNumber = 10; activePageIndex = 7)
 * Example 2: [ 1, "...", 3, 4, 5, 6, 7, "...", 10 ] (for: proximity = 2; pagesNumber = 10; activePageIndex = 5)
 * Example 3: [ 1, "...", 8, 9, 10, 11, 12, "...", 20 ] (for: proximity = 2; pagesNumber = 20; activePageIndex = 10)
 *
 * @param {Object} params
 * @param {Number} params.proximity
 * @param {Number} params.activePageIndex
 * @param {Number} params.pagesNumber
 *
 * @returns {Array}
 */
const computePages = ({ proximity, activePageIndex, pagesNumber }) => {
    const pages = [];
    let wereDots = false;

    for (let i = 1; i <= pagesNumber; i++) {
        const isFirstPage = i === 1;
        const isLastPage = i === pagesNumber;
        const isInRange = i >= activePageIndex + 1 - proximity && i <= activePageIndex + 1 + proximity;

        if (isFirstPage || isLastPage || isInRange) {
            pages.push(i);
            wereDots = false;
        } else if (!wereDots) {
            pages.push(DOTS);
            wereDots = true;
        }
    }

    return pages;
};

const PaginationComponent = ({ totalCount, itemsPerPage, proximity, activePageIndex, onPageChange }) => {
    const pagesNumber = Math.ceil(totalCount / itemsPerPage);
    const backLabel = Translator.trans(/*@Desc("Back")*/ 'pagination.back', {}, 'sub_items');
    const nextLabel = Translator.trans(/*@Desc("Next")*/ 'pagination.next', {}, 'sub_items');
    const previousPage = activePageIndex - 1;
    const nextPage = activePageIndex + 1;
    const isFirstPage = activePageIndex === 0;
    const isLastPage = activePageIndex + 1 === pagesNumber;
    const pages = computePages({ proximity, activePageIndex, pagesNumber });
    const pagesElements = pages.map((page, index) => {
        if (page === DOTS) {
            return <PaginationButtonComponent key={index} label={DOTS} disabled={true} />;
        }

        const isCurrentPage = page === activePageIndex + 1;
        const additionalClasses = isCurrentPage ? 'active' : '';
        const label = '' + page;

        return (
            <PaginationButtonComponent
                key={page}
                page={page - 1}
                label={label}
                additionalClasses={additionalClasses}
                onPageChange={onPageChange}
            />
        );
    });

    return (
        <ul className="c-pagination pagination row justify-content-center">
            <PaginationButtonComponent
                page={previousPage}
                label={backLabel}
                additionalClasses="prev"
                disabled={isFirstPage}
                onPageChange={onPageChange}
            />
            {pagesElements}
            <PaginationButtonComponent
                page={nextPage}
                label={nextLabel}
                additionalClasses="next"
                disabled={isLastPage}
                onPageChange={onPageChange}
            />
        </ul>
    );
};

PaginationComponent.propTypes = {
    proximity: PropTypes.number.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    activePageIndex: PropTypes.number.isRequired,
    totalCount: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default PaginationComponent;
