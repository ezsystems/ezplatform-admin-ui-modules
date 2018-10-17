import { handleRequestResponse } from '../../common/helpers/request.helper.js';

export const bulkDeleteContents = (restInfo, contents, callback) => {
    const requestBody = JSON.stringify(getBulkDeleteRequestBody(contents));

    makeBulkRequest(restInfo, requestBody, processBulkResponse.bind(null, contents, 204, callback));
};

export const bulkMoveLocations = (restInfo, locations, newLocation, callback) => {
    const requestBody = JSON.stringify(getBulkMoveRequestBody(locations, newLocation));

    makeBulkRequest(restInfo, requestBody, processBulkResponse.bind(null, locations, 201, callback));
};

const getBulkDeleteRequestBody = (contents) =>
    contents.map((content) => {
        return {
            uri: content._href,
            method: 'DELETE',
            parameters: [''],
            headers: {},
            content: '',
        };
    });

const getBulkMoveRequestBody = (locations, newLocation) =>
    locations.map((location) => {
        return {
            uri: location._href,
            method: 'MOVE',
            parameters: [''],
            headers: {
                HTTP_Destination: newLocation._href,
            },
            content: '',
        };
    });

const processBulkResponse = (items, successCode, callback, apiResponses) => {
    const contentsMatches = apiResponses.reduce(
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

const makeBulkRequest = ({ token, siteaccess }, body, callback) => {
    const request = new Request('/bulk', {
        method: 'POST',
        headers: {
            'X-Siteaccess': siteaccess,
            'X-CSRF-Token': token,
        },
        body: body,
        mode: 'cors',
        credentials: 'same-origin',
    });

    fetch(request)
        .then(handleRequestResponse)
        .then(callback)
        .catch(() => window.eZ.helpers.notification.showErrorNotification('Bulk request failed'));
};
