const { Transform } = require('stream')
const { createReadStream } = require('fs')

const uppercase = new Transform({
  transform (chunk, enc, callback) {
    const str = chunk.toString(enc).toUpperCase()

    callback(null, Buffer.from(str, enc))
  }
})

createReadStream(process.argv[2])
  .pipe(uppercase)
  .pipe(process.stdout)
