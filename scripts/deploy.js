/* deploy.js */

/* updates production package.json */

const fs = require('fs')
const jsonfile = require('../package.json')

jsonfile.scripts = { start: 'node ./server/main.js' }
jsonfile.devDependencies = {}

fs.writeFileSync('./dist/package.json', JSON.stringify(jsonfile))
