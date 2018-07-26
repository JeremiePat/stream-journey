const fs = require('fs')
const file = process.argv[2]

const content = fs.readFileSync(file, 'utf8')
console.log(content.toUpperCase())
