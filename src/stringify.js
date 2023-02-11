function myStringify(value, replaser = (_, val) => val, space) {
  let res = ''
  if (typeof replaser === 'function') {
    value = replaser('', value)
    if (typeof value !== 'object') return dealSimple('', value)
    if (!Array.isArray(value)) {
      res += '{'
      for (const key in value) {
        let val = replaser(key, value[key])
        if (typeof val === 'object') {
          res += `${key}: ${myStringify(val, replaser, space)},`
        } else {
          res += dealSimple(key, val)
        }
      }
      res = res.slice(0, res.length - 1) + '}'
    } else {
      res += '['
      for (const key in value) {
        let val = replaser(key, value[key])
        if (typeof val === 'object') {
          res += myStringify(val, replaser, space)
        } else {
          res += dealSimple(key, val, true)
        }
      }
      res = res.slice(0, res.length - 1) + ']'
    }
    return res
  }
}
function beautyString(str) {
  return '"' + str + '"'
}

function isDelete(val) {
  return val === undefined || typeof val === 'symbol' || typeof val === 'function'
}

function beautyNumber(str) {
  return "'" + str + "'"
}

function dealSimple(key, val, isArray) {
  if (isDelete(val)) return isArray ? null + ',' : ''
  if (typeof val === 'string') val = beautyString(val)
  if (typeof val === 'number') val = beautyNumber(val)
  return (isArray ? val : `${key}: ${val}`) + ','
}


// myStringify({ a: 1, b: '1', c: undefined, d: [1, 2, 3] })
console.log(myStringify({ a: 1, b: '1', c: undefined, d: [1, '2', undefined, 3], e: function (params) { } }));