export function method(name, params = {}) {
  params.token = window.VkToken;
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
  message: 'message'
};

export function vk(method, params = {}) {
  if (window.AppId === 6757020) {
    params.test_mode = 1;
  }
  return new Promise((resolve, reject) => {
    window.VK.api(method, params, (resp) => {
      if (resp.response) {
        resolve(resp.response);
      } else {
        reject(resp.error);
      }
    });
  });
}
