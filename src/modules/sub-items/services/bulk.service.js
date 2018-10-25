import { handleRequestResponse } from '../../common/helpers/request.helper.js';

const HEADERS_BULK = {
    Accept: 'application/vnd.ez.api.BulkOperationResponse+json',
    'Content-Type': 'application/vnd.ez.api.BulkOperation+json',
};

export const bulkMoveLocations = (restInfo, locations, newLocationHref, callback) => {
    const requestBody = getBulkMoveRequestOperations(locations, newLocationHref);

    makeBulkRequest(restInfo, requestBody, processBulkResponse.bind(null, locations, 201, callback));
};

export const bulkDeleteContents = (restInfo, locations, callback) => {
    bulkMoveLocations(restInfo, locations, '/api/ezp/v2/content/trash', callback);
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
    const contentsMatches = { success: [], fail: [] };

    for (const locationId of Object.keys(operations)) {
        const response = operations[locationId];
        const respectiveItem = locations.find((location) => String(location.id) === locationId);
        const isSuccess = response.statusCode === successCode;

        if (isSuccess) {
            contentsMatches.success.push(respectiveItem);
        } else {
            contentsMatches.fail.push(respectiveItem);
        }
    }

    callback(contentsMatches.success, contentsMatches.fail);
};

const makeBulkRequest = ({ token }, operations, callback) => {
    const request = new Request(Routing.generate('ezplatform.bulk_operation'), {
        method: 'POST',
        headers: {
            ...HEADERS_BULK,
            'X-CSRF-Token': token,
        },
        body: JSON.stringify({
            bulkOperations: {
                operations,
            },
        }),
        mode: 'cors',
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
