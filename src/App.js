import React from 'react';

import UniversalDiscoveryModule from './modules/universal-discovery/universal.discovery.module';
import MultiFileUploadModule from './modules/multi-file-upload/multi.file.upload.module';
import SubItemsModule from './modules/sub-items/sub.items.module';

const App = (props) => {
    return (
        <div className="app">
            <MultiFileUploadModule updateList={() => {}}/>
            <SubItemsModule />
            <UniversalDiscoveryModule cancelDiscoverHandler={() => {}} contentDiscoverHandler={() => {}}/>
        </div>
    );
};

export default App;
