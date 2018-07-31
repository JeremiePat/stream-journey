const { Readable, Transform } = require('stream')
const maximum = Number(process.argv[0])

class ObjectGenerator extends Readable {
  constructor (max) {
    super({objectMode: true})

    this.max = max
    this.current = 0
  }

  _read () {
    if (this.current > this.max) {
      return this.push(null)
    }

    this.push({
      max: this.max
      current: this.current,
    })

    this.current += 1
  }
}

const format = new Transform({
  objectMode: true,
  transform (obj, _, callback) {
    const { max, current } = obj

    callback(null, `${current},${max}\n`)
  }
})

const objects = new ObjectGenerator(maximum)

objects.pipe(format).pipe(process.stdout)
