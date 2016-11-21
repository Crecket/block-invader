var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, 'public/');
var SRC_DIR = path.resolve(__dirname, 'src/');

var config = {
    entry: [
        SRC_DIR + '/app.js'
    ],
    output: {
        path: BUILD_DIR,
        filename: '[name].js',
        chunkFilename: "[id].js"
    },
    resolve: {
        extensions: ['', '.jsx', '.scss', '.js', '.json', '.css'],  // along the way, subsequent file(s) to be consumed by webpack
        modulesDirectories: [
            'node_modules',
            path.resolve(__dirname, './node_modules')
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: SRC_DIR + '/images/*',
                to: BUILD_DIR + '/img/',
                flatten: true
            },
        ], {
            copyUnmodified: false
        }),
        new webpack.NoErrorsPlugin(),
        new ExtractTextPlugin("[name].css", {
            allChunks: true
        }),
        new webpack.DefinePlugin({
            "PRODUCTION_MODE": process.env.NODE_ENV === "production" ? true : false,
            "DEVELOPMENT_MODE": process.env.NODE_ENV === "production" ? false : true,
        }),
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                include: SRC_DIR,
                exclude: /node_modules/
            }, {
                test: /\.json$/,
                loader: 'json-loader'
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            }
        ]
    }
};

module.exports = config;
