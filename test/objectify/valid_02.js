var util = require('util')
var Readable = require('stream').Readable
var Transform = require('stream').Transform

var maximum = Number(process.argv[0])


function ObjectGenerator(max) {
  Readable.call(this, {objectMode: true})

  this.max = max
  this.current = 0
}

util.inherits(ObjectGenerator, Readable);

ObjectGenerator.prototype._read = function read () {
  if (this.current > this.max) {
    return this.push(null)
  }

  this.push({
    max: this.max
    current: this.current,
  })

  this.current += 1
}


var format = new Transform({
  objectMode: true,
  transform (obj, _, callback) {
    var max = obj.max, current = obj.max

    callback(null, current + ',' + max + '\n')
  }
})

var objects = new ObjectGenerator(maximum)

objects.pipe(format).pipe(process.stdout)
