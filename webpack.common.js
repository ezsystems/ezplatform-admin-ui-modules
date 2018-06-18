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
    },
    plugins: [new CleanWebpackPlugin(['Resources'])],
};
