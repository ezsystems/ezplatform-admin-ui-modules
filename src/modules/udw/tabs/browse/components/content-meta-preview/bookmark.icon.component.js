import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../../../common/icon/icon';
import LoadingSpinnerComponent from '../../../../../common/loading-spinner/loading.spinner.component';
import { showErrorNotification } from '../../../../../common/services/notification.service';
import { checkIsBookmarked, addBookmark, removeBookmark } from '../../../../services/bookmark.service';
import { restInfo } from '../../../../../common/rest-info/rest.info';

const BookmarkIconComponent = ({ locationId }) => {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isCheckingBookmarkedStatus, setIsCheckingBookmarkedStatus] = useState(false);
    /**
     * Required to change a bookmark state while in a location view of a bookmarked item
     *
     * @function dispatchBookmarkChangeEvent
     */
    const dispatchBookmarkChangeEvent = () => {
        const event = new CustomEvent('ez-bookmark-change', { detail: { bookmarked: isBookmarked, locationId } });

        document.body.dispatchEvent(event);
    };
    const toggleBookmark = () => {
        setIsCheckingBookmarkedStatus(true);

        const bookmarkAction = isBookmarked ? removeBookmark : addBookmark;
        const bookmarkToggled = new Promise((resolve) => bookmarkAction(restInfo, locationId, resolve));

        bookmarkToggled
            .then(() => {
                setIsBookmarked(!isBookmarked);
                setIsCheckingBookmarkedStatus(false);
            })
            .catch(showErrorNotification);
    };
    const bookmarkIconId = isBookmarked ? 'bookmark-active' : 'bookmark';
    const action = isBookmarked ? 'remove' : 'add';
    const iconExtraClasses = 'ez-icon--medium ez-icon--secondary';
    const btnAttrs = {
        type: 'button',
        className: `c-bookmark-icon c-bookmark-icon--${action}`,
        onClick: toggleBookmark,
        disabled: isCheckingBookmarkedStatus,
    };

    useEffect(dispatchBookmarkChangeEvent, [isBookmarked]);
    useEffect(() => {
        setIsCheckingBookmarkedStatus(true);
        checkIsBookmarked(restInfo, locationId, (isBookmarked) => {
            setIsBookmarked(isBookmarked);
            setIsCheckingBookmarkedStatus(false);
        });
    }, [locationId]);

    const icon = isCheckingBookmarkedStatus ? (
        <LoadingSpinnerComponent extraClasses={iconExtraClasses} />
    ) : (
        <Icon name={bookmarkIconId} extraClasses={iconExtraClasses} />
    );

    return <button {...btnAttrs}>{icon}</button>;
};

BookmarkIconComponent.propTypes = {
    locationId: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
};

export default BookmarkIconComponent;
