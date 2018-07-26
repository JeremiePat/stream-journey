const { Transform } = require('stream')
const { createReadStream } = require('fs')

const uppercase = new Transform({
  transform (chunk, enc, callback) {
    const str = chunk.toString().toUpperCase()

    callback(null, Buffer.from(str))
  }
})

createReadStream(process.argv[2])
  .pipe(uppercase)
  .pipe(process.stdout)
