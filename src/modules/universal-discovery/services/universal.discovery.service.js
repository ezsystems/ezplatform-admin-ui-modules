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
 * Loads preselected location data
 *
 * @function loadPreselectedLocationData
 * @param {String} startingLocationId
 * @param {String} locationId
 * @param {Number} limit
 * @param {Function} callback
 */
export const loadPreselectedLocationData = ({startingLocationId, locationId, limit = QUERY_LIMIT}, callback) => {
    const endpoint = window.Routing.generate('ezplatform.udw.preselected_location.data', {
        startingLocationId,
        locationId,
        limit
    });
    const request = new Request(endpoint, {
        mode: 'same-origin',
        credentials: 'same-origin'
    });

    fetch(request)
        .then(handleRequestResponse)
        .then(callback)
        .catch(error => console.log('error:load:preselected:location:data', error));
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
 * Loads location
 *
 * @function loadLocation
 * @param {Object} params params hash containing REST config: token and siteaccess properties; locationId and offset
 * @param {Function} callback
 */
export const loadLocation = ({
        token,
        siteaccess,
        locationId,
        limit = QUERY_LIMIT,
        offset = 0
    }, callback) => {
    const body = JSON.stringify({
        ViewInput: {
            identifier: `udw-location-by-id-${locationId}`,
            public: false,
            LocationQuery: {
                Criteria: {},
                FacetBuilders: {},
                SortClauses: {},
                Filter: {LocationIdCriterion: locationId},
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
        mode: 'same-origin',
        credentials: 'same-origin'
    });

    fetch(request)
        .then(handleRequestResponse)
        .then(callback)
        .catch(error => console.log('error:load:location:by:id', error));
};

/**
 * Checks if user has permission to create content
 *
 * @function checkCreatePermission
 * @param {Object} params params hash containing REST config: token, siteaccess, contentTypeIdentifier, languageCode, locationId
 * @param {Function} callback
 */
export const checkCreatePermission = ({
        token,
        contentTypeIdentifier,
        languageCode,
        locationId
    }, callback) => {
    const endpoint = window.Routing.generate('ezplatform.content_on_the_fly.has_access', {
        languageCode: languageCode,
        contentTypeIdentifier: contentTypeIdentifier,
        locationId: locationId
    });
    const request = new Request(endpoint, {
        method: 'GET',
        headers: {'X-CSRF-Token': token},
        mode: 'same-origin',
        credentials: 'same-origin'
    });

    fetch(request)
        .then(handleRequestResponse)
        .then(callback)
        .catch(error => console.log('error:check:create:permission', error));
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
