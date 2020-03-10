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
            path.resolve(__dirname, '../../src/modules/universal-discovery/content.edit.tab.module.js'),
        ])
        .addEntry('ezplatform-admin-ui-modules-udw-extras-js', [
            path.resolve(__dirname, '../../src/modules/universal-discovery/content.meta.preview.module.js'),
            path.resolve(__dirname, '../../src/modules/universal-discovery/components/content-create-button/content.create.button.js'),
            path.resolve(__dirname, '../../src/modules/universal-discovery/components/content-edit-button/selected.item.edit.button.js'),
            path.resolve(__dirname, '../../src/modules/universal-discovery/components/sort-switcher/sort.switcher.js'),
            path.resolve(__dirname, '../../src/modules/universal-discovery/components/view-switcher/view.switcher.js'),
        ])
        .addEntry('ezplatform-admin-ui-modules-mfu-js', [
            path.resolve(__dirname, '../../src/modules/multi-file-upload/multi.file.upload.module.js'),
        ])
        .addEntry('ezplatform-admin-ui-modules-subitems-js', [path.resolve(__dirname, '../../src/modules/sub-items/sub.items.module.js')])
        .addEntry('ezplatform-admin-ui-modules-content-tree-js', [
            path.resolve(__dirname, '../../src/modules/content-tree/content.tree.module.js'),
        ]);
};
