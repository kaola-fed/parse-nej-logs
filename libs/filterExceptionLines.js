function filterWarningLine(line) {
    return line.indexOf('[W]') === 0;
}

function filterErrorLine(line) {
    return line.indexOf('[E]') === 0;
}

function filterWarningAndErrorLines(lines) {
    return {
        warningLines: lines.filter(function(line) {
            return filterWarningLine(line);
        }),
        errorLines: lines.filter(function(line) {
            return filterErrorLine(line);
        })
    };
}

module.exports = filterWarningAndErrorLines;