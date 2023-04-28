const common_config = require("./webpack.common");
const config = {
    ...common_config,
    entry: {
        "docxyz_swc.umd": "./src/index.js",
    },
    module: {
        rules: [
            {
                test: /\.(js|mjs)$/,
                use: {
                    loader: "swc-loader"
                }
            }
        ]
    }
}
module.exports = [
    config,
    {
        ...config,
        entry: {
            "docxyz_swc.iife": "./src/index.js",
            "docxyz_swc.iife.min": "./src/index.js",
        },
        output: {
            ...config.output,
            iife: true,
        }
    },
    {
        ...config,
        entry: {
            "docxyz_swc.esm": "./src/index.js",
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


