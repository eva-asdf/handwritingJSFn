function myReduce(cb, init) {
  if (!init && !this.length) new Error('Uncaught TypeError: Reduce of empty array with no initial value')
  if (!init && this.length === 1) return this[0]
  const n = this.length
  let previousValue, currentValue, currentIndex
  if (init) {
    currentIndex = 0
    previousValue = init
  } else {
    currentIndex = 1
    previousValue = this[0]
  }

  for (currentIndex; currentIndex < n; currentIndex++) {
    currentValue = this[currentIndex]
    previousValue = cb(previousValue, currentValue, currentIndex)
  }
  return previousValue
}

function myFlatMap(fn, context) {
  const fn1 = fn.bind(context)
  return this.map(fn1).flag(1)
}

function myForEach(callbackfn, thisArgs = globalThis) {
  const n = this.length
  for (let i = 0; i < n; i++) {
    callbackfn.call(thisArgs, this[i], i, this)
  }
}

function myMap(callbackfn, thisArgs = globalThis) {
  const n = this.length
  const arr = []
  for (let i = 0; i < n; i++) {
    arr.push(callbackfn.call(thisArgs, this[i], i, this))
  }
  return arr
}

function myFilter(callbackfn, thisArgs = globalThis) {
  const n = this.length
  const arr = []
  for (let i = 0; i < n; i++) {
    if (callbackfn.call(thisArgs, this[i], i, this)) {
      arr.push(this[i])
    }
  }
  return arr
}

function myEvery(callbackfn, thisArgs = globalThis) {
  const n = this.length
  for (let i = 0; i < n; i++) {
    if (!callbackfn.call(thisArgs, this[i], i, this)) return false
  }
  return true
}

function mySome(callbackfn, thisArgs = globalThis) {
  const n = this.length
  for (let i = 0; i < n; i++) {
    if (callbackfn.call(thisArgs, this[i], i, this)) return true
  }
  return false
}

function myFind(callbackfn, thisArgs = globalThis) {
  const n = this.length
  for (let i = 0; i < n; i++) {
    if (callbackfn.call(thisArgs, this[i], i, this)) return this[i]
  }
}

function myFindLast(callbackfn, thisArgs = globalThis) {
  const n = this.length
  for (let i = n - 1; i >= 0; i--) {
    if (callbackfn.call(thisArgs, this[i], i, this)) return this[i]
  }
}

function myFindIndex(callbackfn, thisArgs = globalThis) {
  const n = this.length
  for (let i = 0; i < n; i++) {
    if (callbackfn.call(thisArgs, this[i], i, this)) return i
  }
  return -1
}

function myFindLastIndex(callbackfn, thisArgs = globalThis) {
  const n = this.length
  for (let i = n - 1; i >= 0; i--) {
    if (callbackfn.call(thisArgs, this[i], i, this)) return i
  }
  return -1
}

function mySet() {
  const ans = []
  const n = this.length
  for (let i = 0; i < n; i++) {
    if (!ans.includes(this[i])) {
      ans.push(this[i])
    }
  }
  return ans
}

function myFlat(depth = Number.MAX_SAFE_INTEGER) {
  if (depth <= 0) return this
  const ans = []
  const n = this.length
  for (let i = 0; i < n; i++) {
    if (Array.isArray(this[i])) {
      ans.push(...this[i].myFlat(depth - 1))
    } else {
      ans.push(this[i])
    }
  }
  return ans
}

function myFlat1(arr) {
  let str = JSON.stringify(arr).replace(/(\[|\])/g, '');
  return JSON.parse('[' + str + ']')
}

function myFlat2(arr) {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flatten(cur) : cur);
  }, []);
}
