const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env', {targets: {esmodules: true}} , '@babel/preset-react'],
                    plugins: ["@babel/plugin-proposal-class-properties", "@babel/plugin-transform-runtime"]
                  },
                }
            },
            {
                test: /\.css$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader"
                    ],
            },
        ],
    },
    // resolve: {
    //     extensions: ["*", ".js", ".jsx"],
    // },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public', 'index.html')
        }),
    ]
}