function myAsync(callback, ...args) {
  return new Promise((reslove) => {
    changeAwaitToGenerator(callback)();
    const gen = globalThis[Symbol.for('ccj.myGenerator')](...args)
    delete globalThis[Symbol.for('ccj.myGenerator')]
    run(gen, reslove)
  })
}

function isThenable(target) {
  return (typeof target === 'object' || typeof target === 'function') && typeof target.then === 'function'
}

function run(g, reslove) {
  function next(data) {
    const result = g.next(data)
    if (!result.done) {
      if (isThenable(result.value)) {
        result.value.then((data) => {
          next(data)
        })
      } else {
        reslove(result.value)
      }
    } else {

    }
  }
  next()
}

const argsReg = /\([\s\S]*?\)/
const fnBodyReg = /\{[\s\S]*\}/
const awaitReg = /(\s)await(\s)/g
/**
 *@param {Function} fn 
 */
function changeAwaitToGenerator(fn) {
  const str = fn.toString()
  let argsKey = str.match(argsReg)[0]
  let fnBody = str.match(fnBodyReg)[0]
  fnBody = fnBody.replace(awaitReg, ' yield ')
  const evalFn = `globalThis[Symbol.for('ccj.myGenerator')] = function* __Generator${argsKey} ${fnBody}`
  return () => eval(evalFn)
}


// 例子  使用字符串而不是直接用函数，是因为在不用async中的函数使用await会报错
const a = `function a(b, c, d) {
  console.log(1)
  await new Promise(res => {
    setTimeout(() => {
      res()
    }, 1000);
  })
  console.log(b,c,d)
}`

myAsync(a, 1, 2, 3)


