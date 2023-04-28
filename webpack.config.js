//const path = require("path");
//const webpack = require("webpack");
//const TerserPlugin = require("terser-webpack-plugin");
const config = require("./webpack.common");
module.exports = [
    config,
    {
        ...config,
        entry: {
            //"docxyz.iife": "./src/index.js",
            "docxyz.iife.min": "./src/index.js",
        },
        output: {
            ...config.output,
            iife: true,
        }
    },
    {
        ...config,
        entry: {
            "docxyz.esm": "./src/index.js",
        },
        output: {
            ...config.output,
            library: {
                //name: 'docxyz',
                type: "module"
            }
        },
        experiments: {
            outputModule: true
        }
    }
];

exports.config = config;

