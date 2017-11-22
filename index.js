/**
 * Created by hzxujunyu on 2017/9/14.
 */
var getLogFile = require('./libs/getLogFile');
var fs = require('./libs/fs');
var filterExceptionLines = require('./libs/filterExceptionLines');
var symbolToReg = require('./libs/symbolToReg');
var compose = require('./libs/compose');

function getContent(filename) {
    return fs.readFile(filename)
        .then(function(content) {
            return content.toString();
        })
}

function splitLogLine(content) {
    content = content || '';
    var list = content.split('\n');

    return list.reduce(function(prev, line) {
        if (0 === line.indexOf('[')) {
            prev.push(line);
        } else {
            prev[prev.length - 1] += line;
        }
        return prev;
    }, []);
}

function parser(refs) {
    var dirname = refs.dirname;
    var interrupt = refs.interrupt || {};

    interrupt = Object.assign({
        css: {
            exited: true
        }, javascript: {
            exited: true
        }, html: {
            exited: true
        }
    }, interrupt);

    return getLogFile(dirname)
        .then(function(logFile) {
            return getContent(logFile)
        })
        .then(function(content) {
            var lines = splitLogLine(content);
            return filterExceptionLines(lines);
        })
        .then(function(refs) {
            var warningLines = refs.warningLines;
            var errorLines = refs.errorLines;
            if (errorLines.length > 0) {
                return Promise.reject(errorLines.join('\n'));
            }
            return warningLines;
        })
        .then(function(warningLines) {
            warningLines = warningLines.filter(warningLine => {
                if (interrupt.javascript.existed && isMissedJsFile(warningLine)) {
                    return true;
                }

                if (interrupt.html.existed && isMissedHTMLFile(warningLine)) {
                    return true;
                }
            
                if (interrupt.css.existed && isMissedCssFile(warningLine)) {
                    return true;
                }

                return false;
            });

            if (warningLines.length > 0) {
                return Promise.reject(warningLines.join('\n'));
            }
        })

}

function isMissedJsFile(line) {
    return compose(isJsFile, isMissedFile)(line);
};

function isMissedCssFile(line) {
    return compose(isCssFile, isMissedFile)(line);
}

function isMissedHTMLFile(line) {
    return compose(isHTMLFile, isMissedFile)(line);
}

function isMissedFile(line) {
    var i = 'cant read file %s for %s, cause:%j';
    var reg = symbolToReg(i);
    return reg.exec(line);
}

function isJsFile(filename) {
    return /\.js/g.test(filename);;
}

function isCssFile(filename) {
    return /\.css/g.test(filename);;
}

function isHTMLFile(filename) {
    return /\.html/g.test(filename);;
}

module.exports = parser;
parser.isMissedFile = isMissedFile
parser.isMissedJsFile = isMissedJsFile
parser.isMissedCssFile = isMissedCssFile
parser.isMissedHTMLFile = isMissedHTMLFile