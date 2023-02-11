// 从左往右
const composeLToR = (...fn) => (...args) => fn.reduce((pre, cur) => cur(...pre), args)

// 从右往左
const composeRToL = (...fn) => fn.reduce((pre, cur) => (...args) => pre(cur(...args)))

// 懒函数实现单例
const once = (fn) => {
  return function o(...args) {
    const res = fn(...args)
    o = () => res
    return o()
  }
}

