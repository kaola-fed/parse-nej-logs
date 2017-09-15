var parser = require('..');

parser({
    dirname: './__fixures__/',
    interruptLevel: 99,
    getWarningLevel: null
}).catch(function(e) {
    console.error(e);
    process.exit(1);
});