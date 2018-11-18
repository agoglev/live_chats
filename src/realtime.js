let lastEventId = 0;
let socket = null;

let ppTimer = null;
let pongTimer = null;
let eventHandler = false;

export function setEventHandler(handler) {
  eventHandler = handler;
}

export default function init() {
  connect();
}

function connect() {
  socket = new WebSocket('wss://dateapp.ru/live_chats_ws/?token=' + window.VkToken + '&last_event_id=' + lastEventId);
  socket.onopen = function() {
    console.log('ws connected');
  };

  socket.onclose = () => {
    console.log('closed');
    connectionDidClose();
  };
  socket.onmessage = messageDidReceive;

  socket.onerror = function(error) {
    console.log("ws err:", error.message);
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
    return;
  }

  lastEventId = data.id;
  if (eventHandler) {
    eventHandler(data.event);
  }
}
