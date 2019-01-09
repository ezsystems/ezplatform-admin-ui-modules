const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        SubItems: './src/modules/sub-items/sub.items.module.js',
        UniversalDiscovery: './src/modules/universal-discovery/universal.discovery.module.tsx',
        MultiFileUpload: './src/modules/multi-file-upload/multi.file.upload.module.js',
    },
    output: {
        filename: '[name].module.js',
        path: path.resolve(__dirname, 'Resources/public/js'),
        library: ['eZ', 'modules', '[name]'],
        libraryTarget: 'umd',
        libraryExport: 'default',
    },
    devtool: 'source-map',
    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre",
                test: /\.js$/, loader: "source-map-loader" }
        ]
    },
    externals: {
        react: {
            root: 'React',
            commonjs2: 'react',
            commonjs: 'react',
            amd: 'react',
        },
        'react-dom': {
            root: 'ReactDOM',
            commonjs2: 'react-dom',
            commonjs: 'react-dom',
            amd: 'react-dom',
        },
        'prop-types': {
            root: 'PropTypes',
            commonjs2: 'prop-types',
            commonjs: 'prop-types',
            amd: 'prop-types',
        },
        jquery: {
            root: 'jQuery',
            commonjs2: 'jquery',
            commonjs: 'jquery',
            amd: 'jquery',
        },
    },
    plugins: [new CleanWebpackPlugin(['Resources/public/'])],
};
