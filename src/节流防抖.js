// 定时器节流
function throttle(cb, time, context = this) {
  let timer = null
  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        cb.apply(context, args)
        clearTimeout(timer)
      }, time);
    }
  }
}
// 时间戳节流
function throttle(cb, wait, context = this) {
  let previous = 0
  return function (...args) {
    const now = Date.now()
    if (now - previous > wait) {
      cb.apply(context, args)
      previous = now
    }
  }
}

// 大神代码
// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
_.throttle = function (func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function () {
    previous = options.leading === false ? 0 : _.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null; //显示地释放内存，防止内存泄漏
  };

  var throttled = function () {
    var now = _.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
};



// 非立即防抖
function debounce(cb, time, context) {
  let timer = null
  context = context || this
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      cb.apply(context, args)
      clearTimeout(timer)
    }, time);
  }
}
// 立即防抖
function debounce1(cb, wait, context) {
  context = context || this
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    else cb.apply(context, ...args)
    timer = setTimeout(() => {
      clearTimeout(timer)
    }, wait);
  }
}

// 大神代码
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
_.debounce = function (func, wait, immediate) {
  var timeout, result;

  var later = function (context, args) {
    timeout = null;
    if (args) result = func.apply(context, args);
  };

  var debounced = restArgs(function (args) {
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      var callNow = !timeout;
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(this, args);
    } else {
      timeout = _.delay(later, wait, this, args);
    }

    return result;
  });

  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
};