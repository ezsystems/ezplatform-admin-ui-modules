import {handleRequestResponse, ENDPOINT_CONTENT_TYPES} from './common.service';

export const loadContentTypes = (contentTypeIds, callback) => {
    const request = new Request(ENDPOINT_CONTENT_TYPES, {
        method: 'GET',
        headers: {'Accept': 'application/vnd.ez.api.ContentTypeInfoList+json'},
        mode: 'cors',
    });
    
    fetch(request)
        .then(handleRequestResponse)
        .then(callback)
        .catch(error => console.log('error:load:content:info', error));
};