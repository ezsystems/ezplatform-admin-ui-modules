import { showErrorNotification } from '../../common/services/notification.service';
import { handleRequestResponse, handleRequestResponseStatus } from '../../common/helpers/request.helper.js';

const HEADERS_CREATE_VIEW = {
    Accept: 'application/vnd.ez.api.View+json; version=1.1',
    'Content-Type': 'application/vnd.ez.api.ViewInput+json; version=1.1',
};
const ENDPOINT_CREATE_VIEW = '/api/ezp/v2/views';
const ENDPOINT_BOOKMARK = '/api/ezp/v2/bookmark';

export const QUERY_LIMIT = 50;

export const findLocationsByParentLocationId = (
    { token, siteaccess, parentLocationId, limit = QUERY_LIMIT, offset = 0, sortClauses = { SectionIdentifier: 'ascending' } },
    callback
) => {
    const body = JSON.stringify({
        ViewInput: {
            identifier: `udw-locations-by-parent-location-id-${parentLocationId}`,
            public: false,
            LocationQuery: {
                Criteria: {},
                FacetBuilders: {},
                SortClauses: sortClauses,
                Filter: { ParentLocationIdCriterion: parentLocationId },
                limit,
                offset,
            },
        },
    });
    const request = new Request(ENDPOINT_CREATE_VIEW, {
        method: 'POST',
        headers: { ...HEADERS_CREATE_VIEW, 'X-Siteaccess': siteaccess, 'X-CSRF-Token': token },
        body,
        mode: 'same-origin',
        credentials: 'same-origin',
    });

    fetch(request)
        .then(handleRequestResponse)
        .then((response) => {
            const items = response.View.Result.searchHits.searchHit.map((searchHit) => searchHit.value.Location);

            callback({
                parentLocationId,
                offset,
                items,
            });
        })
        .catch(showErrorNotification);
};

export const findLocationsBySearchQuery = ({ token, siteaccess, query, limit = QUERY_LIMIT, offset = 0 }, callback) => {
    const body = JSON.stringify({
        ViewInput: {
            identifier: `udw-locations-by-search-query-${query}`,
            public: false,
            LocationQuery: {
                Criteria: {},
                FacetBuilders: {},
                SortClauses: {},
                Query: query,
                limit,
                offset,
            },
        },
    });
    const request = new Request(ENDPOINT_CREATE_VIEW, {
        method: 'POST',
        headers: { ...HEADERS_CREATE_VIEW, 'X-Siteaccess': siteaccess, 'X-CSRF-Token': token },
        body,
        mode: 'same-origin',
        credentials: 'same-origin',
    });

    fetch(request)
        .then(handleRequestResponse)
        .then((response) => {
            const { count, searchHits } = response.View.Result;
            const items = searchHits.searchHit.map((searchHit) => searchHit.value.Location);

            callback({
                items,
                count,
            });
        })
        .catch(showErrorNotification);
};

export const findLocationsById = ({ token, siteaccess, id, limit = QUERY_LIMIT, offset = 0 }, callback) => {
    const body = JSON.stringify({
        ViewInput: {
            identifier: `udw-locations-by-id-${id}`,
            public: false,
            LocationQuery: {
                Criteria: {},
                FacetBuilders: {},
                SortClauses: { SectionIdentifier: 'ascending' },
                Filter: { LocationIdCriterion: id },
                limit,
                offset,
            },
        },
    });
    const request = new Request(ENDPOINT_CREATE_VIEW, {
        method: 'POST',
        headers: { ...HEADERS_CREATE_VIEW, 'X-Siteaccess': siteaccess, 'X-CSRF-Token': token },
        body,
        mode: 'same-origin',
        credentials: 'same-origin',
    });

    fetch(request)
        .then(handleRequestResponse)
        .then((response) => {
            const items = response.View.Result.searchHits.searchHit.map((searchHit) => searchHit.value.Location);

            callback(items);
        })
        .catch(showErrorNotification);
};

export const loadBookmarks = ({ token, siteaccess, limit, offset }, callback) => {
    const request = new Request(`${ENDPOINT_BOOKMARK}?limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: {
            'X-Siteaccess': siteaccess,
            'X-CSRF-Token': token,
            Accept: 'application/vnd.ez.api.ContentTypeInfoList+json',
        },
        mode: 'same-origin',
        credentials: 'same-origin',
    });

    fetch(request)
        .then(handleRequestResponse)
        .then((response) => {
            const count = response.BookmarkList.count;
            const items = response.BookmarkList.items.map((item) => item.Location);

            callback({ count, items });
        })
        .catch(showErrorNotification);
};

const toggleBookmark = ({ siteaccess, token, locationId }, callback, method) => {
    const request = new Request(`${ENDPOINT_BOOKMARK}/${locationId}`, {
        method,
        headers: {
            'X-Siteaccess': siteaccess,
            'X-CSRF-Token': token,
        },
        mode: 'same-origin',
        credentials: 'same-origin',
    });

    fetch(request)
        .then(handleRequestResponseStatus)
        .then(callback)
        .catch(showErrorNotification);
};

export const addBookmark = (options, callback) => {
    toggleBookmark(options, callback, 'POST');
};

export const removeBookmark = (options, callback) => {
    toggleBookmark(options, callback, 'DELETE');
};
