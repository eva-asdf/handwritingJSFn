function myCall(context = window, ...args) {
  // console.log(context, args);
  if (typeof context === 'number') {
    context = new Number(context)
  } else if (typeof context === 'string') {
    context = new String(context)
  }
  const key = Symbol('key')
  context[key] = this
  const res = context[key](args)
  delete context[key]
  return res
}

function myApply(context, args) {
  const key = Symbol('key')
  context[key] = this
  const res = context[key](...args)
  delete context[key]
  return res
}

function myBind(context = window, ...args) {
  const that = this
  return function a(...arg) {
    if (that instanceof a) {
      // 使用new
      return new this(args, arg)
    } else {
      return that.myCall(context, ...args, ...arg)
    }
  }
}

function mySoftBind(context, ...args) {
  const that = this
  function bonder(...arg) {
    const o = !this || this === (window || global || globalThis) ? context : this
    if (that instanceof bonder) {
      return new this(...args, ...arg)
    } else {
      return that.myCall(o, ...args, ...arg)
    }
  }
  bonder.prototype = Object.create(that.prototype)
  return bonder
}

function myNew(context, ...args) {
  const that = Object.create(null)
  that.__proto__ = context.prototype
  const res = context.myCall(that)
  if (typeof res === 'object') {
    return res
  } else {
    return that
  }
}

Function.prototype.myBind = myBind
Function.prototype.myApply = myApply
Function.prototype.myCall = myCall
Function.prototype.mySoftBind = mySoftBind