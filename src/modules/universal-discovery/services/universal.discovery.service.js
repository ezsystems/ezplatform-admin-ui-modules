const HEADERS_CREATE_VIEW = {
    "Accept":"application/vnd.ez.api.View+json; version=1.1",
    "Content-Type":"application/vnd.ez.api.ViewInput+json; version=1.1"
};
const QUERY_LIMIT = 50;
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
 * @param {Object} restInfo REST config hash containing: token and siteaccess properties
 * @param {String} contentId
 * @param {Function} callback
 */
export const loadContentInfo = ({token, siteaccess}, contentId, callback) => {
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
    const request = new Request(ENDPOINT_CREATE_VIEW, {
        method: 'POST',
        headers: Object.assign({}, HEADERS_CREATE_VIEW, {
            'X-Siteaccess': siteaccess,
            'X-CSRF-Token': token
        }),
        body,
        mode: 'cors',
        credentials: 'same-origin'
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
 * @param {Object} params params hash containing REST config: token and siteaccess properties; parentLocationId and offset
 * @param {Function} callback
 */
export const findLocationsByParentLocationId = ({
        token,
        siteaccess,
        parentLocationId,
        limit = QUERY_LIMIT,
        offset = 0
    }, callback) => {
    const body = JSON.stringify({
        ViewInput: {
            identifier: `udw-locations-by-parent-location-id-${parentLocationId}`,
            public: false,
            LocationQuery: {
                Criteria: {},
                FacetBuilders: {},
                SortClauses: {SectionIdentifier: 'ascending'},
                Filter: {ParentLocationIdCriterion: parentLocationId},
                limit,
                offset
            }
        }
    });
    const request = new Request(ENDPOINT_CREATE_VIEW, {
        method: 'POST',
        headers: Object.assign({}, HEADERS_CREATE_VIEW, {
            'X-Siteaccess': siteaccess,
            'X-CSRF-Token': token
        }),
        body,
        mode: 'cors',
        credentials: 'same-origin'
    });

    fetch(request)
        .then(handleRequestResponse)
        .then(json => callback({
            parentLocationId,
            offset,
            data: json
        }))
        .catch(error => console.log('error:find:locations:by:parent:location:id', error));
};

/**
 * Finds content matching a given text query
 *
 * @function findContentBySearchQuery
 * @param {Object} restInfo REST config hash containing: token and siteaccess properties
 * @param {String} query
 * @param {Function} callback
 */
export const findContentBySearchQuery = ({token, siteaccess}, query, callback) => {
    const body = JSON.stringify({
        ViewInput:{
            identifier: `udw-locations-by-search-query-${query}`,
            public: false,
            LocationQuery: {
                Criteria: {},
                FacetBuilders: {},
                SortClauses: {},
                Filter: {FullTextCriterion: query},
                limit: QUERY_LIMIT,
                offset: 0
            }
        }
    });
    const request = new Request(ENDPOINT_CREATE_VIEW, {
        method: 'POST',
        headers: Object.assign({}, HEADERS_CREATE_VIEW, {
            'X-Siteaccess': siteaccess,
            'X-CSRF-Token': token
        }),
        body,
        mode: 'cors',
        credentials: 'same-origin'
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
  * @param {Object} restInfo REST config hash containing: token and siteaccess properties
 * @param {Function} callback
 */
export const loadContentTypes = ({token, siteaccess}, callback) => {
    const request = new Request('/api/ezp/v2/content/types', {
        method: 'GET',
        headers: {
            'Accept': 'application/vnd.ez.api.ContentTypeInfoList+json',
            'X-Siteaccess': siteaccess,
            'X-CSRF-Token': token
        },
        mode: 'cors',
        credentials: 'same-origin'
    });

    fetch(request)
        .then(handleRequestResponse)
        .then(callback)
        .catch(error => console.log('error:load:content:info', error));
};
