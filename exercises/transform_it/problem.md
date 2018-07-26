Most of the time, when we want to use streams, `Readable` and `Writable`
streams are created through some native Node.js function and we often just
want to perform transform operations along the flow of data. So let's dig
into implementing `Transform` streams.

Node.js provide the convenient _stream_ module to let us build our own
streams. Each type of stream is built using a dedicated constructor. For
example, if we want to build a very simple transform stream we will
proceed like this:

```
const { Transform } = require('stream')

const myTransform = new Transform({
  transform (chunk, encoding, callback) {
    var str

    str = chunk.toString()
    str = str.replace('.', '.\n')

    callback(null, str)
  }
})
```

Let's dig a bit into this example.

First of all we pull the `Transform` constructor out of the _stream_ module.

```
const { Transform } = require('stream')
```

Then, we instantiate a new `Transform` stream with a configuration object
that provide a function `transform` to be called on each chunk of the stream.

```
const myTransform = new Transform({
  transform (chunk, encoding, callback) {
    /* ... */
  }
})
```

That transform function is the heart of the transform stream. It takes
three parameters as input:

  1. `chunk` which can be a `Buffer` object, a string or a regular object (by default it's a `Buffer`)
  2. `encoding` which is the encoding of the `chunk` (if the chunk is a string, otherwise it is the special value `buffer`)
  3. `callback` which is a callback function to be called once we are finished with our transformation.

In our example:

```
// This transform function
transform (chunk, encoding, callback) {
  var str

  // is converting each chunk into a string
  str = chunk.toString()

  // then it adds a new line after each dots
  str = str.replace('.', '.\n')

  // and finally it sends the new string directly into the stream.
  callback(null, str)
}
```

Once all of this is done, it will be just about piping a readable stream
into our transform stream and then piping our transform stream into a
writable stream.

A basic stream often look like this in the end:

READABLE ----> TRANSFORM ----> WRITABLE

And because a `Transform` stream is both `Readable` and `Writable` it's quite
easy to chain multiple transformation as needed.

That said, now it's your turn!

------------------------------------------------------------------------------
## EXERCISE

Write a program that reads a file, uppercase its content and send the
result to the standard output, using only streams.

The full path to the file to read will be provided as the first
command-line argument (i.e., `process.argv[2]`). You do not need to make
your own test file.

------------------------------------------------------------------------------
## HINT

To do that exercise, you'll need information available into the Node.js documentation, more specifically:

- https://nodejs.org/api/fs.html#fs_fs_createreadstream_path_options
- https://nodejs.org/api/stream.html#stream_implementing_a_transform_stream
- https://nodejs.org/api/buffer.html#buffer_buf_tostring_encoding_start_end
- https://nodejs.org/api/buffer.html#buffer_class_method_buffer_from_string_encoding
- https://nodejs.org/api/process.html#process_process_stdout

And remember to refresh your memory about JavaScript as needed:

- https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String
- https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase
