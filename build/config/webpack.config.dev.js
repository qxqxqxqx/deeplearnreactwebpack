/*
* @Author: qiaoxin
* @Date:   2019/3/28 16:25
* @Email: qiaoxinfc@gmail.com
* @File Name: webpack.config.dev
* @Description:
*/
const configs = require('./product.config');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const HappyPack = require('happypack');

const happyThreadPool = HappyPack.ThreadPool({size: 5});
const PolyfillJson = require('./polyfill-manifest.json');
const VendorsJson = require('./vendors-manifest.json');

// ----------------------------------
// get dev || pro Configuration
// ----------------------------------
const {
    COMPILER_PUBLIC_PATH,
    LESS_MODIFY_VARS,
    DIR_DIST_JSON,
    DIR_DIST_JS,
    DIR_DIST_FONTS,
    DIR_DIST_IMAGES,
    paths: {assignPath, client, dist}
} = configs;

// ----------------------------------
// entry Dev Configuration js文件的入口
// ----------------------------------
const entry = {
    app: [
        assignPath(client, 'index.tsx'),
        `webpack-hot-middleware/client?path=${COMPILER_PUBLIC_PATH}__webpack_hmr&reload=true`
    ]
};

// ----------------------------------
// module Dev Configuration
// ----------------------------------
const modules = {
    rules: [
        {
            test: /\.(c|sc|sa)ss$/,
            use: [
                {
                    loader: 'happypack/loader?id=scss'
                }
            ]
        },
        {
            test: /\.less$/,
            use: [
                {
                    loader: 'happypack/loader?id=less'
                }
            ]
        },
        {
            test: /\.(svg|woff2?|ttf|eot)(\?.*)?$/i,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        outputPath: DIR_DIST_FONTS
                    }
                }
            ]
        },
        {
            test: /\.(jpe?g|png|gif)(\?.*)?$/i,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        outputPath: DIR_DIST_IMAGES
                    }
                }
            ]
        },
        {
            type: 'javascript/auto',
            test: /\.(json)(\?.*)?$/i,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        name: '[name]_[hash].[ext]',
                        outputPath: DIR_DIST_JSON
                    }
                }
            ]
        }
    ]
};

// ----------------------------------
// optimization Configuration
// ----------------------------------
const optimization = {};

// ----------------------------------
// plugins Configuration
// ----------------------------------
const plugins = [
    new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: PolyfillJson
    }),
    new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: VendorsJson
    }),
    new HappyPack({
        id: 'babel',
        threadPool: happyThreadPool,
        loaders: ['babel-loader']
    }),
    new HappyPack({
        id: 'scss',
        threadPool: happyThreadPool,
        loaders: [
            {
                loader: 'style-loader'
            },
            {
                loader: 'css-loader'
            },
            {
                loader: 'sass-loader'
            },
            {
                loader: 'postcss-loader'
            }
        ]
    }),
    new HappyPack({
        id: 'less',
        threadPool: happyThreadPool,
        loaders: [
            {
                loader: 'style-loader'
            },
            {
                loader: 'css-loader'
            },
            {
                loader: 'postcss-loader'
            },
            {
                loader: 'less-loader'
            }
        ]
    }),
    new HtmlWebpackPlugin({
        title: 'deep learn webpack & react',
        hash: false,
        chunks: ['app'],
        chunksSortMode: 'manual',
        inject: true,
        cache: false,
        minify: {
            collapseWhitespace: true
        },
        filename: 'index.html',
        template: assignPath(client, 'index.html')
    }),
    new AddAssetHtmlPlugin([
        {
            includeSourcemap: false,
            filepath: assignPath(dist, DIR_DIST_JS, 'polyfill.lib*.js'),
            outputPath: DIR_DIST_JS,
            publicPath: `${COMPILER_PUBLIC_PATH}${DIR_DIST_JS}`
        },
        {
            includeSourcemap: false,
            filepath: assignPath(dist, DIR_DIST_JS, 'vendors.lib*.js'),
            outputPath: DIR_DIST_JS,
            publicPath: `${COMPILER_PUBLIC_PATH}${DIR_DIST_JS}`
        }
    ]),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
];

// ----------------------------------
// webpack Dev Config Configuration
// ----------------------------------
const webpackDevConfig = {
    entry,
    optimization,
    plugins,
    module: modules
};

module.exports = webpackDevConfig;



