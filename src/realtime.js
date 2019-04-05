let lastEventId = 0;
let socket = null;

let ppTimer = null;
let pongTimer = null;
let eventHandler = false;
let closedByClient = false;

export function setEventHandler(handler) {
  eventHandler = handler;
}

export default function init() {
  connect();
}

function connect() {
  let params = {
    last_event_id: lastEventId
  };

  if (window.VkToken) {
    params.token = window.VkToken;
  } else if (window.VkAppsSign) {
    params.sign = window.VkAppsSign;
    params.url = window.VkInitialSearch;
  }

  let paramsArr = [];
  for (let i in params) {
    paramsArr.push(`${i}=${encodeURIComponent(params[i])}`);
  }

  closedByClient = false;

  socket = new WebSocket('wss://dateapp.ru/live_chats_ws/?' + paramsArr.join('&'));

  socket.onopen = function() {
    console.log('ws connected');
  };

  socket.onclose = () => {
    console.log('closed');
  };
  socket.onmessage = messageDidReceive;

  socket.onerror = function(error) {
    console.log("ws err:", error.message);
    if (!closedByClient) {
      connectionDidClose();
    }
  };
}

function connectionDidClose() {
  setTimeout(connect, 3000);
  clearTimeout(ppTimer);
  clearTimeout(pongTimer);
}

function messageDidReceive(e) {
  let data;
  try {
    data = JSON.parse(e.data);
  } catch(e) {
    console.log('err', e.message);
    return;
  }

  lastEventId = data.id;

  if (data.type === 'multi_connections') {
    closedByClient = true;
    socket.close();
  }

  if (eventHandler) {
    eventHandler(data.event);
  }
}
