
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
  if (window.yaCounter51214298 && window.yaCounter51214298.reachGoal) {
    window.yaCounter51214298.reachGoal(eventName);
  } else {
    StatsQueue.push(eventName);
  }
}

export function stripHTML(e){return e?e.replace(/<(?:.|\s)*?>/g,""):""}

export function updateVkFrameHeight() {
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

export function availChatsStr(count) {
  const pref = gram(count, ['Остался', 'Осталось', 'Осталось'], true);
  return pref + ' ' + gram(count, ['чат', 'чата', 'чатов']);
}

export function scrollToY(scrollTargetY, speed, easing = 'easeInOutQuint') {
  // scrollTargetY: the target scrollY property of the window
  // speed: time in pixels per second
  // easing: easing equation to use

  var scrollY = window.scrollY,
    scrollTargetY = scrollTargetY || 0,
    speed = speed || 2000,
    easing = easing || 'easeOutSine',
    currentTime = 0;

  // min time .1, max time .8 seconds
  var time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, .8));

  // easing equations from https://github.com/danro/easing-js/blob/master/easing.js
  var PI_D2 = Math.PI / 2,
    easingEquations = {
      easeOutSine: function (pos) {
        return Math.sin(pos * (Math.PI / 2));
      },
      easeInOutSine: function (pos) {
        return (-0.5 * (Math.cos(Math.PI * pos) - 1));
      },
      easeInOutQuint: function (pos) {
        if ((pos /= 0.5) < 1) {
          return 0.5 * Math.pow(pos, 5);
        }
        return 0.5 * (Math.pow((pos - 2), 5) + 2);
      }
    };

  // add animation loop
  function tick() {
    currentTime += 1 / 60;

    var p = currentTime / time;
    var t = easingEquations[easing](p);

    if (p < 1) {
      window.requestAnimationFrame(tick);

      window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
    } else {
      console.log('scroll done');
      window.scrollTo(0, scrollTargetY);
    }
  }

  // call it once to get started
  tick();
}

export function isAndroid() {
  return window.Platform === 'mobile_android'// || true;
}