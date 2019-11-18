const path = require('path');
module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        library: 'ggtuMap',
        libraryTarget: 'umd'
    },
    devServer: {
        contentBase: './public',
        compress: false,
        port: 8080,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.js'],
    }
};
