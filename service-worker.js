"use strict";var precacheConfig=[["/live_chats/index.html","ba6545dde7dcb5ba81a981ac11c8475a"],["/live_chats/static/css/main.78ca051d.css","33652aa8fb83ce45ea4b639fb873a7f1"],["/live_chats/static/js/main.7eb45259.js","c5e20e6913ddb536986f85f45f61cc11"],["/live_chats/static/media/ads_24.1b76e161.svg","1b76e161f15a91edd059cc01d00c8b8c"],["/live_chats/static/media/appearance_24.d4fd7e0e.svg","d4fd7e0ec169dce51b6eb0e137d95d88"],["/live_chats/static/media/back_24.6184b06b.svg","6184b06b81642b33d561bbc3f3c09873"],["/live_chats/static/media/community_24.2ff575e7.svg","2ff575e7dc5c27cb12ea8d838aeea9c6"],["/live_chats/static/media/done_24.a0041be2.svg","a0041be27d5eca3637758b3fead91ba0"],["/live_chats/static/media/fave_16.692fa5ac.svg","692fa5ac4eefd2bf2b4959ca1c2118e6"],["/live_chats/static/media/fave_16_white.97fb60ce.svg","97fb60cee5ce989362bf30c8c53e49be"],["/live_chats/static/media/filter_24.151039b6.svg","151039b67eedfb65b2dfd50f0aabf96b"],["/live_chats/static/media/gender_any_48.a7e603d7.png","a7e603d72c7a98316f663cd86fd66ecf"],["/live_chats/static/media/gender_female_48.a5f86daa.png","a5f86daa079b82d81310484000353a35"],["/live_chats/static/media/gender_male_48.8b253858.png","8b253858304d5995145654926562b947"],["/live_chats/static/media/hand_direct_ld_72.824eca67.png","824eca671a63490a29992b4e574d4e2a"],["/live_chats/static/media/hand_error_72.d4cec757.png","d4cec757e134bde6b022c791509f1939"],["/live_chats/static/media/hand_searching_72.39ca4abb.png","39ca4abb949db0623a4e1ed78e74b459"],["/live_chats/static/media/hand_skipped_72.4d86ad5a.png","4d86ad5a2a4a2886ba0a16925d50cd51"],["/live_chats/static/media/hand_welcome_72.6bce0fbf.png","6bce0fbf1186e6acedaa0c7adb48b5aa"],["/live_chats/static/media/like_24.eb1967eb.svg","eb1967eb87f71f810d228c5ac07f1abc"],["/live_chats/static/media/logout_24.d9fa11bd.svg","d9fa11bd2bb5dec831d02ecbb992c93d"],["/live_chats/static/media/message_24.30191ccb.svg","30191ccb8f5ed0ba4b460a3a5c32580a"],["/live_chats/static/media/message_like.6bfbe2b8.svg","6bfbe2b8d47f743247d38a8b525f945d"],["/live_chats/static/media/send_24.a9d807ac.svg","a9d807acc706cb0b2197969f333e6deb"],["/live_chats/static/media/share_24.7939609b.svg","7939609b059b8ae42a0b661e9731ea1f"],["/live_chats/static/media/spinner.f7da178e.svg","f7da178ea5732a2f4508945f35d8f3ab"],["/live_chats/static/media/star_24.4be34ea9.svg","4be34ea9e92fa85e1180dd956e58f884"],["/live_chats/static/media/subscription_header_dark.d6b249b2.svg","d6b249b2b56fa3dd2056a4b61e7b2023"],["/live_chats/static/media/subscription_header_light.8f523995.svg","8f5239956b26deba8866b7470431e2b7"],["/live_chats/static/media/vip_badge.1b1e31c9.svg","1b1e31c96ada1488beffbbe861b9c589"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,a){var t=new URL(e);return"/"===t.pathname.slice(-1)&&(t.pathname+=a),t.toString()},cleanResponse=function(a){return a.redirected?("body"in a?Promise.resolve(a.body):a.blob()).then(function(e){return new Response(e,{headers:a.headers,status:a.status,statusText:a.statusText})}):Promise.resolve(a)},createCacheKey=function(e,a,t,c){var s=new URL(e);return c&&s.pathname.match(c)||(s.search+=(s.search?"&":"")+encodeURIComponent(a)+"="+encodeURIComponent(t)),s.toString()},isPathWhitelisted=function(e,a){if(0===e.length)return!0;var t=new URL(a).pathname;return e.some(function(e){return t.match(e)})},stripIgnoredUrlParameters=function(e,t){var a=new URL(e);return a.hash="",a.search=a.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(a){return t.every(function(e){return!e.test(a[0])})}).map(function(e){return e.join("=")}).join("&"),a.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var a=e[0],t=e[1],c=new URL(a,self.location),s=createCacheKey(c,hashParamName,t,/\.\w{8}\./);return[c.toString(),s]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(c){return setOfCachedUrls(c).then(function(t){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(a){if(!t.has(a)){var e=new Request(a,{credentials:"same-origin"});return fetch(e).then(function(e){if(!e.ok)throw new Error("Request for "+a+" returned a response with status "+e.status);return cleanResponse(e).then(function(e){return c.put(a,e)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var t=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(a){return a.keys().then(function(e){return Promise.all(e.map(function(e){if(!t.has(e.url))return a.delete(e)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(a){if("GET"===a.request.method){var e,t=stripIgnoredUrlParameters(a.request.url,ignoreUrlParametersMatching),c="index.html";(e=urlsToCacheKeys.has(t))||(t=addDirectoryIndex(t,c),e=urlsToCacheKeys.has(t));var s="/live_chats/index.html";!e&&"navigate"===a.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],a.request.url)&&(t=new URL(s,self.location).toString(),e=urlsToCacheKeys.has(t)),e&&a.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(t)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(e){return console.warn('Couldn\'t serve response for "%s" from cache: %O',a.request.url,e),fetch(a.request)}))}});