import React, { useState, useEffect, useReducer, createContext } from 'react';

export const SelectedContentTypesContext = createContext();
export const SelectedSectionContext = createContext();
export const SelectedSubtreeContext = createContext();

import Icon from '../../../common/icon/icon';
import ContentTable from '../content-table/content.table';
import Filters from '../filters/filters';
import { useSearchByQueryFetch } from '../../hooks/useSearchByQueryFetch';

const ENTER_CHAR_CODE = 13;

const selectedContentTypesReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_CONTENT_TYPE':
            return [...state, action.contentTypeIdentifier];
        case 'REMOVE_CONTENT_TYPE':
            return state.filter((contentTypeIdentifier) => contentTypeIdentifier !== action.contentTypeIdentifier);
        case 'CLEAR_CONTENT_TYPES':
            return [];
        default:
            throw new Error();
    }
};

const Search = () => {
    const [searchText, setSearchText] = useState('');
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [filtersCollapsed, setFiltersCollapsed] = useState(true);
    const [selectedContentTypes, dispatchSelectedContentTypesAction] = useReducer(selectedContentTypesReducer, []);
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedSubtree, setSelectedSubtree] = useState('');
    const [isLoading, data, searchByQuery] = useSearchByQueryFetch();
    const updateSearchQuery = ({ target: { value } }) => setSearchText(value);
    const search = (forcedOffset) => {
        if (!searchText) {
            return;
        }

        if (forcedOffset !== undefined && forcedOffset !== offset) {
            setOffset(forcedOffset);

            return;
        }

        searchByQuery(searchText, [...selectedContentTypes], selectedSection, selectedSubtree, limit, offset);
    };
    const handleKeyPressed = ({ charCode }) => {
        if (charCode === ENTER_CHAR_CODE) {
            search(0);
        }
    };
    const changePage = (pageIndex) => setOffset(pageIndex * limit);
    const toggleFiltersCollapsed = () => setFiltersCollapsed((prevState) => !prevState);
    const renderSearchResults = () => {
        const title = `Search results (${data.count})`;

        if (data.count) {
            return (
                <ContentTable
                    count={data.count}
                    items={data.items}
                    itemsPerPage={limit}
                    activePageIndex={offset ? offset / limit : 0}
                    title={title}
                    onPageChange={changePage}
                />
            );
        } else if (!!data.items) {
            return (
                <div className="c-search__no-results">
                    <div className="c-search__no-results-title">{title}</div>
                    <table className="table">
                        <tbody>
                            <tr>
                                <td>
                                    <span>{`Sorry, no results were found for "${searchText}".`}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <h6>Some helpful search tips:</h6>
                    <ul>
                        <li>Check spelling of keywords.</li>
                        <li>Try different keywords.</li>
                        <li>Try more general keywords.</li>
                        <li>Try fewer keywords. Reducing keywords result in more matches.</li>
                    </ul>
                </div>
            );
        }
    };

    useEffect(search, [offset]);

    return (
        <div className="c-search">
            <div className="c-search__tools-wrapper">
                <div className="c-search__input-wrapper">
                    <input
                        type="search"
                        className="c-search__input form-control"
                        onChange={updateSearchQuery}
                        onKeyPress={handleKeyPressed}
                        value={searchText}
                    />
                    <button className="c-search__search-btn btn btn-primary" onClick={search.bind(this, 0)}>
                        <Icon name="search" extraClasses="ez-icon--small-medium ez-icon--light" />
                        Search
                    </button>
                </div>
                <div className="c-search__filters-btn-wrapper">
                    <button className="c-search__toggle-filters-btn btn btn-dark" onClick={toggleFiltersCollapsed}>
                        <Icon name="filters" extraClasses="ez-icon--small-medium ez-icon--light" />
                        Filters
                    </button>
                </div>
            </div>
            <SelectedContentTypesContext.Provider value={[selectedContentTypes, dispatchSelectedContentTypesAction]}>
                <SelectedSectionContext.Provider value={[selectedSection, setSelectedSection]}>
                    <SelectedSubtreeContext.Provider value={[selectedSubtree, setSelectedSubtree]}>
                        <Filters isCollapsed={filtersCollapsed} search={search} />
                    </SelectedSubtreeContext.Provider>
                </SelectedSectionContext.Provider>
            </SelectedContentTypesContext.Provider>
            {renderSearchResults()}
        </div>
    );
};

export default Search;
