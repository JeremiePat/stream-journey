const faker = require('faker')
const checkCode = require('../../lib/checkcode')
const provideFile = require('../../lib/file')
const { Readable, Transform } = require('stream')

const execute = require('workshopper-exercise/execute')
const exercise = require('workshopper-exercise')()
const filecheck = require('workshopper-exercise/filecheck')
const comparestdout = require('workshopper-exercise/comparestdout')


// Util function
// ----------------------------------------------------------------------------
function mixedContent (length) {
  const arr = new Array(length)

  for (let i = 0; i < length; i++) {
    arr[i] = faker.random.boolean() || i === length - 1
           ? faker.random.word()
           : faker.random.number(100)
  }

  return arr.join(' ')
}


// Assert the code for some expectation
// ----------------------------------------------------------------------------
function checkUpCode (callback) {
  const tests = [
    // Some function calls are forbiden
    { error: this.__('fail.abusive', { method: 'fs.readFile()' }),
      rgx: /readFile\s*\(/, shouldFail: true },

    { error: this.__('fail.abusive', { method: 'fs.readFileSync()' }),
      rgx: /readFileSync\s*\(/, shouldFail: true },

    { error: this.__('fail.abusive', { method: 'console.log()' }),
      rgx: /console\s*\.\s*log\s*\(/, shouldFail: true },

    // Some function calls are expected
    { error: this.__('fail.expected', { method: 'fs.createReadStream()' }),
      rgx: /createReadStream\s*\(/, shouldFail: false },

    { error: this.__('fail.expected', { method: 'new Transform()' }),
      rgx: /new\s+Transform\s*\(/, shouldFail: false },

    { error: this.__('fail.expected', { method: 'flush()' }),
      rgx: /\s+flush\s*\(/, shouldFail: false },

    { error: this.__('fail.expected', { method: 'push()' }),
      rgx: /\.push\s*\(/, shouldFail: false }
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

// set up the data file to be passed to the submission (for both verify and run)
provideFile(exercise, mixedContent(faker.random.number({min: 5, max: 10})))

// add a processor only for 'verify' calls
exercise.addVerifyProcessor(checkUpCode)

module.exports = exercise
