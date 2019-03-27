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
