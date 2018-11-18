
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function classNames() {
  let result = [];

  [].concat(Array.prototype.slice.call(arguments)).forEach(function (item) {
    if (!item) {
      return;
    }
    switch (typeof item === 'undefined' ? 'undefined' : typeof item) {
      case 'string':
        result.push(item);
        break;
      case 'object':
        Object.keys(item).forEach(function (key) {
          if (item[key]) {
            result.push(key);
          }
        });
        break;
      default:
        result.push('' + item);
    }
  });

  return result.join(' ');
}

const _throttleHelper = {};
export function throttle(ident, func, wait) {
  if (!_throttleHelper[ident]) {
    _throttleHelper[ident] = {};
  }

  clearTimeout(_throttleHelper[ident].timer);
  _throttleHelper[ident].func = func;
  _throttleHelper[ident].timer = setTimeout(() => {
    _throttleHelper[ident].func();
  }, wait);
}

export function isDev() {
  return window.location.hostname === 'localhost' || window.location.hostname.match(/^\d+.\d+.\d+.\d+$/)
}

export function isInspectOpen() {
  console.profile();
  console.profileEnd();
  if (console.clear) console.clear();
  return console.profile.length > 0;
}

export function cancelEvent(e) {
  e = e || window.event;

  if (!e) {
    return false;
  }
  if (e.originalEvent) {
    e = e.originalEvent;
  }
  e.preventDefault();
  e.stopPropagation();
  e.returnValue = false;
  return false;
}

export function genderText(gender, variants) { // gender 2 is female
  return parseInt(gender, 10) === 2 ? variants[0] : variants[1];
}

export function dateFormatShort(ts) {
  const curDate = new Date();
  const dt = Math.floor((curDate.getTime() - ts) / 1000);
  const days = Math.floor(dt / 86400);

  if (days === 0) {
    return 'сегодня';
  } else if (days === 1) {
    return 'вчера';
  } else {
    const date = new Date(ts);
    const months = ["Января","Февраля","Марта","Апреля","Мая","Июня","Июля","Августа","Сентября","Октября", "Ноября","Декабря"];

    if (date.getFullYear() === curDate.getFullYear()) {
      return date.getDate() + ' ' + months[date.getMonth()]
    }
    return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear()
  }
}

export function getUsrAge(ts) {
  const birthday = new Date(ts * 1000);
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export function isIOS() {
  return !!navigator.platform && /ipad|iphone|ipod/.test(navigator.platform.toLowerCase());
}

let StatsQueue = [];
export function statReachGoal(eventName) {
  if (isDev()) {
    return;
  }
  if (window.yaCounter50682085 && window.yaCounter50682085.reachGoal) {
    window.yaCounter50682085.reachGoal(eventName);
  } else {
    StatsQueue.push(eventName);
  }
}

export function stripHTML(e){return e?e.replace(/<(?:.|\s)*?>/g,""):""}

export function updateVkFrameHeight() {
  console.log('here', window.vkHeight);
  window.VK.callMethod('resizeWindow', window.innerWidth, Math.max(window.vkHeight - 167, 600));
}

export function gram(number, variants, skipNumber) {
  const cases = [2, 0, 1, 1, 1, 2];
  let res = (variants[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5]]);
  if (!skipNumber) {
    res = number+' '+res;
  }
  return res;
}