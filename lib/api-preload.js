global.setImmediate = fn => setTimeout(fn, 0)

const qs = require('qs')

const get = (theUrl) => new Promise(resolve => {
  const xmlHttp = new XMLHttpRequest()
  xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      resolve(xmlHttp.responseText)
  }
  xmlHttp.open("GET", theUrl, true)
  xmlHttp.send(null);
})

global.apiLoaded = (async () => {
  const serialized = JSON.parse(await get('/api'))
  global.api = await Object.keys(serialized).reduce((result, curr) => {
    result[curr] = async args => {
      let res
      if (Object.keys(args || {}).length === 0) {
        res = await get(`/api/${curr}`)
      } else {
        res = await get(`/api/${curr}?${qs.stringify(args)}`)
      }
      return JSON.parse(res)
    }
    return result
  }, {})
  return global.api
})()