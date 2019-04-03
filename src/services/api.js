import connect from '@vkontakte/vkui-connect';

export function method(name, params = {}) {
  if (window.VkToken) {
    params.token = window.VkToken;
  } else if (window.VkAppsSign) {
    params.sign = window.VkAppsSign;
    params.url = window.VkInitialSearch;
  }
  return new Promise((resolve, reject) => {
    let apiEntry = 'https://dateapp.ru/live_chats';
    fetch(`${apiEntry}/${name}`, {
      method: 'POST',
      cache: 'no-cache',
      body: JSON.stringify(params),
      credentials: 'omit',
      async: false,
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          reject(json.error);
        } else {
          resolve(json.response);
        }
      }).catch(() => reject({http: true}));
  });
}

export const methods = {
  check: 'check',
  accept: 'accept',
  reject: 'reject',
  leave: 'leave',
  message: 'message',
  typing: 'typing',
  updateOnline: 'update_online'
};

let vkRequestId = 0;
let vkRequestCallbacks = {};
export function vk(method, params = {}) {
  return new Promise((resolve, reject) => {
    if (window.isDG) {
      if (window.AppId === 6757020) {
        params.test_mode = 1;
      }
      window.VK.api(method, params, (resp) => {
        if (resp.response) {
          resolve(resp.response);
        } else {
          reject(resp.error);
        }
      });
    } else {
      requestAccessToken().then((accessToken) => {
        const reqId = ++vkRequestId;

        vkRequestCallbacks[reqId] = {resolve, reject};

        params.access_token = accessToken;
        params.request_id = reqId;
        params.v = '5.85';
        connect.send('VKWebAppCallAPIMethod', {
          method,
          params,
          request_id: String(reqId)
        });
      }).catch(() => reject());
    }
  });
}

export function handleMethodResult(requestId, response) {
  if (vkRequestCallbacks[requestId]) {
    vkRequestCallbacks[requestId].resolve(response);
    delete vkRequestCallbacks[requestId];
  }
}

export function handleMethodError(error) {
  if (error.request_params) {
    let requestId = false;
    for (let i = 0; i < error.request_params.length; i++) {
      const param = error.request_params[i];
      if (param.key === 'request_id') {
        requestId = parseInt(param.value, 10);
      }
    }
    vkRequestCallbacks[requestId].reject();
    delete vkRequestCallbacks[requestId];
  }
}

let accessTokenPromise = false;
export function requestAccessToken() {
  return new Promise((resolve, reject) => {
    if (window.vkAccessToken) {
      return resolve(window.vkAccessToken);
    }
    accessTokenPromise = {resolve, reject};
    connect.send('VKWebAppGetAuthToken', {app_id: 6757551, scope: 'photos'});
  });
}

export function handleAccessTokenEventSuccess(token) {
  if (accessTokenPromise) {
    accessTokenPromise.resolve(token);
    window.vkAccessToken = token;
    accessTokenPromise = false;
  }
}

export function handleAccessTokenEventFailed() {
  if (accessTokenPromise) {
    accessTokenPromise.reject();
    accessTokenPromise = false;
  }
}
