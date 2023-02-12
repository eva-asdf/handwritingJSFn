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

class myMap {
  constructor(iterable) {
    this.objectMap = []
    this.basicMap = {}
    this.size = 0
    if (iterable !== undefined) {
      if (this._isIterable(iterable)) {
        try {
          for (const val of iterable) {
            this.set(val[0], val[1])
          }
        } catch (error) {
          throw Error('格式错误')
        }
      } else {
        throw Error('不是可迭代对象')
      }
    }
  }
  _isIterable(obj) {
    return typeof obj === 'object' && obj !== null && typeof obj[Symbol.iterator] === 'function'
  }
  _isBasic(target) {
    return typeof target !== 'object' && typeof target !== 'function'
  }
  _findObjectKey(key) {
    return this.objectMap.find(val => val[0] === key)
  }
  set(key, value) {
    if (!this.has(key)) {
      this.size++
      if (this._isBasic(key)) {
        this.basicMap[key] = value
      } else {
        this.objectMap.push([key, value])
      }
    } else {
      if (this._isBasic(key)) {
        this.basicMap[key] = value
      } else {
        const item = this._findObjectKey(key)
        item[1] = value
      }
    }
    return this
  }
  get(key) {
    if (this._isBasic(key)) return this.basicMap[key]
    const item = this._findObjectKey(key)
    return item ? item[1] : undefined
  }
  has(key) {
    if (this._isBasic(key)) {
      return this.basicMap.hasOwnProperty(key)
    } else {
      return this._findObjectKey(key) ? true : false
    }
  }
  clear() {
    this.objectMap.length = 0
    this.basicMap = {}
    this.size = 0
  }
  delete(key) {
    if (this._isBasic(key)) {
      if (this.basicMap.hasOwnProperty(key)) {
        delete this.basicMap[key]
        this.size--
        return true
      }
      return false
    } else {
      const idx = this.objectMap.findIndex(val => val[0] === key)
      if (idx !== -1) {
        this.objectMap.splice(idx, 1)
        this.size--
        return true
      }
      return false
    }
  }
  keys() {
    return [...Object.keys(this.basicMap), ...this.objectMap.map(val => val[0])]
  }
  values() {
    return [...Object.values(this.basicMap), ...this.objectMap.map(val => val[1])]
  }
  entries() {
    return [...Object.entries(this.basicMap), ...this.objectMap]
  }
  [Symbol.iterator]() {
    var index = 0;
    const entries = this.entries()
    const n = this.size
    return {
      next: function () {
        return index < n ?
          { value: entries[index++], done: false } :
          { value: undefined, done: true }
      },
      [Symbol.iterator]: function () {
        return this
      }
    }
  }
}
