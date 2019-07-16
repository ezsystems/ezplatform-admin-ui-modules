import { handleRequestResponse } from '../../common/helpers/request.helper.js';

const HEADERS_BULK = {
    Accept: 'application/vnd.ez.api.BulkOperationResponse+json',
    'Content-Type': 'application/vnd.ez.api.BulkOperation+json',
};
const TRASH_FAKE_LOCATION = '/api/ezp/v2/content/trash';
const USER_ENDPOINT = '/api/ezp/v2/user/users';
const ENDPOINT_BULK = '/api/ezp/v2/bulk';

export const bulkMoveLocations = (restInfo, locations, newLocationHref, callback) => {
    const requestBodyOperations = {};

    locations.forEach((location) => {
        requestBodyOperations[location.id] = getBulkMoveRequestOperation(location, newLocationHref);
    });

    makeBulkRequest(restInfo, requestBodyOperations, processBulkResponse.bind(null, locations, callback));
};

export const bulkMoveLocationsToTrash = (restInfo, locations, callback) => {
    console.warn('[DEPRECATED] bulkMoveLocationsToTrash function is deprecated');
    console.warn('[DEPRECATED] it will be removed from ezplatform-admin-ui-modules 2.0');
    console.warn('[DEPRECATED] use bulkDeleteItems instead');

    bulkMoveLocations(restInfo, locations, TRASH_FAKE_LOCATION, callback);
};

export const bulkDeleteItems = (restInfo, items, contentTypesMap, callback) => {
    const locations = items.map(({ location }) => location);
    const requestBodyOperations = {};

    items.forEach(({ location, content }) => {
        const contentType = contentTypesMap[content.ContentType._href];
        const contentTypeIdentifier = contentType.identifier;
        const isUserContentItem = window.eZ.adminUiConfig.userContentTypes.includes(contentTypeIdentifier);

        if (isUserContentItem) {
            requestBodyOperations[location.id] = getBulkDeleteUserRequestOperation(content);
        } else {
            requestBodyOperations[location.id] = getBulkMoveRequestOperation(location, TRASH_FAKE_LOCATION);
        }
    });

    makeBulkRequest(restInfo, requestBodyOperations, processBulkResponse.bind(null, locations, callback));
};

const getBulkDeleteUserRequestOperation = (content) => ({
    uri: `${USER_ENDPOINT}/${content._id}`,
    method: 'DELETE',
});

const getBulkMoveRequestOperation = (location, destination) => ({
    uri: location._href,
    method: 'MOVE',
    headers: {
        Destination: destination,
    },
});

const processBulkResponse = (locations, callback, response) => {
    const { operations } = response.BulkOperationResponse;
    const locationsMatches = Object.entries(operations).reduce(
        (locationsMatches, [locationId, response]) => {
            const respectiveItem = locations.find((location) => location.id === parseInt(locationId, 10));
            const isSuccess = 200 <= response.statusCode && response.statusCode <= 299;

            if (isSuccess) {
                locationsMatches.success.push(respectiveItem);
            } else {
                locationsMatches.fail.push(respectiveItem);
            }

            return locationsMatches;
        },
        { success: [], fail: [] }
    );

    callback(locationsMatches.success, locationsMatches.fail);
};

const makeBulkRequest = ({ token, siteaccess }, requestBodyOperations, callback) => {
    const request = new Request(ENDPOINT_BULK, {
        method: 'POST',
        headers: {
            ...HEADERS_BULK,
            'X-Siteaccess': siteaccess,
            'X-CSRF-Token': token,
        },
        body: JSON.stringify({
            bulkOperations: {
                operations: requestBodyOperations,
            },
        }),
        mode: 'same-origin',
        credentials: 'same-origin',
    });

    fetch(request)
        .then(handleRequestResponse)
        .then(callback)
        .catch(() => {
            const message = Translator.trans(
                /*@Desc("An unexpected error occurred while deleting the content item(s). Please try again later.")*/ 'bulk_request.error.message',
                {},
                'sub_items'
            );

            window.eZ.helpers.notification.showErrorNotification(message);
        });
};
