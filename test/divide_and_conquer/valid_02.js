const file = process.argv[2]

const { Transform } = require('stream')
const { createReadStream } = require('fs')

const getNumbers = new Transform({
  transform (chunk, enc, callback) {
    String(chunk).split(' ')
      .filter( n => !Number.isNaN(Number(n)))
      .forEach(n => this.push(n))

    callback()
  }
})

const addNumbers = new Transform({
  transform (chunk, enc, callback) {
    this.count = (this.count || 0) + Number(chunk)

    callback(null, chunk)
  },

  flush (callback) {
    callback(null, String(this.count))
  }
})

const addNexLines = new Transform({
  transform (chunk, enc, callback) {
    this.push(chunk)
    this.push('\n')
    callback()
  }
})

createReadStream(file)
  .pipe(getNumbers)
  .pipe(addNumbers)
  .pipe(addNexLines)
  .pipe(process.stdout)
