# Multi File Upload

Multi File Upload module is meant to be used as a part of editorial interface of eZ Platform. It provides an interface to publish content based on dropped files while uploading them in the interface.

## How to use it?

With vanilla JS:

```javascript
React.createElement(MultiFileUpload.default, {
    onAfterUpload: {Function},
    adminUiConfig: {
        multiFileUpload: {
            defaultMappings: [{
                contentTypeIdentifier: {String},
                contentFieldIdentifier: {String},
                contentNameIdentifier: {String},
                mimeTypes: [{String}, {String}, ...]
            }],
            fallbackContentType: {
                contentTypeIdentifier: {String},
                contentFieldIdentifier: {String},
                contentNameIdentifier: {String}
            },
            locationMappings: [{Object}],
            maxFileSize: {Number}
        },
        token: {String},
        siteaccess: {String}
    },
    parentInfo: {
        contentTypeIdentifier: {String},
        contentTypeId: {Number},
        locationPath: {String},
        language: {String}
    }
});
```

With JSX:

```jsx
const attrs = {
    onAfterUpload: {Function},
    adminUiConfig: {
        multiFileUpload: {
            defaultMappings: [{
                contentTypeIdentifier: {String},
                contentFieldIdentifier: {String},
                contentNameIdentifier: {String},
                mimeTypes: [{String}, {String}, ...]
            }],
            fallbackContentType: {
                contentTypeIdentifier: {String},
                contentFieldIdentifier: {String},
                contentNameIdentifier: {String}
            },
            locationMappings: [{Object}],
            maxFileSize: {Number}
        },
        token: {String},
        siteaccess: {String}
    },
    parentInfo: {
        contentTypeIdentifier: {String},
        contentTypeId: {Number},
        locationPath: {String},
        language: {String}
    }
};

<MultiFileUploadModule {...attrs}/>
```

## Props list

The `<MultiFileUpload />` module can handle additional properties. There are 2 types of properties: **required** and **optional**. All of them are listed below.

### Required props

Without all the following properties the Multi File Upload will not work.

**onAfterUpload** _{Function}_ - a callback to be invoked just after a file has been uploaded

**adminUiConfig** _{Object}_ - UI config object. It should keep the following structure:

- **multiFileUpload** _{Object}_  - multi file upload module config:
    - **defaultMappings** _{Array}_ - a list of file type to content type mappings. Sample mapping be an object and should follow the convention:
        - **contentTypeIdentifier** _{String}_ - content type identifier,
        - **contentFieldIdentifier** _{String}_ - content field identifier,
        - **nameFieldIdentifier** _{String}_ - name field identifier,
        - **mimeTypes** _{Array}_ - a list of file typers assigned to a specific content type
    - **fallbackContentType** _{Object}_ - a fallback content type definition. Should contain the following info:
        - **contentTypeIdentifier** _{String}_ - content type identifier,
        - **contentFieldIdentifier** _{String}_ - content field identifier,
        - **nameFieldIdentifier** _{String}_ - name field identifier
    - **locationMappings** _{Array}_ - list of file type to content type mappings based on a location identifier
    - **maxFileSize** {Number} - maximum file size allowed for uploading. It's a number of bytes.
- **token** _{String}_ - CSRF token,
- **siteaccess** _{String}_ - SiteAccess identifier.

**parentInfo** _{Object}_ - parent location meta information:

- **contentTypeIdentifier** _{String}_ - content type identifier,
- **contentTypeId** _{Number}_ - content type id,
- **locationPath** _{String}_ - location path string,
- **language** _{String}_ - language code identifier.

### Optional props

Optionally, Multi File Upload module can take a following list of props:

**checkCanUpload** _{Function}_ - checks whether am uploaded file can be uploaded. The callback takes 4 params:

- **file** _{File}_ - file object,
- **parentInfo** _{Object}_ - parent location meta information,
- **config** _{Object}_ - Multi File Upload module config,
- **callbacks** _{Object}_ - error callbacks list: **fileTypeNotAllowedCallback** and **fileSizeNotAllowedCallback**.

**createFileStruct** _{Function}_ - a function that creates a _ContentCreate_ struct. The function takes 2 params:

- **file** _{File}_ - file object,
- **params** _{Object}_ - params hash containing: **parentInfo** and **adminUiConfig** stored under the **config** key.

**deleteFile** _{Function}_ - a function deleting Content created from a given file. It takes 3 params:

- **systemInfo** _{Object}_ - hash containing information about CSRF token and siteaccess: **token** and **siteaccess**,
- **struct** _{Object}_ - Content struct,
- **callback** _{Function}_ - content deleted callback.

**onPopupClose** _{Function}_ - function invoked when closing a Multi File Upload popup. It takes one param: **itemsUploaded** - the list of uploaded items.

**publishFile** _{Function}_ - publishes an uploaded file-based content item. Takes 3 params:

- **data** _{Object}_ - an object containing information about:
    - **struct** _{Object}_ - the ContentCreate struct (),
    - **token** _{String}_ - CSRF token,
    - **siteaccess** _{String}_ - SiteAccess identifier,
- **requestEventHandlers** _{Object}_ - a list of upload event handlers:
    - **onloadstart** _{Function}_ - on load start callback,
    - **upload** _{Object}_ - file upload events:
        - **onabort** _{Function}_ - on abort callback,
        - **onload** _{Function}_ - on load callback,
        - **onprogress** _{Function}_ - on progress callback,
        - **ontimeout** _{Function}_ - on timeout callback.
- **callback** _{Function}_ - a callback invoked when an uploaded file-based content has been published.
