/*
* @Author: qiaoxin
* @Date:   2018/11/8 10:19
* @Last Modified by:   qiaoxin
* @Last Modified time: 2018/11/8 10:19
* @Email: qiaoxinfc@gmail.com
* @File Path:
* @File Name: webpack.lib
* @Descript:
*/
const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const configs = require('./product.config');

const {
    env,
    DIR_BASE_PATH,
    DIR_DIST_JS,
    paths: {assignPath, dist},
    globals: {__PROD__}
} = configs;

// 依赖和app主文件分别打包 降低每次hotreload所需打包的时间
const polyfill = [
    'whatwg-fetch',
    'babel-polyfill'
];

const vendors = [
    'react',
    'react-dom',
    'react-router-dom',
    'redux',
    'react-redux',
    'redux-saga'
];

const dllConfig = {
    cache: true,
    mode: env,
    node: {
        fs: 'empty'
    },
    entry: {
        vendors,
        polyfill
    },
    output: {
        // 打包后文件存放的位置
        path: dist,
        // entry chunk产出时的名称
        filename: `${DIR_DIST_JS}/[name].lib.[hash:5].js`,
        // async chunk产出时的名称
        chunkFilename: `${DIR_DIST_JS}/[name].lib.[hash:5].js`,
        library: '[name]_lib_[hash:5]'
    },
    resolve: {
        extensions: ['.js', '.json', '.css', '.style', '.sass', '.scss', 'less'],
        alias: {
            'react': path.join(process.cwd(), 'node_modules/react'),
            'react-dom': path.join(process.cwd(), 'node_modules/react-dom')
        }
    },
    module: {
        rules: [
            {
                test: /\.json$/,
                use: [
                    {
                        loader: 'json-loader'
                    }
                ]
            }, {
                test: /\.css$/,
                use: [
                    {
                        loader: 'css-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, './[name]-manifest.json'),
            name: '[name]_lib_[hash:5]',
            context: __dirname
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['!polyfill*', '!venders*'],
            verbose: true,
            dry: false
        })
    ]
}

// 生产模式下压缩文件
if(__PROD__) {
    dllConfig.optimization = {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    }
}

module.exports = dllConfig;