const path = require('path');

module.exports = (Encore) => {
    Encore.addEntry('ezplatform-admin-ui-modules-udw-js', [
        path.resolve(__dirname, '../../src/modules/universal-discovery/universal.discovery.module.js'),
    ])
        .addEntry('ezplatform-admin-ui-modules-udw-tabs-js', [
            path.resolve(__dirname, '../../src/modules/universal-discovery/browse.tab.module.js'),
            path.resolve(__dirname, '../../src/modules/universal-discovery/bookmarks.tab.module.js'),
            path.resolve(__dirname, '../../src/modules/universal-discovery/search.tab.module.js'),
            path.resolve(__dirname, '../../src/modules/universal-discovery/content.create.tab.module.js'),
            path.resolve(__dirname, '../../src/modules/universal-discovery/content.meta.preview.module.js'),
        ])
        .addEntry('ezplatform-admin-ui-modules-mfu-js', [
            path.resolve(__dirname, '../../src/modules/multi-file-upload/multi.file.upload.module.js'),
        ])
        .addEntry('ezplatform-admin-ui-modules-subitems-js', [path.resolve(__dirname, '../../src/modules/sub-items/sub.items.module.js')])
        .addEntry('ezplatform-admin-ui-modules-content-tree-js', [
            path.resolve(__dirname, '../../src/modules/content-tree/content.tree.module.js'),
        ]);
};
