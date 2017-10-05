# Multi File Upload - doc

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

<MultiFileUpload {...attrs}/>
```

## Props list

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
