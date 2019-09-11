/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2019-09-10 16:08:53
 * @Last Modified by: qiaoxin
 * @Last Modified time: 2019-09-11 10:31:42
 * @describe: 入口文件
 */
import 'whatwg-fetch';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Hello } from './components/Hello';

ReactDOM.render(
	<Hello compiler="TypeScript" framework="React" />,
	document.querySelector('#App')
);
