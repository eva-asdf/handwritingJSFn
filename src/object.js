function myCreate(proto, propertiesObject) {
  if (typeof proto !== 'object') throw Error('ERROR')
  function F() { }
  Object.setPrototypeOf(F, proto)
  const o = new F()

  for (const key in propertiesObject) {
    if (propertiesObject.hasOwnProperty(key)) {
      const val = propertiesObject[key]
      if (typeof val !== "object") throw Error('ERROR')
      Object.defineProperty(o, key, val)
    }
  }
}

function myInstanceof(obj, target) {
  let p = Object.getPrototypeOf(obj)
  while (p) {
    if (p === target.prototype) return true
    p = Object.getPrototypeOf(p)
  }
  return false
}
