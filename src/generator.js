function Thunk(fn) {
  return function (...args) {
    return function (cb) {
      return fn.call(this, ...args, cb)
    }
  }
}

function ThunkPromise(fn) {
  return function (...args) {
    return new Promise((res, rej) => {
      fn(...args).then(res, rej)
    })
  }
}

// 结合Generator实现当一个异步完成后自动调用下一个
function run(gen) {
  const g = gen()

  function next(data) {
    const result = g.next(data)
    if (!result.done) {
      result.value.then((data) => {
        next(data)
      })
    }

  }
  next()
}
