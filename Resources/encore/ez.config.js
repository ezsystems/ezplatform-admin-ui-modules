const path = require('path');

module.exports = (Encore) => {
    Encore.addEntry('ezplatform-admin-ui-modules-udw-js', [path.resolve(__dirname, '../../src/modules/ud/universal.discovery.module.js')])
        .addEntry('ezplatform-admin-ui-modules-udw-tabs-js', [
            path.resolve(__dirname, '../../src/modules/ud/browse.tab.module.js'),
            path.resolve(__dirname, '../../src/modules/ud/bookmarks.tab.module.js'),
            path.resolve(__dirname, '../../src/modules/ud/search.tab.module.js'),
        ])
        .addEntry('ezplatform-admin-ui-modules-mfu-js', [
            path.resolve(__dirname, '../../src/modules/multi-file-upload/multi.file.upload.module.js'),
        ])
        .addEntry('ezplatform-admin-ui-modules-subitems-js', [path.resolve(__dirname, '../../src/modules/sub-items/sub.items.module.js')])
        .addEntry('ezplatform-admin-ui-modules-content-tree-js', [
            path.resolve(__dirname, '../../src/modules/content-tree/content.tree.module.js'),
        ]);
};
