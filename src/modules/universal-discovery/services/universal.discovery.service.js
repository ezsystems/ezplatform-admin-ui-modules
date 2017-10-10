const HEADERS_CREATE_VIEW = {
    "Accept":"application/vnd.ez.api.View+json; version=1.1",
    "Content-Type":"application/vnd.ez.api.ViewInput+json; version=1.1"
};
const ENDPOINT_CREATE_VIEW = '/api/ezp/v2/views';
/**
 * Handles request response
 *
 * @function handleRequestResponse
 * @param {Response} response
 * @returns {Error|Promise}
 */
const handleRequestResponse = response => {
    if (!response.ok) {
        throw Error(response.statusText);
    }

    return response.json();
};

/**
 * Loads content info
 *
 * @function loadContentInfo
 * @param {String} contentId
 * @param {Function} callback
 */
export const loadContentInfo = (contentId, callback) => {
    const body = JSON.stringify({
        ViewInput: {
            identifier: `udw-load-content-info-${contentId}`,
            public: false,
            ContentQuery: {
                Criteria: {},
                FacetBuilders: {},
                SortClauses: {},
                Filter: {ContentIdCriterion: `${contentId}`},
                limit: 1,
                offset: 0
            }
        }
    });
    const headers = new Headers(HEADERS_CREATE_VIEW);
    const request = new Request(ENDPOINT_CREATE_VIEW, {
        method: 'POST',
        headers,
        body,
        mode: 'cors',
    });

    fetch(request)
        .then(handleRequestResponse)
        .then(callback)
        .catch(error => console.log('error:load:content:info', error));
};

/**
 * Finds locations related to the parent location
 *
 * @function findLocationsByParentLocationId
 * @param {String} parentLocationId
 * @param {Function} callback
 */
export const findLocationsByParentLocationId = (parentLocationId, callback) => {
    const body = JSON.stringify({
        ViewInput: {
            identifier: `udw-locations-by-parent-location-id-${parentLocationId}`,
            public: false,
            LocationQuery: {
                Criteria: {},
                FacetBuilders: {},
                SortClauses: {SectionIdentifier: 'ascending'},
                Filter: {ParentLocationIdCriterion: parentLocationId},
                limit: 50,
                offset: 0
            }
        }
    });
    const headers = new Headers(HEADERS_CREATE_VIEW);
    const request = new Request(ENDPOINT_CREATE_VIEW, {
        method: 'POST',
        headers,
        body,
        mode: 'cors',
    });

    fetch(request)
        .then(handleRequestResponse)
        .then(json => callback({
            parentLocationId,
            data: json
        }))
        .catch(error => console.log('error:find:locations:by:parent:location:id', error));
};

/**
 * Finds content matching a given text query
 *
 * @function findContentBySearchQuery
 * @param {String} query
 * @param {Function} callback
 */
export const findContentBySearchQuery = (query, callback) => {
    const body = JSON.stringify({
        ViewInput:{
            identifier: `udw-locations-by-search-query-${query}`,
            public: false,
            LocationQuery: {
                Criteria: {},
                FacetBuilders: {},
                SortClauses: {},
                Filter: {FullTextCriterion: query},
                limit: 50,
                offset: 0
            }
        }
    });
    const headers = new Headers(HEADERS_CREATE_VIEW);
    const request = new Request(ENDPOINT_CREATE_VIEW, {
        method: 'POST',
        headers,
        body,
        mode: 'cors',
    });

    fetch(request)
        .then(handleRequestResponse)
        .then(callback)
        .catch(error => console.log('error:find:content:by:search:query', error));
};

/**
 * Loads content types
 *
 * @function loadContentTypes
 * @param {Function} callback
 */
export const loadContentTypes = (callback) => {
    const headers = new Headers({
        'Accept': 'application/vnd.ez.api.ContentTypeInfoList+json'

    });
    const request = new Request('/api/ezp/v2/content/types', {
        method: 'GET',
        headers,
        mode: 'cors',
    });

    fetch(request)
        .then(handleRequestResponse)
        .then(callback)
        .catch(error => console.log('error:load:content:info', error));
};
