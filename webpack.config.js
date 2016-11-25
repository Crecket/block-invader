var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
// var CopyWebpackPlugin = require('copy-webpack-plugin');

// env variable check
var DEV = process.env.NODE_ENV !== "production";

var BUILD_DIR = path.resolve(__dirname, 'public/');
var SRC_DIR = path.resolve(__dirname, 'src/');

var config = {
    entry: [
        SRC_DIR + '/app/app.js'
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
        // new CopyWebpackPlugin([
        //     {
        //         from: SRC_DIR + '/images/*',
        //         to: BUILD_DIR + '/img/',
        //         flatten: true
        //     },
        // ], {
        //     copyUnmodified: false
        // }),
        new webpack.NoErrorsPlugin(),
        new ExtractTextPlugin("[name].css", {
            allChunks: true
        }),
        new webpack.DefinePlugin({
            "NODE_ENV": process.env.NODE_ENV,
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

if (!DEV) {
    // In production mode add the uglify plugin
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }))
}

module.exports = config;
