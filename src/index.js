import 'core-js/es6';
import 'url-search-params-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import realtime from './realtime';
import * as utils from './utils';

const urlParams = new URLSearchParams(window.location.search);
window.VkToken = urlParams.get('access_token');
window.VkInfo = JSON.parse(urlParams.get('api_result')).response[0];
window.VkInfo.sex = parseInt(window.VkInfo.sex, 10);

ReactDOM.render(<App />, document.getElementById('root'));
realtime();

window.VK.init(function() {
  console.log('WTF');
  window.VK.addCallback('onScrollTop', function(vkScrollPos, vkHeight, vkOffset){
    window.vkHeight = vkHeight;
    utils.updateVkFrameHeight();
  });

  try {
    window.VK.callMethod('scrollTop');
  } catch (e) {

  }
}, function() {
  // API initialization failed
  // Can reload page here
}, '5.87');

serviceWorker.unregister();