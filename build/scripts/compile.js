/**
 *@Author: hy-zhangb
 *Date: 2018/5/9 13:43
 * @Last Modified by: qiaoxin
 * @Last Modified time: 2019-05-09 16:30:19
 *Email: lovewinders@163.com
 *File Path: Machine-Learning - compile
 *@File Name: compile
 *@Description: Description
 */
const fs = require('fs-extra');
const webpack = require('webpack');
const debug = require('debug')('app:bin:compile');
const webpackConfig = require('../config/webpack.config');
const configs = require('../config/product.config');

// ----------------------------------
// get dev || pro Configuration
// ----------------------------------
const {DIR_PUBLIC, paths: {assignPath, public: publicPath, dist}} = configs;

// Wrapper around webpack to promisify its compiler and supply friendly logging
const webpackCompiler = (webpackConfig) =>
    new Promise((resolve, reject) => {

        const compiler = webpack(webpackConfig);

        compiler.run((err, stats) => {

            if(err) {

                debug('Webpack compiler encountered a fatal error.', err);
                return reject(err);

            }

            const jsonStats = stats.toJson();
            debug('Webpack compile completed.');
            debug(stats.toString({
                chunks: true,
                chunkModules: true,
                colors: true
            }));

            if(jsonStats.errors.length > 0) {

                debug('Webpack compiler encountered errors.');
                debug(jsonStats.errors.join('\n'));
                return reject(new Error('Webpack compiler encountered errors'));

            } if(jsonStats.warnings.length > 0) {

                debug('Webpack compiler encountered warnings.');
                debug(jsonStats.warnings.join('\n'));

            } else {

                debug('No errors or warnings encountered.');

            }
            resolve(jsonStats);

        });

    });

const compile = () => {

    debug('Starting compiler.');
    return Promise.resolve()
        .then(() => webpackCompiler(webpackConfig))
        .then((stats) => {

            if(stats.warnings.length && false) {

                throw new Error('Config set to fail on warning, exiting with status code "1".');

            }
            debug('Copying static assets to dist folder.');
            // fs.copyFileSync(publicPath, dist);
            fs.copySync(publicPath, assignPath(dist, DIR_PUBLIC));

        })
        .then(() => {

            debug('Compilation completed successfully.');

        })
        .catch((err) => {

            debug('Compiler encountered an error.', err);
            process.exit(1);

        });

};

compile();
