/* global __dirname */

const process = require('process');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const analyzeBundle = process.argv.indexOf('--analyze-bundle') !== -1;

module.exports = {
    // The inline-source-map is used to allow debugging the unit tests with Karma
    devtool: 'source-map',
    mode: 'production',
    node: {
        // Allow the use of the real filename of the module being executed. By
        // default Webpack does not leak path-related information and provides a
        // value that is a mock (/index.js).
        __filename: true
    },
    
    output: {
        filename: `yyt.min.js`,
        path: process.cwd(),
        sourceMapFilename: `yyt.min.js.map`
    },
    performance: {
        hints: false,
        maxAssetSize: 750 * 1024,
        maxEntrypointSize: 750 * 1024
    },
    plugins: [
        analyzeBundle
            && new BundleAnalyzerPlugin({
                analyzerMode: 'disabled',
                generateStatsFile: true
            })
    ].filter(Boolean)
};
