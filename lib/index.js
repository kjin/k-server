require('./annotate')

const fs = require('fs')
const path = require('path')
const express = require('express')
const apiMiddleware = require('./api-middleware')

const api = require(path.join(process.cwd(), 'server'))

const Browserify = require('browserify')
const watchify = require('watchify')
const tsify = require('tsify')

let clientJs = (() => {
  const extension =
    fs.existsSync('client/index.js') ? 'js' :
    fs.existsSync('client/index.jsx') ? 'jsx' :
    fs.existsSync('client/index.ts') ? 'ts' :
    fs.existsSync('client/index.tsx') ? 'tsx' :
      null;
  if (!extension) {
    throw new Error('Unknown client entry point')
  }
  const b = new Browserify(path.join(process.cwd(), `client/index.${extension}`), {
    debug: true,
    cache: {},
    packageCache: {}
  })
  b.plugin(watchify)
  if (extension === 'ts') {
    b.plugin(tsify, { lib: ['es2015', 'dom'] })
  } else if (extension === 'tsx') {
    b.plugin(tsify, { lib: ['es2015', 'dom'], jsx: 'react' })
  } else if (extension === 'jsx') {
    b.transform('babelify', { presets: [ 'es2015', 'react' ] })
  } else {
    b.transform('babelify', { presets: [ 'es2015' ] })
  }
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
  res.send('body { margin: 0; }')
})

app.use(apiMiddleware(api))

app.listen(3000, () => {
  console.log('Now listening on port 3000')
})
