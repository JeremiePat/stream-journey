const fs = require('fs')
const file = process.argv[2]

const readable = fs.createReadStream(file)
const writable = process.stdout

readable.pipe(writable)
