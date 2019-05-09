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
    const { items, totalCount, perPage, title, noItemsMessage, shouldDisplaySelectContentBtn } = props;
    const { onItemMarked, onItemSelect, checkCanSelectContent, onItemDeselect, selectedContent } = props;
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
    const handlePaginationItemClick = (activePage) => setActivePage(() => activePage);
    const handleItemMarked = useCallback((location) => onItemMarked(location), [onItemMarked]);
    const renderItem = (item) => {
        return (
            <ContentTableItemComponent
                key={item.Location.id}
                location={item.Location}
                onItemMarked={handleItemMarked}
                checkCanSelectContent={checkCanSelectContent}
                onItemSelect={onItemSelect}
                onItemDeselect={onItemDeselect}
                shouldDisplaySelectContentBtn={shouldDisplaySelectContentBtn}
                isSelected={selectedContent.find((contentItem) => contentItem.id === item.Location.id)}
            />
        );
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
        const shouldChangeActivePage = activePage > maxAllowedPageIndex;

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

    const paginationAttrs = {
        minIndex: 0,
        maxIndex: getMaxAllowedPageIndex(totalCount, perPage),
        activeIndex: activePage,
        onChange: handlePaginationItemClick,
    };

    return (
        <div className="c-content-table">
            <div className="c-content-table__title">
                {title} ({totalCount})
            </div>
            {renderNoItemsMessage()}
            {renderHeader()}
            <div className="c-content-table__list">{renderPage()}</div>
            <ContentTablePaginationComponent {...paginationAttrs} />;
        </div>
    );
};

ContentTableComponent.propTypes = {
    items: PropTypes.array.isRequired,
    totalCount: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    noItemsMessage: PropTypes.string,
    shouldDisplaySelectContentBtn: PropTypes.bool.isRequired,
    onItemSelect: PropTypes.func.isRequired,
    onItemDeselect: PropTypes.func.isRequired,
    onItemMarked: PropTypes.func.isRequired,
    checkCanSelectContent: PropTypes.func.isRequired,
    selectedContent: PropTypes.array.isRequired,
};

export default ContentTableComponent;
