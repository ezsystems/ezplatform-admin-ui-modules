import { handleRequestResponse } from '../../common/helpers/request.helper.js';

const HEADERS_BULK = {
    Accept: 'application/vnd.ez.api.BulkOperationResponse+json',
    'Content-Type': 'application/vnd.ez.api.BulkOperation+json',
};

export const bulkMoveLocations = (restInfo, locations, newLocationHref, callback) => {
    const requestBody = getBulkMoveRequestBody(locations, newLocationHref);

    makeBulkRequest(restInfo, requestBody, processBulkResponse.bind(null, locations, 201, callback));
};

export const bulkDeleteContents = (restInfo, locations, callback) => {
    bulkMoveLocations(restInfo, locations, '/api/ezp/v2/content/trash', callback);
};

const getBulkMoveRequestBody = (locations, destination) =>
    locations.map((location) => ({
        uri: location._href,
        method: 'MOVE',
        headers: {
            Destination: destination,
        },
    }));

const processBulkResponse = (items, successCode, callback, response) => {
    const operations = response.BulkOperationResponse.Operations;
    const contentsMatches = operations.reduce(
        (acc, apiResponse, index) => {
            const respectiveItem = items[index];
            const isSuccess = apiResponse.statusCode === successCode;

            if (isSuccess) {
                acc.success.push(respectiveItem);
            } else {
                acc.fail.push(respectiveItem);
            }

            return acc;
        },
        { success: [], fail: [] }
    );

    callback(contentsMatches.success, contentsMatches.fail);
};

const makeBulkRequest = ({ token }, body, callback) => {
    const request = new Request(Routing.generate('ezplatform.bulk_operation'), {
        method: 'POST',
        headers: {
            ...HEADERS_BULK,
            'X-CSRF-Token': token,
        },
        body: JSON.stringify({
            bulkOperations: {
                operation: body,
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
