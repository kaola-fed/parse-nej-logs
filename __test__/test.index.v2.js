var parse = require('..');

parse({
    dirname: './__fixures__/',
    interrupt: {
        css: {
            existed: true
        },
        javascript: {
            existed: true
        },
        html: {
            existed: true
        }
    }
}).catch(function(e) {
    console.error(e);
    process.exit(1);
});