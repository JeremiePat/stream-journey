const os = require('os')
const fs = require('fs')
const fsx = require('node-fs-extra')
const path = require('path')
const faker = require('faker')

const execute = require('workshopper-exercise/execute')
const exercise = require('workshopper-exercise')()
const filecheck = require('workshopper-exercise/filecheck')
const comparestdout = require('workshopper-exercise/comparestdout')

// Create test file on demand
// ----------------------------------------------------------------------------
var testFile = path.join(os.tmpdir(), '_streamjourney_' + process.pid + '.txt')

function setUpFile (mode, callback) {
  var txt = faker.lorem.sentence(5)

  // supply the file as an arg to the 'execute' processor for both
  // solution and submission spawn()
  // using unshift here because wrappedexec needs to use additional
  // args to do its magic
  this.submissionArgs.unshift(testFile)
  this.solutionArgs.unshift(testFile)

  // file with random text
  fs.writeFile(testFile, txt, 'utf8', callback)
}

function cleanUpFile (mode, passed, callback) {
  fsx.remove(testFile, callback)
}


// Assert the code for some expectation
// ----------------------------------------------------------------------------
function checkUpCode (callback) {
  const clearComments = /\/\/.*\n|\/\*.*\*\//g

  // Some function call are forbiden
  const forbidden = {
    'fs.readFile()':     /readFile\s*\(/,
    'fs.readFileSync()': /readFileSync\s*\(/,
    'console.log()':     /console\s*\.\s*log\s*\(/,
  }

  // Some function call are expected
  const expected = {
    'fs.createReadStream()': /createReadStream\s*\(/
  }

  // We need to access the source code to perform our check
  fs.readFile(path.resolve(this.args[0]), 'utf8', (err, data) => {
    if (err) { return callback(err) }

    // We aren't interrested in comments
    const code = data.replace(clearComments, '')

    const KO = Object.keys(forbidden).some((method) => {
      if (!forbidden[method].test(code)) { return false }

      this.emit('fail', this.__('fail.abusive', { method }))
      return true
    })

    const OK = Object.keys(expected).every((method) => {
      if (expected[method].test(code)) { return true }

      this.emit('fail', this.__('fail.expected', { method }))
      return false
    })

    callback(null, OK && !KO)
  })
}


// Set up the exercise
// ----------------------------------------------------------------------------

// checks that the submission file actually exists
filecheck(exercise)

// execute the solution and submission in parallel with spawn()
execute(exercise)

// compare stdout of solution and submission
comparestdout(exercise)

// set up the data file to be passed to the submission
exercise.addSetup(setUpFile)

// add a processor only for 'verify' calls
exercise.addVerifyProcessor(checkUpCode)

// cleanup for both run and verify
exercise.addCleanup(cleanUpFile)

module.exports = exercise
