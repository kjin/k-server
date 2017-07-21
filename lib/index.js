require('./annotate')

const path = require('path')
const express = require('express')
const apiMiddleware = require('./api-middleware')

const api = require(path.join(process.cwd(), 'server'))

const Browserify = require('browserify')
const watchify = require('watchify')

let clientJs = (() => {
  const b = new Browserify(path.join(process.cwd(), 'client/index.jsx'), {
    debug: true,
    cache: {},
    packageCache: {}
  })
  b.plugin(watchify)
  b.transform('babelify', { presets: [ 'react' ] })
  const generateClient = () => new Promise((resolve, reject) => {
    b.bundle((err, src) => {
      if (err) {
        reject(err)
        return
      }
      resolve(src)
    })
  }).then(src => {
    console.log('Successfully parsed client')
    return src
  }, err => {
    console.error(err.message)
    return 'Error parsing client - see logs'
  })
  b.on('update', async () => {
    await clientJs
    clientJs = generateClient()
  })
  return generateClient()
})()

const app = express()

app.get('/', async (req, res) => {
  res.send('<html><head><link rel="stylesheet" text="text/css" href="style.css"><script src="api-preload.js"></script></head><body><div id="root"></div><script src="index.js"></script></body></html>')
})

app.get('/index.js', async (req, res) => {
  res.send(await clientJs)
})

app.get('/style.css', async (req, res) => {
  // TODO Preprocessor time
  res.send('body { margin: 0; text-align: center; }')
})

app.use(apiMiddleware(api))

app.listen(3000, () => {
  console.log('Now listening on port 3000')
})