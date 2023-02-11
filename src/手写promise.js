const pending = Symbol('pending')
const fullfill = Symbol('fullfill')
const rejected = Symbol('rejected')
class MyPromise {
  constructor(handle) {
    this.status = pending

    this.value = undefined
    this.reason = undefined

    //then执行时未执行resolve和reject时将其存储起来
    this.resolveCallBack = []
    this.rejectCallBack = []

    this._isFunction(handle) && handle(this._resolve.bind(this), this._reject.bind(this))
  }
  _resolve(value) {
    if (value instanceof MyPromise) {
      return value.then(this._resolve, this._reject)
    }

    if (this.status === pending) {
      this.status = fullfill
      this.value = value
      this.resolveCallBack.forEach(fn => fn(value))
    }

  }
  _reject(reason) {
    if (this.status === pending) {
      this.status = rejected
      this.reason = reason
      this.rejectCallBack.forEach(fn => fn(reason))
    }
  }
  _isFunction(fn) {
    return typeof fn === 'function'
  }
  then(onResolve, onReject) {
    onResolve = onResolve || (data => data)
    onReject = onReject || (err => { throw Error(err) })
    let promise2
    return promise2 = new MyPromise((resolve, reject) => {
      if (this.status === fullfill) {
        queueMicrotask(() => {
          try {
            const res = onResolve(this.value)
            this.resolvePromise(promise2, res, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      } else if (this.status === rejected) {
        queueMicrotask(() => {
          try {
            const err = onReject(this.reason)
            this.resolvePromise(promise2, err, resolve, reject)
          } catch (err) {
            reject(err)
          }
        })

      } else if (this.status === pending) {
        this.resolveCallBack.push(() => {
          queueMicrotask(() => {
            try {
              const res = onResolve(this.value)
              this.resolvePromise(promise2, res, resolve, reject)

            } catch (error) {
              reject(error)
            }
          })
        })
        this.rejectCallBack.push(() => {
          queueMicrotask(() => {
            try {
              const err = onReject(this.reason)
              this.resolvePromise(promise2, err, resolve, reject)

            } catch (err) {
              reject(err)
            }
          })
        })
      }

    })

  }
  resolvePromise(promise, result, resolve, reject) {
    if (promise === result) {
      reject(new Error('循环引用'))
    }
    let consumed = false,
      thenable;

    if (result instanceof MyPromise) {
      if (result.status === pending) {
        MyPromise.resolve().then(() => {
          result.then(function (data) {
            return resolvePromise(promise, data, resolve, reject)
          }, reject)
        })
      } else {
        MyPromise.resolve().then(() => {
          result.then(resolve, reject)
        })
      }
      return
    }

    const isComplexResult = target => (typeof target === 'function' || typeof target === 'object') && (target !== null)

    if (isComplexResult(result)) {
      try {
        thenable = result.then
        if (typeof thenable === 'function') {
          thenable.call(result, function (data) {
            if (consumed) {  // 防止多次执行，循环引用
              return
            }
            consumed = true
            return resolvePromise(promise, data, resolve, reject)
          }, function (err) {
            if (consumed) {
              return
            }
            consumed = true
            return reject(err)
          })
        } else {
          resolve(result)
        }
      } catch (error) {
        if (consumed) {
          return
        }
        consumed = true
        return reject(error)
      }
    } else {
      resolve(result)
    }
  }
  catch(onReject) {
    return this.then(undefined, onReject)
  }
  all(...args) {
    const n = args.length
    const result = []
    let c = 0
    return new MyPromise((resolve, reject) => {
      function addData(res, index) {
        c++
        result[index] = res
        c === n && resolve(result)
      }
      args.forEach((item, index) => {
        if (item instanceof MyPromise) {
          item.then((res) => {
            addData(res, index)
          }).catch(err => {
            reject(err)
          })
        } else {
          addData(item, index)
        }
      })
    })
  }
  static resolve(data) {
    if (data instanceof MyPromise) {
      return data
    } else if ((typeof data === 'function' || typeof data === 'object') && data !== null && typeof (data.then) === 'function') {
      return MyPromise.resolve().then(data.then)
      // data.then()
    }
    return new MyPromise((res) => {
      res(data)
    })
  }
  static reject() {
    return new MyPromise((_, rej) => {
      rej()
    })
  }
}


// 实现promise.map  限制并发
// 同时只能有几个并发，超出限制的要等到之前的完成后执行

class Limit {
  constructor(n) {
    this.limit = n
    this.queue = []
    this.count = 0
  }

  enqueue(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject })
    })
  }

  dequeue() {
    if (this.count < this.limit && this.queue.length) {
      const { fn, resolve, reject } = this.queue.shift()
      this.run(fn).then(resolve, reject)
    }
  }

  async run(fn) {
    this.count++
    const value = await fn()
    this.count--
    this.dequeue()
    return value
  }

  build(fn) {
    if (this.count < this.limit) {
      return new Promise((resolve, reject) => {
        this.run(fn).then(resolve, reject)
      })
    } else {
      return this.enqueue(fn)
    }
  }
}

// list 是各个的参数 
MyPromise.map = function (list, fn, { limitNum }) {
  const limit = new Limit(limitNum)
  return MyPromise.all(list.map(...args => limit.build(() => fn(...args))))
}