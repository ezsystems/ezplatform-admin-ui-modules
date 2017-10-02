const handleOnReadyStateChange = (xhr, onSuccess, onError) => {   
    if (xhr.readyState !== 4) {
        return;
    }

    const response = new Response({
        status: xhr.status,
        headers: xhr.getAllResponseHeaders(),
        body: xhr.responseText,
        xhr: xhr,
    });

    if (xhr.status >= 400 || !xhr.status) {
        onError(response.text());

        return;
    }

    onSuccess(JSON.parse(xhr.response));
};

const handleRequestResponse = response => {
    if (!response.ok) {
        throw Error(response.text());
    }

    return response;
};

const readFile = function (file, resolve, reject) {
    this.addEventListener('load', () => resolve({fileReader: this, file}), false);
    this.addEventListener('error', () => reject(), false);
    this.readAsDataURL(file);
}

const findFileTypeMapping = (mappings, file) => mappings.find(item => item.mimeTypes.find(type => type === file.type));
const isMimeTypeAllowed = (mappings, file) => !!findFileTypeMapping(mappings, file);
const checkFileTypeAllowed = (file, locationMapping) => !locationMapping ? true : isMimeTypeAllowed(locationMapping.mappings, file);
const detectContentTypeMapping = (file, parentInfo, config) => {
    const locationMapping = config.locationMappings.find(item => item.contentTypeIdentifier === parentInfo.contentTypeIdentifier);
    const mappings = locationMapping ? locationMapping.mappings : config.defaultMappings;

    return findFileTypeMapping(mappings, file) || config.fallbackContentType;
};

const getContentTypeByIdentifier = ({token, siteaccess}, identifier) => {
    const request = new Request(`/api/ezp/v2/content/types?identifier=${identifier}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/vnd.ez.api.ContentTypeInfoList+json',
            'X-Siteaccess': siteaccess,
            'X-CSRF-Token': token
        },
        credentials: 'same-origin',
        mode: 'cors'
    });

    return fetch(request).then(handleRequestResponse);
};

const prepareStruct = ({parentInfo, config}, data) => {
    let parentLocation = `/api/ezp/v2/content/locations${parentInfo.locationPath}`;

    parentLocation = parentLocation.endsWith('/') ? parentLocation.slice(0, -1) : parentLocation;

    const mapping = detectContentTypeMapping(data.file, parentInfo, config.multiFileUpload);

    return getContentTypeByIdentifier(config, mapping.contentTypeIdentifier)
        .then(response => response.json())
        .catch(error => console.log('get:content:type:error', error))
        .then(response => {
            const fields = [{
                fieldDefinitionIdentifier: mapping.nameFieldIdentifier,
                fieldValue: data.file.name
            }, {
                fieldDefinitionIdentifier: mapping.contentFieldIdentifier,
                fieldValue: {
                    fileName: data.file.name,
                    data: data.fileReader.result.replace(/^.*;base64,/, '')
                }
            }];

            const struct = {
                ContentCreate: {
                    ContentType: {'_href': response.ContentTypeInfoList.ContentType[0]._href},
                    mainLanguageCode: parentInfo.language,
                    LocationCreate: {
                        ParentLocation: {'_href': parentLocation},
                        sortField: 'PATH',
                        sortOrder: 'ASC'
                    },
                    Section: null,
                    alwaysAvailable: true,
                    remoteId: null,
                    modificationDate: (new Date()).toISOString(),
                    fields: {field: fields}
                }
            };
        
            return struct;
        })
        .catch(error => console.log('create:struct:error', error));
};

const createDraft = (data, requestEventHandlers) => {
    const {struct, token, siteaccess} = data;

    const xhr = new XMLHttpRequest();
    const body = JSON.stringify(struct);
    const headers = {
        'Accept': 'application/vnd.ez.api.Content+json',
        'Content-Type': 'application/vnd.ez.api.ContentCreate+json',
        'X-CSRF-Token': token,
        'X-Siteaccess': siteaccess
    };

    return new Promise((resolve, reject) => {
        xhr.open('POST', '/api/ezp/v2/content/objects', true);
        
        xhr.onreadystatechange = handleOnReadyStateChange.bind(null, xhr, resolve, reject);
    
        if (requestEventHandlers && Object.keys(requestEventHandlers).length) {
            const uploadEvents = requestEventHandlers.upload;
    
            if (uploadEvents && Object.keys(uploadEvents).length) {
                xhr.upload.onabort = uploadEvents.onabort;
                xhr.upload.onerror = reject;
                xhr.upload.onload = uploadEvents.onload;
                xhr.upload.onprogress = uploadEvents.onprogress;
                xhr.upload.ontimeout = uploadEvents.ontimeout;
            }
    
            xhr.onerror = reject;
            xhr.onloadstart = requestEventHandlers.onloadstart;
        }
    
        for (let headerType in headers) {
            if (headers.hasOwnProperty(headerType)) {
                xhr.setRequestHeader(headerType, headers[headerType]);
            }
        }
    
        xhr.send(body);
    });
};

const publishDraft = (data, response) => {
    const {token, siteaccess} = data;
    const request = new Request(response.Content.CurrentVersion.Version._href, {
        method: 'POST',
        headers: {
            'X-Siteaccess': siteaccess,
            'X-CSRF-Token': token,
            'X-HTTP-Method-Override': 'PUBLISH'
        },
        mode: 'cors',
        credentials: 'same-origin'
    });
    
    return fetch(request).then(handleRequestResponse);
};

export const checkCanUpload = (file, parentInfo, config, callbacks) => {
    const locationMapping = config.locationMappings.find(item => item.contentTypeIdentifier === parentInfo.contentTypeIdentifier);

    if (!checkFileTypeAllowed(file, locationMapping)) {
        callbacks.fileTypeNotAllowedCallback();

        return false;
    }

    if (file.size > config.maxFileSize) {
        callbacks.fileSizeNotAllowedCallback();

        return false;
    }

    return true;
};

export const createFileStruct = (file, params) => new Promise(readFile.bind(new FileReader(), file)).then(prepareStruct.bind(null, params));

export const publishFile = (data, requestEventHandlers, callback) => {
    createDraft(data, requestEventHandlers)
        .catch(error => console.log('create:draft:error', error))
        .then(publishDraft.bind(null, data))
        .then(callback)
        .catch(error => console.log('publish:file:error', error));
};

export const deleteFile = (data, struct, callback) => {
    const {token, siteaccess} = data;
    const request = new Request(struct.Content._href, {
        method: 'DELETE',
        headers: {
            'X-Siteaccess': siteaccess,
            'X-CSRF-Token': token
        },
        mode: 'cors',
        credentials: 'same-origin'
    });
    
    fetch(request)
        .then(handleRequestResponse)
        .then(callback)
        .catch(error => console.log('delete:file:error', error));
};