const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        'sub.items': './src/modules/sub-items/sub.items.module.js',
        'universal.discovery': './src/modules/universal-discovery/universal.discovery.module.js',
        'multi.file.upload': './src/modules/multi-file-upload/multi.file.upload.module.js',
    },
    output: {
        filename: '[name].module.js',
        path: path.resolve(__dirname, 'dist'),
        library: ['ez', '[name]'],
        libraryTarget: 'umd',
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    externals: {
        'react': {
            root: 'React',
            commonjs2: 'react',
            commonjs: 'react',
            amd: 'react'
        },
        'react-dom': {
            root: 'ReactDOM',
            commonjs2: 'react-dom',
            commonjs: 'react-dom',
            amd: 'react-dom'
        }
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new UglifyJSPlugin({
            sourceMap: true,
            uglifyOptions: {
                ecma: 6
            }
        })
    ]
};
