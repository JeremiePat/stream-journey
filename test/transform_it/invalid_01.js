const fs = require('fs')
const file = process.argv[2]

const readable = fs.createReadStream(file)

readable.on('data', (data) => console.log(data.toString().toUpperCase()))
