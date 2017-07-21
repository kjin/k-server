require('./annotate')

const path = require('path')
const browserify = require('browserify')

const pino = require('pino')()

const apiPreloadJs = new Promise((resolve, reject) => {
  const b = browserify(path.join(__dirname, 'api-preload.js'), {
    debug: true
  })
  b.bundle((err, src) => {
    if (err) {
      reject(err)
      return
    }
    resolve(src)
  })
})

module.exports = (api) => {
  const hydrated = JSON.stringify(Object.keys(api).reduce((result, curr) => {
    result[curr] = api[curr].getAnnotations()
    return result
  }, {}))

  return async (req, res) => {
    if (!req.path.startsWith('/api')) {
      return
    }
    if (req.path === '/api') {
      res.send(hydrated)
      return
    } else if (req.path === '/api-preload.js') {
      res.send(await apiPreloadJs)
      return
    }
    const subPath = req.path.substr(5)
    const input = req.query || {}
    const output = await api[subPath](input)
    pino.info({ input, output })
    res.send(JSON.stringify(output))
  }
}