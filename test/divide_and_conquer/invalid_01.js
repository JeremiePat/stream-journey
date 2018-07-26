const fs = require('fs')
const file = process.argv[2]

const readable = fs.createReadStream(file)

var count = 0

readable.on('data', (data) => {
  count = String(data).split(' ')
    .map((      n) => { Number(n) })
    .filter((   n) => { n === n })
    .reduce((c, n) => { console.log(n); return c + n }, count)
})

readable.on('end', () => console.log(count))
