import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Icon from '../../../common/icon/icon';

import { createCssClassNames } from '../../../common/helpers/css.class.names';
import { useLoadBookmarksFetch } from '../../hooks/useLoadBookmarksFetch';
import { ContentTypesMapContext, MarkedLocationContext, LoadedLocationsMapContext } from '../../universal.discovery.module';

// @TODO
const HARDCODED_LIMIT = 50;

const SCROLL_OFFSET = 200;

const BookmarksList = ({ setBookmarkedLocationMarked }) => {
    const [offset, setOffset] = useState(0);
    const [bookmarks, setBookmarks] = useState([]);
    const [markedLocation, setMarkedLocation] = useContext(MarkedLocationContext);
    const [loadedLocationsMap, dispatchLoadedLocationsAction] = useContext(LoadedLocationsMapContext);
    const [data, isLoading] = useLoadBookmarksFetch(HARDCODED_LIMIT, offset);
    const contentTypesMap = useContext(ContentTypesMapContext);
    const loadMore = ({ target }) => {
        const areAllItemsLoaded = bookmarks.length >= data.count;
        const isOffsetReached = target.scrollHeight - target.clientHeight - target.scrollTop < SCROLL_OFFSET;

        if (areAllItemsLoaded || !isOffsetReached || isLoading) {
            return;
        }

        setOffset(offset + HARDCODED_LIMIT);
    };
    const renderLoadingSpinner = () => {
        if (!isLoading) {
            return null;
        }

        return (
            <div className="c-bookmarks-list__spinner-wrapper">
                <Icon name="spinner" extraClasses="m-sub-items__spinner ez-icon--medium ez-spin" />
            </div>
        );
    };

    useEffect(() => {
        if (isLoading) {
            return;
        }

        setBookmarks((prevState) => [...prevState, ...data.items]);
    }, [data.items, isLoading]);

    if (!bookmarks.length) {
        return null;
    }

    return (
        <div className="c-bookmarks-list" onScroll={loadMore}>
            {bookmarks.map((bookmark) => {
                const isMarked = bookmark.id === markedLocation;
                const className = createCssClassNames({
                    'c-bookmarks-list__item': true,
                    'c-bookmarks-list__item--marked': isMarked,
                });
                const markLocation = () => {
                    if (isMarked) {
                        return;
                    }

                    dispatchLoadedLocationsAction({ type: 'CLEAR_LOCATIONS' });
                    setBookmarkedLocationMarked(bookmark.id);
                };

                return (
                    <div key={bookmark.id} className={className} onClick={markLocation}>
                        <Icon
                            extraClasses="ez-icon--small"
                            customPath={contentTypesMap[bookmark.ContentInfo.Content.ContentType._href].thumbnail}
                        />
                        <span className="c-bookmarks-list__item-name">{bookmark.ContentInfo.Content.Name}</span>
                    </div>
                );
            })}
            {renderLoadingSpinner()}
        </div>
    );
};

BookmarksList.propTypes = {
    setBookmarkedLocationMarked: PropTypes.func.isRequired,
};

export default BookmarksList;
