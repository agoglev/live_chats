import 'core-js/es6';
import 'url-search-params-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import connect from '@vkontakte/vkui-connect';
import './index.css';
import App from './App';
import realtime from './realtime';
import * as utils from './utils';
import * as api from './services/api';
import * as payments from './payments';

const href = window.location.href;
const hashIndex = href.indexOf('#');
const search = href.substr(href.indexOf('?'), hashIndex > -1 ? hashIndex : href.length).replace('?is_mob=1?', '?is_mob=1&');

const urlParams = new URLSearchParams(search);
window.VkInitialSearch = window.location.search;
window.VkToken = urlParams.get('access_token');
window.VkAppsSign = urlParams.get('sign');
window.VkInfo = (JSON.parse(decodeURIComponent(urlParams.get('api_result'))) || {response: [{}]}).response[0];
window.VkInfo.sex = parseInt(window.VkInfo.sex, 10);
window.AppId = parseInt(urlParams.get('api_id'), 10);

if (window.VkToken) {
  window.isDG = true;
} else {
  window.isDG = false;
}

if (!window.isDG) {
  connect.send('VKWebAppInit', {});
  connect.send('VKWebAppGetUserInfo', {});

  connect.subscribe((e) => {
    const data = e.detail.data;
    console.log(data);
    switch (e.detail.type) {
      case 'VKWebAppAccessTokenReceived':
        api.handleAccessTokenEventSuccess(data.access_token);
        break;
      case 'VKWebAppAccessTokenFailed':
        api.handleAccessTokenEventFailed();
        //store.dispatch({type: actionTypes.VK_FAILED});
        break;
      case 'VKWebAppGetUserInfoResult':
        window.VkInfo = data;
        break;
      case 'VKWebAppGetUserInfoFailed':
        //
        break;
      case 'VKWebAppCallAPIMethodResult':
        api.handleMethodResult(parseInt(data.request_id, 10), data.response);
        break;
      case 'VKWebAppCallAPIMethodFailed':
        api.handleMethodError(data.error_data);
        break;
      case 'VKWebAppOpenPayFormResult':
        payments.resolveVkPayRequest(data.result && data.result.status);
        break;
      case 'VKWebAppOpenPayFormFailed':
        payments.resolveVkPayRequest(false);
        break;
      default:
        console.log(e.detail.type);
    }
  });

  connect.send('VKWebAppSetViewSettings', {status_bar_style: 'dark', action_bar_color: "#fff"});

  ReactDOM.render(<App/>, document.getElementById('root'));
  realtime();
} else {
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
}

utils.statReachGoal('view');

//serviceWorker.unregister();