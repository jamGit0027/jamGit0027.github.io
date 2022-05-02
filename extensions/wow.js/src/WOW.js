function isIn(needle, haystack) {
  return haystack.indexOf(needle) >= 0;
}

function extend(custom, defaults) {
  for (const key in defaults) {
    if (custom[key] == null) {
      const value = defaults[key];
      custom[key] = value;
    }
  }
  return custom;
}

function isMobile(agent) {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agent);
}

function createEvent(event, bubble = false, cancel = false, detail = null) {
  let customEvent;
  if (document.createEvent != null) { // W3C DOM
    customEvent = document.createEvent('CustomEvent');
    customEvent.initCustomEvent(event, bubble, cancel, detail);
  } else if (document.createEventObject != null) { // IE DOM < 9
    customEvent = document.createEventObject();
    customEvent.eventType = event;
  } else {
    customEvent.eventName = event;
  }

  return customEvent;
}

function emitEvent(elem, event) {
  if (elem.dispatchEvent != null) { // W3C DOM
    elem.dispatchEvent(event);
  } else if (event in (elem != null)) {
    elem[event]();
  } else if (`on${event}` in (elem != null)) {
    elem[`on${event}`]();
  }
}

function addEvent(elem, event, fn) {
  if (elem.addEventListener != null) { // W3C DOM
    elem.addEventListener(event, fn, false);
  } else if (elem.attachEvent != null) { // IE DOM
    elem.attachEvent(`on${event}`, fn);
  } else { // fallback
    elem[event] = fn;
  }
}

function removeEvent(elem, event, fn) {
  if (elem.removeEventListener != null) { // W3C DOM
    elem.removeEventListener(event, fn, false);
  } else if (elem.detachEvent != null) { // IE DOM
    elem.detachEvent(`on${event}`, fn);
  } else { // fallback
    delete elem[event];
  }
}

function getInnerHeight() {
  if ('innerHeight' in window) {
    return window.innerHeight;
  }

  return document.documentElement.clientHeight;
}

// Minimalistic WeakMap shim, just in case.
const WeakMap = window.WeakMap || window.MozWeakMap ||
class WeakMap {
  constructor() {
    this.keys = [];
    this.values = [];
  }

  get(key) {
    for (let i = 0; i < this.keys.length; i++) {
      const item = this.keys[i];
      if (item === key) {
        return this.values[i];
      }
    }
    return undefined;
  }

  set(key, value) {
    for (let i = 0; i < this.keys.length; i++) {
      const item = this.keys[i];
      if (item === key) {
        this.values[i] = value;
        return this;
      }
    }
    this.keys.push(key);
    this.values.push(value);
    return this;
  }
};

// Dummy MutationObserver, to avoid raising exceptions.
const MutationObserver =
  window.MutationObserver || window.WebkitMutationObserver ||
  window.MozMutationObserver ||
  class MutationObserver {
    constructor() {
      if (typeof console !== 'undefined' && console !== null) {
        console.warn('MutationObserver is not supported by your browser.');
        console.warn(
          'WOW.js cannot detect dom mutations, please call .sync() after loading new content.'
        );
      }
    }

    static notSupported = true;

    observe() {}
  };

// getComputedStyle shim, from http://stackoverflow.com/a/21797294
const getComputedStyle = window.getComputedStyle ||
function getComputedStyle(el) {
  const getComputedStyleRX = /(\-([a-z]){1})/g;
  return {
    getPropertyValue(prop) {
      if (prop === 'float') { prop = 'styleFloat'; }
      if (getComputedStyleRX.test(prop)) {
        prop.replace(getComputedStyleRX, (_, _char) => _char.toUpperCase());
      }
      const { currentStyle } = el;
      return (currentStyle != null ? currentStyle[prop] : void 0) || null;
    },
  };
};
