import { showErrorNotification } from '../../common/services/notification.service';
import { getBasicRequestInit, handleRequestResponse, handleRequestResponseStatus } from '../helpers/request.helper.js';

const ENDPOINT_BOOKMARK = '/api/ezp/v2/bookmark';

/**
 * Loads bookmarks
 *
 * @function loadBookmarks
 * @param {Object} restInfo REST config hash containing: token and siteaccess properties
 * @param {Function} callback
 */
export const loadBookmarks = (restInfo, callback) => {
    const basicRequestInit = getBasicRequestInit(restInfo);
    const request = new Request(ENDPOINT_BOOKMARK, {
        ...basicRequestInit,
        method: 'GET',
        headers: {
            ...basicRequestInit.headers,
            Accept: 'application/vnd.ez.api.ContentTypeInfoList+json',
        },
    });

    fetch(request)
        .then(handleRequestResponse)
        .then(callback)
        .catch(showErrorNotification);
};

/**
 * Adds bookmark
 *
 * @function addBookmark
 * @param {Object} restInfo REST config hash containing: token and siteaccess properties
 * @param {String} locationId location id
 * @param {Function} callback
 */
export const addBookmark = (restInfo, locationId, callback) => {
    const basicRequestInit = getBasicRequestInit(restInfo);
    const request = new Request(`${ENDPOINT_BOOKMARK}/${locationId}`, {
        ...basicRequestInit,
        method: 'POST',
    });

    fetch(request)
        .then(handleRequestResponseStatus)
        .then(callback)
        .catch(showErrorNotification);
};

/**
 * Removes bookmark
 *
 * @function removeBookmark
 * @param {Object} restInfo REST config hash containing: token and siteaccess properties
 * @param {String} locationId location id
 * @param {Function} callback
 */
export const removeBookmark = (restInfo, locationId, callback) => {
    const basicRequestInit = getBasicRequestInit(restInfo);
    const request = new Request(`${ENDPOINT_BOOKMARK}/${locationId}`, {
        ...basicRequestInit,
        method: 'DELETE',
    });

    fetch(request)
        .then(handleRequestResponseStatus)
        .then(callback)
        .catch(showErrorNotification);
};

/**
 * Checks if given location is bookmarked
 *
 * @function checkIsBookmarked
 * @param {Object} restInfo REST config hash containing: token and siteaccess properties
 * @param {String} locationId location id
 * @param {Function} callback
 */
export const checkIsBookmarked = (restInfo, locationId, callback) => {
    const basicRequestInit = getBasicRequestInit(restInfo);
    const request = new Request(`${ENDPOINT_BOOKMARK}/${locationId}`, {
        ...basicRequestInit,
        method: 'HEAD',
    });
    const bookmarkedStatusCode = 200;
    const notBookmarkedStatusCode = 404;

    fetch(request)
        .then((response) => {
            const { status } = response;

            if (status === bookmarkedStatusCode || status === notBookmarkedStatusCode) {
                return status === bookmarkedStatusCode;
            }

            handleRequestError(response);
        })
        .then(callback)
        .catch(showErrorNotification);
};
