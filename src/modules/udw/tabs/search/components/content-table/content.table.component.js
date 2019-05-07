import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import ContentTablePaginationComponent from './content.table.pagination.component';
import ContentTableItemComponent from './content.table.item.component';
import ContentTableHeaderComponent from './content.table.header.component';
import LoadingSpinnerComponent from '../../../../../common/loading-spinner/loading.spinner.component';

const splitToPages = (items, perPage) => {
    return items.reduce((pages, item, index) => {
        const pageIndex = Math.floor(index / perPage);

        if (!pages[pageIndex]) {
            pages[pageIndex] = [];
        }

        pages[pageIndex].push(item);

        return pages;
    }, []);
};
const getMaxAllowedPageIndex = (totalCount, perPage) => (!totalCount ? 0 : Math.floor((totalCount - 1) / perPage));

const ContentTableComponent = (props) => {
    const { items, perPage, totalCount, noItemsMessage, title, shouldDisplaySelectContentBtn } = props;
    const { onItemSelect, selectedContent, onSelectContent, canSelectContent, onItemRemove } = props;
    const [activePage, setActivePage] = useState(0);
    const [pages, setPages] = useState({});
    const renderHeader = () => {
        const showHeader = !!items.length;

        if (!showHeader) {
            return null;
        }

        return <ContentTableHeaderComponent />;
    };
    const renderNoItemsMessage = () => {
        if (totalCount || !noItemsMessage) {
            return null;
        }

        return <div className="c-content-table__no-items">{noItemsMessage}</div>;
    };
    const handlePaginationItemClick = (activePage) => setActivePage(activePage);
    const handleItemSelection = useCallback((location) => onItemSelect(location), [onItemSelect]);
    const renderItem = (item) => {
        const location = item.Location;

        return (
            <ContentTableItemComponent
                key={location.id}
                location={location}
                onContainerClick={handleItemSelection}
                selectedContent={selectedContent}
                onItemSelect={onSelectContent}
                canSelectContent={canSelectContent}
                onItemDeselect={onItemRemove}
                shouldDisplaySelectContentBtn={shouldDisplaySelectContentBtn}
            />
        );
    };
    const renderPagination = () => {
        const maxIndex = getMaxAllowedPageIndex(totalCount, perPage);
        const paginationAttrs = {
            minIndex: 0,
            maxIndex,
            activeIndex: activePage,
            onChange: handlePaginationItemClick,
        };

        if (!maxIndex) {
            return null;
        }

        return <ContentTablePaginationComponent {...paginationAttrs} />;
    };
    const renderPage = () => {
        const itemsCount = items.length;
        const neededItemsCount = Math.min((activePage + 1) * perPage, totalCount);
        const allNeededItemsLoaded = itemsCount >= neededItemsCount;

        if (!allNeededItemsLoaded) {
            return <LoadingSpinnerComponent extraClasses="c-content-table__loading-spinner" />;
        }

        if (!itemsCount) {
            return null;
        } else if (pages.hasOwnProperty(activePage)) {
            return pages[activePage].map(renderItem);
        }

        return null;
    };

    useEffect(() => {
        const maxAllowedPageIndex = getMaxAllowedPageIndex(totalCount, perPage);
        const shouldChangeActivePage = activePage <= maxAllowedPageIndex ? activePage : maxAllowedPageIndex;

        if (shouldChangeActivePage) {
            setActivePage(maxAllowedPageIndex);
        }
    }, [activePage, totalCount, perPage]);

    useEffect(() => {
        setPages(splitToPages(items, perPage));
    }, [items, perPage]);

    if (!totalCount) {
        return null;
    }

    return (
        <div className="c-content-table">
            <div className="c-content-table__title">
                {title} ({totalCount})
            </div>
            {renderNoItemsMessage()}
            {renderHeader()}
            <div className="c-content-table__list">{renderPage()}</div>
            {renderPagination()}
        </div>
    );
};

ContentTableComponent.propTypes = {
    items: PropTypes.array.isRequired,
    totalCount: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    noItemsMessage: PropTypes.string,
    requireItemsCount: PropTypes.func.isRequired,
    selectedContent: PropTypes.array.isRequired,
    onItemSelect: PropTypes.func.isRequired,
    onItemRemove: PropTypes.func.isRequired,
    onItemClick: PropTypes.func,
    onSelectContent: PropTypes.func.isRequired,
    canSelectContent: PropTypes.func.isRequired,
    shouldDisplaySelectContentBtn: PropTypes.bool.isRequired,
};

ContentTableComponent.defaultProps = {
    onItemClick: null,
};

export default ContentTableComponent;
