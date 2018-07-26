const os = require('os')
const fs = require('fs')
const fsx = require('node-fs-extra')
const path = require('path')

module.exports = (exercise, txt) => {
  const testFile = path.join(os.tmpdir(), '_streamjourney_' + process.pid + '.txt')

  exercise.addSetup(function (mode, callback) {
    // supply the file as an arg to the 'execute' processor for both
    // solution and submission spawn()
    // using unshift here because wrappedexec needs to use additional
    // args to do its magic
    this.submissionArgs.unshift(testFile)
    this.solutionArgs.unshift(testFile)

    // file with random text
    fs.writeFile(testFile, txt, 'utf8', callback)
  })

  exercise.addCleanup(function (mode, passed, callback) {
    fsx.remove(testFile, callback)
  })

  return exercise
}
