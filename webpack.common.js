const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
let webpackCommon = {
    entry: {
        "docxyz.umd": "./src/index.js",
    },
    devtool: "source-map",
    output: {
        filename: "[name].js",
        globalObject: 'this',
        library: {
            name: "docxyz",
            type: "umd",
            //export: 'default'
        },
    },
    module: {
        rules: [
            {
                //test: /\.js$/,
                //include: [path.resolve(__dirname, "./src")],
                test: /\.(js|mjs)$/,
                exclude: /@babel(?:\/|\\{1,2})runtime/,
                use: {
                    loader: "babel-loader",
                    options: {
                        sourceType: 'unambiguous',
                        presets: ["@babel/preset-env"],
                        //plugins:[["@babel/plugin-proposal-class-properties", { "loose": true }]]
                    }
                }
            }
        ]
    },
    resolve: {
        fallback: {
            fs: false,
            events: require.resolve('events/'),
            crypto: require.resolve('crypto-browserify'),
            path: require.resolve('path-browserify'),
            //url: require.resolve('url'),
            buffer: require.resolve('buffer/'),
            //util: require.resolve('util/'),
            stream: require.resolve('stream-browserify/'),
            constants: require.resolve("constants-browserify"),
            //vm: require.resolve('vm-browserify'),
            zlib: require.resolve("browserify-zlib"),
            console: require.resolve("console-browserify")
        }
    },
    plugins: [new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer']
    })],
    mode: "none",
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                test: /\.min\.js$/,
            }),
        ],
    },
}
module.exports = webpackCommon;
