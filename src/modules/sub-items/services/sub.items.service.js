const HEADERS_CREATE_VIEW = {
    Accept: 'application/vnd.ez.api.View+json; version=1.1',
    'Content-Type': 'application/vnd.ez.api.ViewInput+json; version=1.1',
};
const ENDPOINT_CREATE_VIEW = '/api/ezp/v2/views';
/**
 * Handles request response
 *
 * @function handleRequestResponse
 * @param {Response} response
 * @returns {String|Response}
 */
const handleRequestResponse = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }

    return response.json();
};

/**
 * Loads location struct
 *
 * @function loadLocation
 * @param {Object} restInfo - contains:
 * @param {String} restInfo.token
 * @param {String} restInfo.siteaccess
 * @param {Object} queryConfig - contains:
 * @param {Number} queryConfig.locationId
 * @param {Number} queryConfig.limit
 * @param {Number} queryConfig.offset
 * @param {Object} queryConfig.sortClauses
 * @param {Function} callback
 */
export const loadLocation = ({ token, siteaccess }, { locationId = 2, limit = 10, offset = 0, sortClauses }, callback) => {
    const body = JSON.stringify({
        ViewInput: {
            identifier: `subitems-load-location-${locationId}`,
            public: false,
            LocationQuery: {
                Criteria: {},
                FacetBuilders: {},
                SortClauses: sortClauses,
                Filter: { ParentLocationIdCriterion: locationId },
                limit,
                offset,
            },
        },
    });
    const request = new Request(ENDPOINT_CREATE_VIEW, {
        method: 'POST',
        headers: {
            ...HEADERS_CREATE_VIEW,
            'X-Siteaccess': siteaccess,
            'X-CSRF-Token': token,
        },
        body,
        mode: 'cors',
        credentials: 'same-origin',
    });

    fetch(request)
        .then(handleRequestResponse)
        .then(callback)
        .catch(() => window.eZ.helpers.notification.showErrorNotification('Cannot load location'));
};

/**
 * Loads content info
 *
 * @function loadContentInfo
 * @param {Array} contentIds
 * @param {Function} callback
 */
export const loadContentInfo = ({ token, siteaccess }, contentIds, callback) => {
    const ids = contentIds.join();
    const body = JSON.stringify({
        ViewInput: {
            identifier: `subitems-load-content-info-${ids}`,
            public: false,
            ContentQuery: {
                Criteria: {},
                FacetBuilders: {},
                SortClauses: {},
                Filter: { ContentIdCriterion: `${ids}` },
                limit: contentIds.length,
                offset: 0,
            },
        },
    });
    const request = new Request(ENDPOINT_CREATE_VIEW, {
        method: 'POST',
        headers: {
            ...HEADERS_CREATE_VIEW,
            'X-Siteaccess': siteaccess,
            'X-CSRF-Token': token,
        },
        body,
        mode: 'cors',
        credentials: 'same-origin',
    });

    fetch(request)
        .then(handleRequestResponse)
        .then(callback)
        .catch(() => window.eZ.helpers.notification.showErrorNotification('Cannot load content info'));
};

/**
 * Loads content types
 *
 * @function loadContentTypes
 * @param {Function} callback
 */
export const loadContentTypes = ({ token, siteaccess }, callback) => {
    const request = new Request('/api/ezp/v2/content/types', {
        method: 'GET',
        headers: {
            Accept: 'application/vnd.ez.api.ContentTypeInfoList+json',
            'X-Siteaccess': siteaccess,
            'X-CSRF-Token': token,
        },
        mode: 'cors',
        credentials: 'same-origin',
    });

    fetch(request)
        .then(handleRequestResponse)
        .then(callback)
        .catch(() => window.eZ.helpers.notification.showErrorNotification('Cannot load content types'));
};

/**
 * Loads content types
 *
 * @function loadContentType
 * @param {Function} callback
 */
export const loadContentType = (id, { token, siteaccess }, callback) => {
    const request = new Request(id, {
        method: 'GET',
        headers: {
            Accept: 'application/vnd.ez.api.ContentType+json',
            'X-Siteaccess': siteaccess,
            'X-CSRF-Token': token,
        },
        mode: 'cors',
        credentials: 'same-origin',
    });

    fetch(request)
        .then(handleRequestResponse)
        .then(callback)
        .catch(() => window.eZ.helpers.notification.showErrorNotification('Cannot load a content type'));
};

/**
 * Updates location priority
 *
 * @function updateLocationPriority
 * @param {Object} params params hash containing: priority, location, token, siteaccess properties
 * @param {Function} callback
 */
export const updateLocationPriority = ({ priority, location, token, siteaccess }, callback) => {
    const request = new Request(location, {
        method: 'POST',
        headers: {
            Accept: 'application/vnd.ez.api.Location+json',
            'Content-Type': 'application/vnd.ez.api.LocationUpdate+json',
            'X-Siteaccess': siteaccess,
            'X-CSRF-Token': token,
            'X-HTTP-Method-Override': 'PATCH',
        },
        credentials: 'same-origin',
        mode: 'cors',
        body: JSON.stringify({
            LocationUpdate: {
                priority: priority,
                sortField: 'PATH',
                sortOrder: 'ASC',
            },
        }),
    });

    fetch(request)
        .then(handleRequestResponse)
        .then(callback)
        .catch(() => window.eZ.helpers.notification.showErrorNotification('An error occurred while updating location priority'));
};
