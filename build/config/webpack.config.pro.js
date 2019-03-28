/*
* @Author: qiaoxin
* @Date:   2019/3/28 17:52
* @Email: qiaoxinfc@gmail.com
* @File Name: webpack.config.pro.js
* @Description:
*/
const configs = require('./product.config');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HappyPack = require('happypack');

const happyThreadPool = HappyPack.ThreadPool({ size: 5 });
const ImageminPlugin = require('imagemin-webpack-plugin').default;
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
    DIR_DIST_CSS,
    DIR_DIST_FONTS,
    DIR_DIST_IMAGES,
    paths: {assignPath, client, dist}
} = configs;

// ----------------------------------
// entry Dev Configuration
// ----------------------------------
const entry = {
    app: [
        assignPath(client, 'index.js')
    ]
};

// ----------------------------------
// module Pro Configuration
// ----------------------------------
const modules = {
    rules: [
        {
            test: /\.(c|sc|sa)ss$/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'happypack/loader?id=scss'
                }
            ]
        },
        {
            test: /\.less$/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'happypack/loader?id=less'
                }
            ]
        },
        {
            test: /\.(svg|woff2?|ttf|eot)(\?.*)?$/i,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name]_[hash].[ext]',
                        outputPath: `${DIR_DIST_FONTS}`
                    }
                }
            ]
        },
        {
            test: /\.(jpe?g|png|gif)(\?.*)?$/i,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name]_[hash].[ext]',
                        outputPath: `${DIR_DIST_IMAGES}`
                    }
                }
            ]
        },
        {
            type: 'javascript/auto',
            test: /\.(json)(\?.*)?$/i,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name]_[hash].[ext]',
                        outputPath: `${DIR_DIST_JSON}`
                    }
                }
            ]
        }
    ]
};


// ----------------------------------
// optimization Configuration
// ----------------------------------
const optimization = {
    // minimize: true,
    minimizer: [
        new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: true, // set to true if you want JS source maps
            uglifyOptions: {
                compress: {
                    // 删除所有的 `console` 语句
                    drop_console: true
                }
            }
        }),
        new OptimizeCSSAssetsPlugin({})
    ]
};

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
                loader: 'css-loader',
                options: {
                    minimize: true // css压缩
                }
            },
            {
                loader: 'postcss-loader'
            },
            {
                loader: 'sass-loader'
            }
        ]
    }),
    new HappyPack({
        id: 'less',
        threadPool: happyThreadPool,
        loaders: [
            {
                loader: 'css-loader',
                options: {
                    minimize: true // css压缩
                }
            },
            {
                loader: 'postcss-loader'
            },
            {
                loader: 'less-loader',
                options: {
                    javascriptEnabled: true,
                    modifyVars: LESS_MODIFY_VARS
                }
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
    new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: `${DIR_DIST_CSS}/[name].min.[chunkhash:5].css`,
        chunkFilename: `${DIR_DIST_CSS}/[id].min.[chunkhash:5].css`
    }),
    new ImageminPlugin({
        pngquant: {
            quality: '95-100'
        }
    })
];

// ----------------------------------
// webpack Dev Config Configuration
// ----------------------------------
const webpackProConfig = {
    entry,
    optimization,
    plugins,
    module: modules
};

module.exports = webpackProConfig;
