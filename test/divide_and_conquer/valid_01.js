const file = process.argv[2]

const { Transform } = require('stream')
const { createReadStream } = require('fs')

const count = new Transform({
  transform (chunk, enc, callback) {
    String(chunk).split(' ').forEach((n) => {
      const num = Number(n)

      if (num === +num) {
        this.push(String(num))
        this.push('\n')
        this.sum = (this.sum || 0) + num
      }
    })

    callback()
  },

  flush (callback) {
    this.push(String(this.sum))
    callback(null, '\n')
  }
})

createReadStream(file)
  .pipe(count)
  .pipe(process.stdout)
