const file = process.argv[2]

const { Transform } = require('stream')
const { createReadStream } = require('fs')

const uppercase = new Transform({
  transform (chunk, enc, callback) {
    const str = String(chunk).toUpperCase()

    callback(null, str)
  }
})

createReadStream(file)
  .pipe(uppercase)
  .pipe(process.stdout)
