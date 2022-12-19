
const config = require('./webpack-shared-config');
module.exports = [
    Object.assign({}, config, {
        entry: {
            'yyt.min.js': './index.js'
        },
        output: Object.assign({}, config.output, {
            library: 'YytConnect',
            libraryTarget: 'umd'
        })
    }),
];


