import { handleRequestResponse } from '../../common/helpers/request.helper.js';

const HEADERS_BULK = {
    Accept: 'application/vnd.ez.api.BulkOperationResponse+json',
    'Content-Type': 'application/vnd.ez.api.BulkOperation+json',
};
const TRASH_FAKE_LOCATION = '/api/ezp/v2/content/trash';

export const bulkMoveLocations = (restInfo, locations, newLocationHref, callback) => {
    const requestBodyOperations = getBulkMoveRequestOperations(locations, newLocationHref);

    makeBulkRequest(restInfo, requestBodyOperations, processBulkResponse.bind(null, locations, 201, callback));
};

export const bulkMoveLocationsToTrash = (restInfo, locations, callback) => {
    bulkMoveLocations(restInfo, locations, TRASH_FAKE_LOCATION, callback);
};

const getBulkMoveRequestOperations = (locations, destination) => {
    const operations = {};

    locations.forEach((location) => {
        operations[location.id] = {
            uri: location._href,
            method: 'MOVE',
            headers: {
                Destination: destination,
            },
        };
    });

    return operations;
};

const processBulkResponse = (locations, successCode, callback, response) => {
    const { operations } = response.BulkOperationResponse;
    const locationsMatches = { success: [], fail: [] };

    Object.entries(operations).forEach(([locationId, response]) => {
        const respectiveItem = locations.find((location) => location.id === parseInt(locationId, 10));
        const isSuccess = response.statusCode === successCode;

        if (isSuccess) {
            locationsMatches.success.push(respectiveItem);
        } else {
            locationsMatches.fail.push(respectiveItem);
        }
    });

    callback(locationsMatches.success, locationsMatches.fail);
};

const makeBulkRequest = ({ token }, requestBodyOperations, callback) => {
    const request = new Request(Routing.generate('ezplatform.bulk_operation'), {
        method: 'POST',
        headers: {
            ...HEADERS_BULK,
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
            const message = Translator.trans(/*@Desc("Bulk request failed")*/ 'bulk_request.error.message', {}, 'sub_items');

            window.eZ.helpers.notification.showErrorNotification(message);
        });
};
