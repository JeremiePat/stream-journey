const fs = require('fs')
const file = process.argv[2]

const content = fs.readFileSync(file, 'utf8')
const count = content.split(' ')
  .map((      n) => { Number(n) })
  .filter((   n) => { n === n })
  .reduce((c, n) => { console.log(n); return c + n }, 0)

console.log(count)
