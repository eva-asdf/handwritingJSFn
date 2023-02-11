// 递归实现
const deepClone = (target, hash = new WeakMap()) => {
  if (target instanceof RegExp) return new RegExp(target)
  if (target instanceof Date) return new Date(target)
  if (typeof target !== "object" && typeof target !== 'function') return target
  if (hash.has(target)) return hash.get(target)
  const newClone = new target.constructor()
  hash.set(target, newClone)

  for (const key in target) {
    if (Object.hasOwnProperty.call(target, key)) {
      newClone[key] = deepClone(target[key], hash)
    }
  }
  return newClone
}

// 循环实现
const deepCloneLoop = function (target) {
  if (typeof target !== 'object' && typeof target !== 'function') return target
  const queue = [{
    parent: null,
    key: undefined,
    data: target
  }]
  const map = new WeakMap()

  let ans

  while (queue.length) {
    const { data: obj, parent, key } = queue.pop()
    if (map.has(obj)) {
      parent[key] = map.get(obj)
      break;
    }
    const cl = new obj.constructor()
    map.set(obj, cl)
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        const val = obj[key]
        if (typeof val !== 'object' && typeof val !== 'function') {
          cl[key] = val
        } else {
          queue.push({
            parent: cl,
            key: key,
            data: val
          })
        }
      }
    }
    if (parent && key) {
      parent[key] = cl
    } else {
      ans = cl
    }
  }
  return ans
}

/**
 * 递归实现效率更好
 */