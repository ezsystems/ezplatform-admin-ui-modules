import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../../../common/icon/icon';
import ContentTableComponent from '../content-table/content.table.component';
import LoadingSpinnerComponent from '../../../../../common/loading-spinner/loading.spinner.component';
import { restInfo } from '../../../../../common/rest-info/rest.info';
import { findContentBySearchQuery } from '../../../../services/universal.discovery.service';
import { classnames } from '../../../../../common/classnames/classnames';

const TEXT_SEARCH_COMPONENT_TITLE = Translator.trans(/*@Desc("Search")*/ 'search.title', {}, 'search');
const TEXT_CANNOT_FIND_ITEMS = Translator.trans(/*@Desc("Cannot find content")*/ 'search.cannot.find.content', {}, 'search');
const TEXT_SEARCH_TIPS_TITLE = Translator.trans(/*@Desc("Some helpful search tips:")*/ 'search.tips.headline', {}, 'search');
const TEXT_SEARCH_BTN_LABEL = Translator.trans(/*@Desc("Search")*/ 'search.submit.label', {}, 'search');
const TEXT_RESULTS_TABLE_TITLE = Translator.trans(/*@Desc("Search results")*/ 'search.content_table.title', {}, 'search');
const TEXT_SEARCH_TIP_CHECK_SPELLING = Translator.trans(
    /*@Desc("Check spelling of keywords.")*/ 'search.tips.check_spelling',
    {},
    'search'
);
const TEXT_SEARCH_TIP_DIFFERENT_KEYWORDS = Translator.trans(
    /*@Desc("Try different keywords.")*/ 'search.tips.different_keywords',
    {},
    'search'
);
const TEXT_SEARCH_TIP_MORE_GENERAL_KEYWORDS = Translator.trans(
    /*@Desc("Try more general keywords.")*/ 'search.tips.more_general_keywords',
    {},
    'search'
);
const TEXT_SEARCH_TIP_FEWER_KEYWORDS = Translator.trans(
    /*@Desc("Try fewer keywords. Reducing keywords result in more matches.")*/ 'search.tips.fewer_keywords',
    {},
    'search'
);

const SearchComponent = (props) => {
    const {
        maxHeight,
        onItemMarked,
        onItemSelect,
        onItemDeselect,
        selectedContent,
        checkCanSelectContent,
        multiple,
        searchResultsPerPage,
        searchResultsLimit,
    } = props;
    const [items, setItems] = useState(null);
    const [lastSearchText, setLastSearchText] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const refSearchInput = useRef(null);
    const searchContent = (event) => {
        const isClickEvent = event.nativeEvent.type === 'click';
        const isEnterKeyEvent = event.nativeEvent.type === 'keyup' && event.nativeEvent.keyCode === 13;

        if (isSubmitDisabled || (!isClickEvent && !isEnterKeyEvent)) {
            return;
        }

        const searchText = refSearchInput.current.value;

        setIsSearching(true);
        setLastSearchText(searchText);

        const promise = new Promise((resolve) => findContentBySearchQuery(restInfo, searchText, resolve, searchResultsLimit));

        promise.then(updateItemsState).catch(() => window.eZ.helpers.notification.showErrorNotification(TEXT_CANNOT_FIND_ITEMS));
    };
    const updateItemsState = (response) => {
        setItems(response.View.Result.searchHits.searchHit.map((item) => item.value));
        setIsSearching(false);
    };
    const renderSubmitBtn = () => {
        const svgExtraClasses = 'ez-icon--small ez-icon--light';
        const btnAttrs = {
            className: classnames({
                'c-search__submit': true,
                'c-search__submit--loading': isSearching,
            }),
            type: 'button',
        };
        let icon = <Icon name="search" extraClasses={svgExtraClasses} />;

        if (isSearching) {
            btnAttrs.disabled = true;
            icon = <LoadingSpinnerComponent extraClasses={svgExtraClasses} />;
        } else if (isSubmitDisabled) {
            btnAttrs.disabled = true;
        } else {
            btnAttrs.onClick = searchContent;
        }

        return (
            <button {...btnAttrs}>
                {icon}
                {!isSearching && TEXT_SEARCH_BTN_LABEL}
            </button>
        );
    };
    const toggleSubmitButtonState = () => setIsSubmitDisabled(!refSearchInput.current.value.trim().length);
    const renderSearchTips = () => {
        if (items === null || items.length) {
            return null;
        }

        return (
            <div className="c-search__search-tips">
                <h6>{TEXT_SEARCH_TIPS_TITLE}</h6>
                <ul>
                    <li>{TEXT_SEARCH_TIP_CHECK_SPELLING}</li>
                    <li>{TEXT_SEARCH_TIP_DIFFERENT_KEYWORDS}</li>
                    <li>{TEXT_SEARCH_TIP_MORE_GENERAL_KEYWORDS}</li>
                    <li>{TEXT_SEARCH_TIP_FEWER_KEYWORDS}</li>
                </ul>
            </div>
        );
    };
    const renderResultsTable = () => {
        if (!items) {
            return null;
        }

        const noItemsMessage = Translator.trans(
            /*@Desc("Sorry, no results were found for ""%query%"".")*/ 'search.no_result',
            { query: lastSearchText },
            'search'
        );

        return (
            <ContentTableComponent
                items={items}
                totalCount={items.length}
                perPage={searchResultsPerPage}
                title={TEXT_RESULTS_TABLE_TITLE}
                onItemSelect={onItemSelect}
                selectedContent={selectedContent}
                checkCanSelectContent={checkCanSelectContent}
                onItemMarked={onItemMarked}
                onItemDeselect={onItemDeselect}
                shouldDisplaySelectContentBtn={!multiple}
                noItemsMessage={noItemsMessage}
            />
        );
    };

    return (
        <div className="c-search" style={{ maxHeight: `${maxHeight - 32}px` }}>
            <div className="c-search__title">{TEXT_SEARCH_COMPONENT_TITLE}:</div>
            <div className="c-search__form">
                <input
                    className="c-search__input"
                    type="text"
                    ref={refSearchInput}
                    onKeyUp={searchContent}
                    onChange={toggleSubmitButtonState}
                />
                {renderSubmitBtn()}
            </div>
            {renderResultsTable()}
            {renderSearchTips()}
        </div>
    );
};

SearchComponent.propTypes = {
    onItemMarked: PropTypes.func.isRequired,
    maxHeight: PropTypes.number.isRequired,
    searchResultsPerPage: PropTypes.number.isRequired,
    searchResultsLimit: PropTypes.number.isRequired,
    onItemSelect: PropTypes.func.isRequired,
    checkCanSelectContent: PropTypes.func.isRequired,
    onItemDeselect: PropTypes.func.isRequired,
    multiple: PropTypes.bool.isRequired,
};

export default SearchComponent;
