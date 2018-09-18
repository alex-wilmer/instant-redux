const argv = require('yargs').argv

require('@babel/register')({

})

if (argv.script) require(`./${argv.script}`)
