import * as api from './services/api';

export const FREE_CHATS = 10;

let availFreeChats = 0;
let usedFreeChats = 0;
let availChats = 0;

export function getAvailableChats() {
  return new Promise((resolve, reject) => {
    api.vk('storage.get', {
      keys: 'free_chats,chats'
    }).then((resp) => {
      let keys = {};
      for (let i = 0; i < resp.length; i++) {
        const item = resp[i];
        keys[item.key] = item.value;
      }

      let result = 0;
      if (keys.free_chats) {
        let freeData = JSON.parse(keys.free_chats);
        const day = new Date(parseInt(freeData.ts, 10)).getDate();
        if (day !== new Date().getDate()) {
          result += FREE_CHATS;
          api.vk('storage.set', {
            key: 'free_chats',
            value: JSON.stringify({ts: new Date().getTime(), chats: 0})
          });
        } else {
          usedFreeChats = parseInt(freeData.chats, 10);
          result += Math.max(0, FREE_CHATS - usedFreeChats);
        }
      } else {
        result += FREE_CHATS;
      }

      availFreeChats = result;

      const buyChats = parseInt(keys.chats, 10);
      if (buyChats > 0) {
        result += buyChats;
        availChats = buyChats;
      }

      resolve(result);
    }).catch(reject);
  });
}

export function useChat() {
  if (availFreeChats > 0) {
    availFreeChats--;
    usedFreeChats++;
    api.vk('storage.set', {
      key: 'free_chats',
      value: JSON.stringify({ts: new Date().getTime(), chats: usedFreeChats})
    });
  } else if (availChats > 0) {
    availChats--;
    api.vk('storage.set', {
      key: 'chats',
      value: availChats
    });
  }
}

let _orderBoxPromise = false;
export function showOrderBox(item) {
  return new Promise((resolve, reject) => {
    const { VK } = window;

    VK.addCallback('onOrderBoxDone', _orderBoxCallback);
    VK.addCallback('onOrderSuccess', _onOrderSuccess);
    VK.addCallback('onOrderCancel', _onOrderCancel);
    VK.addCallback('onOrderFail', _onOrderFail);
    _orderBoxPromise = {resolve, reject};
    VK.callMethod('showOrderBox', {type: 'item', item});
  });
}

function _onOrderSuccess() {
  removeOrderCallbacks();
  if (!_orderBoxPromise) {
    return;
  }
  _orderBoxPromise.resolve();
  _orderBoxPromise = false;
}

function _onOrderCancel() {
  removeOrderCallbacks();
  if (!_orderBoxPromise) {
    return;
  }
  _orderBoxPromise.reject();
  _orderBoxPromise = false;
}

function _onOrderFail() {
  removeOrderCallbacks();
  if (!_orderBoxPromise) {
    return;
  }
  _orderBoxPromise.reject(true);
  _orderBoxPromise = false;
}

function removeOrderCallbacks() {
  const { VK } = window;
  VK.removeCallback('onOrderBoxDone', _orderBoxCallback);
  VK.removeCallback('onOrderSuccess', _onOrderSuccess);
  VK.removeCallback('onOrderCancel', _onOrderCancel);
  VK.removeCallback('onOrderFail', _onOrderFail);
}

function _orderBoxCallback(status) {
  removeOrderCallbacks();

  if (!_orderBoxPromise) {
    return;
  }

  if (status === 'success') {
    _orderBoxPromise.resolve();
  } else {
    _orderBoxPromise.reject(status === 'fail');
  }
  _orderBoxPromise = false;
}

export function incrChats(count) {
  availChats += count;
}
