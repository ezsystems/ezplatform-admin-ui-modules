const path = require('path');

module.exports = (Encore) => {
    Encore
        .addEntry('ez-admin-ui-modules-udw-js', [path.resolve(__dirname, '../../src/modules/universal-discovery/universal.discovery.module.js')])
        .addEntry('ez-admin-ui-modules-mfu-js', [path.resolve(__dirname, '../../src/modules/multi-file-upload/multi.file.upload.module.js')])
        .addEntry('ez-admin-ui-modules-subitems-js', [path.resolve(__dirname, '../../src/modules/sub-items/sub.items.module.js')]);
};
