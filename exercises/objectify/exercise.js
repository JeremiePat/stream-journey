const path = require('path')
const { Transform } = require('stream')
const faker = require('faker')
const checkCode = require('../../lib/checkcode')

const execute = require('workshopper-exercise/execute')
const exercise = require('workshopper-exercise')()
const filecheck = require('workshopper-exercise/filecheck')
const comparestdout = require('workshopper-exercise/comparestdout')


// Assert the code for some expectation
// ----------------------------------------------------------------------------
function checkUpCode (callback) {
  const tests = [
    // Some function calls are forbiden
    { error: this.__('fail.abusive', { method: 'console.log()' }),
      rgx: /console\s*\.\s*log\s*\(/, shouldFail: true },

    // Some function calls are expected
    { error: this.__('fail.expected', { method: 'Readable' }),
      rgx: /\s+Readable\s*(?:\(|\{)/, shouldFail: false },

    { error: this.__('fail.expected', { method: 'Transform' }),
      rgx: /\s+Transform\s*(?:\(|\{)/, shouldFail: false },

    { error: this.__('fail.expected', { method: 'objectMode (2)' }),
      rgx: /(?:objectMode\s*\:[\s\S]*?){2}/, shouldFail: false }
  ]

  checkCode(this.args[0], tests)
    .then((errors) => {
      if (errors.length > 0) {
        errors.forEach((error) => { this.emit('fail', error) })
      }

      callback(null, errors.length === 0)
    }, callback)
}


// Set up the exercise
// ----------------------------------------------------------------------------

// checks that the submission file actually exists
filecheck(exercise)

// execute the solution and submission in parallel with spawn()
execute(exercise)

// compare stdout of solution and submission
comparestdout(exercise)

// Pass a random number in the range [3,8] as command line argument
exercise.addSetup(function (mode, callback) {
  const max = String(faker.random.number({min:3, max:8}))

  // supply the number as an arg to the 'execute' processor for both
  // solution and submission spawn()
  // using unshift here because wrappedexec needs to use additional
  // args to do its magic
  this.submissionArgs.unshift(max)
  this.solutionArgs.unshift(max)

  callback()
})

// add a processor only for 'verify' calls
exercise.addVerifyProcessor(checkUpCode)

module.exports = exercise
