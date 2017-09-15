function compose() {
    var fns = Array.from(arguments);
    if (fns.length === 2) {
        return function(x) {
            return fns[0](fns[1](x));
        }
    }
    return function(x) {
        return fns[0](
            compose.apply(
                null, fns.slice(1)
            )(x)
        );
    };
}

module.exports = compose;