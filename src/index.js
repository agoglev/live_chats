import 'core-js/es6';
import 'url-search-params-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import realtime from './realtime';
import * as utils from './utils';

const href = window.location.href;
const hashIndex = href.indexOf('#');
const search = href.substr(href.indexOf('?'), hashIndex > -1 ? hashIndex : href.length).replace('?is_mob=1?', '?is_mob=1&');

const urlParams = new URLSearchParams(search);
window.VkToken = urlParams.get('access_token');
window.VkInfo = (JSON.parse(decodeURIComponent(urlParams.get('api_result'))) || {response: [{}]}).response[0];
window.VkInfo.sex = parseInt(window.VkInfo.sex, 10);
window.AppId = parseInt(urlParams.get('api_id'), 10);

window.onload = () => {
  window.VK.init(function () {
    try {
      window.VK.addCallback('onScrollTop', function (vkScrollPos, vkHeight, vkOffset) {
        window.vkHeight = vkHeight;
        utils.updateVkFrameHeight();
      });
      window.VK.callMethod('scrollTop');
    } catch (e) {

    }
  }, function () {
    // API initialization failed
    // Can reload page here
  }, '5.87');

  ReactDOM.render(<App/>, document.getElementById('root'));
  realtime();
};

serviceWorker.unregister();

utils.statReachGoal('view');