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
    { token, parentLocationId, limit = QUERY_LIMIT, offset = 0, sortClause = 'DatePublished', sortOrder = 'ascending', gridView = false },
    callback
) => {
    const routeName = gridView ? 'ezplatform.udw.location_gridview.data' : 'ezplatform.udw.location.data';
    const url = window.Routing.generate(routeName, {
        locationId: parentLocationId,
    });
    const request = new Request(`${url}?limit=${limit}&offset=${offset}&sortClause=${sortClause}&sortOrder=${sortOrder}`, {
        method: 'GET',
        headers: { 'X-CSRF-Token': token },
        mode: 'same-origin',
        credentials: 'same-origin',
    });

    fetch(request)
        .then(handleRequestResponse)
        .then((response) => {
            const { bookmark, location, permissions, subitems, version } = response;
            const subitemsData = subitems.locations.map((location) => {
                const mappedSubitems = {
                    location: location.Location,
                };

                if (subitems.versions) {
                    const version = subitems.versions.find(
                        (version) => version.Version.VersionInfo.Content._href === location.Location.Content._href
                    );

                    mappedSubitems.version = version.Version;
                }

                return mappedSubitems;
            });

            callback({
                location: location.Location,
                version: version.Version,
                subitems: subitemsData,
                bookmarked: bookmark,
                permissions,
                parentLocationId,
            });
        })
        .catch(showErrorNotification);
};

export const loadAccordionData = ({ token, parentLocationId, gridView = false }, callback) => {
    const routeName = gridView ? 'ezplatform.udw.accordion_gridview.data' : 'ezplatform.udw.accordion.data';
    const url = window.Routing.generate(routeName, {
        locationId: parentLocationId,
    });
    const request = new Request(url, {
        method: 'GET',
        headers: { 'X-CSRF-Token': token },
        mode: 'same-origin',
        credentials: 'same-origin',
    });

    fetch(request)
        .then(handleRequestResponse)
        .then((response) => {
            const mappedItems = response.breadcrumb.map((item) => {
                const location = item.Location;
                const mappedItem = {
                    location,
                    subitems: [],
                    parentLocationId: location.id,
                    collapsed: !response.columns[location.id],
                };

                return mappedItem;
            });

            const lastLocationData = response.columns[parentLocationId];
            const subitemsData = lastLocationData.subitems.locations.map((location) => {
                const mappedSubitems = {
                    location: location.Location,
                };

                if (lastLocationData.subitems.versions) {
                    const version = lastLocationData.subitems.versions.find(
                        (version) => version.Version.VersionInfo.Content._href === location.Location.Content._href
                    );

                    mappedSubitems.version = version.Version;
                }

                return mappedSubitems;
            });

            mappedItems.push({
                location: lastLocationData.location.Location,
                version: lastLocationData.version.Version,
                subitems: subitemsData,
                bookmarked: lastLocationData.bookmark,
                permissions: lastLocationData.permissions,
                parentLocationId,
            });

            callback(mappedItems);
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
