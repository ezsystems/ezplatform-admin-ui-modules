import React from 'react';

import UniversalDiscoveryModule from './modules/universal-discovery/universal.discovery.module';
import MultiFileUploadModule from './modules/multi-file-upload/multi.file.upload.module';
import SubItemsModule from './modules/sub-items/sub.items.module';

const App = () => {
    const adminUiConfig = {"token":"1234","siteaccess":"admin","multiFileUpload":{"locationMappings":[],"defaultMappings":[{"mimeTypes":["image/jpeg","image/jpg","image/pjpeg","image/pjpg","image/png","image/bmp","image/gif","image/tiff","image/x-icon","image/webp"],"contentTypeIdentifier":"image","contentFieldIdentifier":"image","nameFieldIdentifier":"name"},{"mimeTypes":["image/svg+xml","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/vnd.ms-excel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/vnd.ms-powerpoint","application/vnd.openxmlformats-officedocument.presentationml.presentation","application/pdf"],"contentTypeIdentifier":"file","contentFieldIdentifier":"file","nameFieldIdentifier":"name"}],"fallbackContentType":{"contentTypeIdentifier":"file","contentFieldIdentifier":"file","nameFieldIdentifier":"name"},"maxFileSize":64000000}};
    const parentInfo = {
        contentTypeIdentifier: 'file',
        contentTypeId: 5,
        locationPath: '/1/2',
        language: 'eng-GB'
    };
    const silProps = {
        parentLocationId: 2,
        restInfo: {token: 'xyz', siteaccess: 'admin'},
        locationViewLink: '/admin/content/location/{{locationId}}',
    }

    return (
        <div className="app">
            <MultiFileUploadModule
                adminUiConfig={adminUiConfig}
                parentInfo={parentInfo}
                updateList={() => {}}
                onAfterUpload={() => window.location.reload()}
                />
            <SubItemsModule {...silProps} />
            <UniversalDiscoveryModule onCancel={() => {}} onConfirm={() => {}}/>
        </div>
    );
};

export default App;
