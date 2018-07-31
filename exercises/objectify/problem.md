Once we are familiar with `Transform` streams, one of the next use case that came early is creating our own Readable stream to output our own data. Let's take that opportunity to explore two more aspects of stream building: `Class` extention and `objectMode`.

When building a `Transform` stream, we can usualy do what we need through a simple `transform` function and to do that, the simplified constructor version is enough. When building readable stream, it's also possible to use a simplified contructor, in that case, the core function is called `read`

```
// This create an infinite number generator
const RandomGenerator = new Readable({
  read (size) {
    const data = Math.round(Math.random() * size)
    this.push(String(data))
  }
})
```

The trick is that many times we want to initialize our Readable string to fit our own needs. In that case it's easier to extend the Readable class to create our own custom `Readable` stream.

```
// This create a number generator that
// will output 'count' numbers
class MyReadable extends Readable {
  constructor (options) {
    super(options)

    this.count = options.count
  }

  _read (size) {
    if (this.count < 0) {
      return this.push(null)
    }

    const data = Math.round(Math.random() * size)
    this.push(String(data))
    this.count -= 1
  }
}

const RandomGenerator = new MyReadable()
```

In that sample code, you'll notice that *read* has became *_read*. When we extend a class we have to closely follow it's API and the internal read function is actually called _read (it's the same with `Transform` stream where `transform` become `_transform`). It's a convention to indicate that this function is part of the internal API and should *NEVER* be called directely on a stream instance.

Because Node.js already provides many options to create streams of data, one of the most common use case for creating our own `Readable` streams is to create objects on the fly that will be processed as a flow.

To fit that use case, all type of stream can be used in `objectMode`. If this option is set to true, all the chunk passed along the stream will be regular JavaScript object instead of `Buffers` or `strings`

```
// This a trivial example on how to transform
// an array of values into a stream of objects.
class MyReadable extends Readable {
  constructor (names = []) {
    super({ objectMode: true })

    this.names = names
  }

  _read (size) {
    if (this.names.length <= 0) {
      return this.push(null)
    }

    const data = { name: this.names.pop() }
    this.push(data)
  }
}

class MyTransform extends Transform {
  constructor (options) {
    options.objectMode = true
    super(options)
  }

  _transform (obj, _, callback) {
    const str = JSON.stringify(obj)
    callback(null, str)
  }
}

const objectMaker    = new MyReadable(['Lucy','Joe'])
const objectFormater = new MyTransform()

objectMaker
  .pipe(objectFormater)
  .pipe(process.stdout)
```

------------------------------------------------------------------------------
## EXERCISE

In that exercise, you must create two streams: One readable stream and one transform stream.

The readable stream will output objects that will contain two properties: `current` and `max`. Those two properties will be numbers where `max` will be provided as the first arguments of its constructor and `current` will be incremented from 0 to `max` each time the read fonction is called.

The transform stream must format each object in a way that the values of `current` and `max` will be output as a single string on a new line with each value separated by a coma (current first).

The value of `max` to be used when instenciating the readable stream will be provided as the first command-line argument (i.e., `process.argv[2]`).

------------------------------------------------------------------------------
## HINT

To do that exercise, you'll need information available into the Node.js documentation, more specifically:

- https://nodejs.org/api/fs.html#fs_fs_createreadstream_path_options
- https://nodejs.org/api/process.html#process_process_stdout
