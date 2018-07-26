`Transform` streams can drastically change the nature of the stream. Among
many things, they can change the length of the chunks, add new chunks or
remove entire chunks of data out of the stream.

We've seen that a transform function can send back a chunk in the stream
through the callback function:

```
transform (chunk, enc, callback) {
  callback(null, chunk)
}
```

However this is just a nice shorthand for using the `push` method inherited
from the `Readable` interface:

```
transform (chunk, enc, callback) {
  this.push(chunk)
  callback()
}
```

The `push` method has a huge benefits: It can be called as much as needed to
send new chunks of data.

However, `push` alone isn't enough to push a new content specifically at the
end of the stream. This is due to the fact that the transform function as
no way to know if the chunk of data it works on is the last one.

To solve that problem, `Transform` stream use another function named `flush`
that will be called before closing the stream, giving a last opportunity
to add new chunks of data to the stream.

One common use case for `flush` is to create a stream accumulator that will
consume all the data from the stream before sending a single final chunk
of data. For example here is how you can count the total length of a text
when this text is read as a stream:

```
const countLetters = new Transform({
  transform (chunk, enc, callback) {
    this.count = (this.count || 0) + String(chunk).length

    // Calling callback without anything will drain the next
    // chunck of data without sending anything in the stream.
    callback()
  },

  flush (callback) {
    // Let's send the total length of the text in the stream
    callback(null, String(this.count))
  }
})
```

Knowing all of that you should be ready for the next exercise!


------------------------------------------------------------------------------
## EXERCISE

Create a program that will read a file, transform its content and output
the result in the standard output.

The full path to the file to read will be provided as the first
command-line argument (i.e., `process.argv[2]`). You do not need to make
your own test file.

The file contain both numbers and words separated by spaces.

Your transform stream must extract each numbers contained within chunks,
and send them all, followed by a new line, to the next stream. In the end
it must send the sum of all those numbers, also followed by a new line, as
a final action.

------------------------------------------------------------------------------
## HINT

For some people, it can be easier to split up the transformation logic
into several transform stream rather than trying to do everything in a
single one.

In that exercice there are three transform steps: extract the numbers; sum
all the numbers; add a new line after each numbers.

To do that exercise, you'll need information available into the Node.js
documentation, more specifically:

- https://nodejs.org/api/stream.html#stream_transform_flush_callback
- https://nodejs.org/api/stream.html#stream_readable_push_chunk_encoding
