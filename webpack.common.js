const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        SubItems: './src/modules/sub-items/sub.items.module.js',
        UniversalDiscovery: './src/modules/universal-discovery/universal.discovery.module.js',
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
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
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
