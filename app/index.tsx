/*
* @Author: qiaoxin
* @Date:   2018/11/7 15:24
 * @Last Modified by: qiaoxin
 * @Last Modified time: 2019-05-09 16:18:00
* @Email: qiaoxinfc@gmail.com
* @File Path:
* @File Name: index
* @Descript:
*/
import 'whatwg-fetch';
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Hello } from "./components/Hello";

ReactDOM.render(
    <Hello compiler="TypeScript" framework="React" />,
    document.querySelector('#App')
);
