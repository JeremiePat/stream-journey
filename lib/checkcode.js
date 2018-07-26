const fs = require('fs')
const path = require('path')

const clearComments = /\/\/.*\n|\/\*.*?\*\//g

module.exports = function (filepath, tests) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(filepath), 'utf8', (err, data) => {
      if (err) { return reject(err) }

      // We aren't interrested in comments
      const code = data.replace(clearComments, '')

      // Let's get all the error message for the failing tests
      const errors = tests
        // First we get only the tests that fails
        .filter((test) => {
          var fail = test.rgx.test(code)

          return test.shouldFail ? fail : !fail
        })
        // Then we get the associated error messages
        .map((test) => test.error)

      resolve(errors)
    })
  })
}
