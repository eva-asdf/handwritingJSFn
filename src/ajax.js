const ajax = (method, data, timeout, url) => {
  return new Promise((res, rej) => {
    const h = new XMLHttpRequest()
    h.open(method, url)
    if (method === 'get' || method === 'GET') {
      h.send()
    } else if (method === 'POST' || method === 'post') {
      h.send(data)
    }
    h.onreadystatechange = function () {
      if (h.readyState === 4) {
        if ((h.status <= 300 && h.status >= 200) || h.status === 304) {
          res(h.responseText)
        } else {
          rej(h.response)
        }
      } else {
        rej(h.response)
      }
    }
  })

}