var path = require('path');
var logReg = /(^\d*).log$/;
var fs = require('./fs');

function getLogFile(dirname) {
    return fs.readdir(dirname)
        .then(function(filenames) {
            return filenames.filter(function(filename) {
                return isLogFile(filename);
            })
        })
        .then(function(filenames) {
            return filenames.map(function(filename) {
                return {
                    filename: filename,
                    timestamp: Number(getTimeStamp(filename))
                };
            })
        })
        .then(function(fileInfo) {
            var timestamps = fileInfo.map(function(ref) {
                return ref.timestamp;
            });
            var recentTimestamp = getRecentTimestampIndex(timestamps);
            var ref = fileInfo[recentTimestamp];
            return path.join(dirname, ref.filename);
        })
}

function getTimeStamp(file) {
    var matched = logReg.exec(file);
    return matched && matched[1];
}

function getRecentTimestampIndex(timestamps) {
    var recentTimestamp = Math.max.apply(null, timestamps);
    return timestamps.indexOf(recentTimestamp);
}

function isLogFile(file) {
    return logReg.test(file);
}

module.exports = getLogFile;