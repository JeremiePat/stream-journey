Conceptually, a stream is a nothing but a flow of data. Once you acknowledge that, it's all about being a plumber plugging a stream into another to deal with that flow of data in a way that suits you.

Streams are one of the core functionality of Node.js and you sometimes use them without even noticing it. Many native Node.js modules are using stream extensively: file system, network, processes, encryption, etc.

Node.js provide many utility functions that either create or consume streams. For example, reading a file can be done using the `createReadStream` function from the File System module and writing a into a file can be done using the `createWriteStream` function from the same module. So copying a file can be done like this:

```
const fs = require('fs')
const readable = fs.createReadStream('file.txt')
const writable = fs.createWriteStream('copy.txt')

readable.pipe(writable)
```

That simple sample code highlight many concepts about Node.js streams:

1. Streams come in different flavors: `Readable` (to output data), `Writable` (to consume data), and `Duplex` (to do both)
2. Streams are plugged one into another using the `pipe()` function.

We'll get into the details of how to create and consume all those type of streams in the next exercises, now it's time to get your hands dirty!

------------------------------------------------------------------------------
## EXERCISE

Write a program that create a readable stream to a file and output the file content to the console (also known as the standard output).

The full path to the file to read will be provided as the first command-line argument (i.e., `process.argv[2]`). You do not need to make your own test file.

------------------------------------------------------------------------------
## HINT

To do that exercise, you'll need information available into the Node.js documentation, more specifically:

- https://nodejs.org/api/fs.html#fs_fs_createreadstream_path_options
- https://nodejs.org/api/process.html#process_process_stdout
